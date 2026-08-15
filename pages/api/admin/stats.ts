import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/serverAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }
    const client = supabaseAdmin;

    // Get donation statistics
    const { data: donations, error: donationsError } = await (client as any)
      .from('donations')
      .select('amount, currency, created_at, payment_method, status, donor_id')
      .limit(10000);

    if (donationsError && donationsError.code !== 'PGRST116') {
      console.error('Error fetching donations:', donationsError);
    }

    // Get donor count
    const { count: donorCount, error: donorError } = await (client as any)
      .from('donors')
      .select('*', { count: 'exact', head: true });

    if (donorError && donorError.code !== 'PGRST116') {
      console.error('Error fetching donor count:', donorError);
    }

    // Get volunteer count
    const { count: volunteerCount, error: volunteerError } = await (client as any)
      .from('volunteers')
      .select('*', { count: 'exact', head: true });

    if (volunteerError && volunteerError.code !== 'PGRST116') {
      console.error('Error fetching volunteer count:', volunteerError);
    }

    // Get message count
    const { count: messageCount, error: messageError } = await (client as any)
      .from('messages')
      .select('*', { count: 'exact', head: true });

    if (messageError && messageError.code !== 'PGRST116') {
      console.error('Error fetching message count:', messageError);
    }

    // Get unread message count
    const { count: unreadCount, error: unreadError } = await (client as any)
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unread');

    if (unreadError && unreadError.code !== 'PGRST116') {
      console.error('Error fetching unread count:', unreadError);
    }

    // Process donation data
    const donationData = donations || [];

    // Separate completed and pending donations
    const completedDonations = donationData.filter((d: any) => d.status === 'completed');
    const pendingDonations = donationData.filter((d: any) => d.status === 'pending');

    // Get current month donations (completed only for stats)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthDonations = completedDonations.filter((d: any) => {
        if (!d.created_at) return false;
        const donationDate = new Date(d.created_at);
        return donationDate.getMonth() === currentMonth &&
               donationDate.getFullYear() === currentYear;
      });

    const currentMonthDonationSet = new Set(currentMonthDonations);
    const totalsByCurrency = donationData.reduce((totals: Record<string, any>, donation: any) => {
      const currency = String(donation.currency || 'USD').toUpperCase();
      const amount = parseFloat(donation.amount) || 0;
      totals[currency] ||= { currency, completed: 0, pending: 0, monthlyCompleted: 0 };
      if (donation.status === 'completed') totals[currency].completed += amount;
      if (donation.status === 'pending') totals[currency].pending += amount;
      if (currentMonthDonationSet.has(donation)) totals[currency].monthlyCompleted += amount;
      return totals;
    }, {});

    // Get donation trends for last 6 months (completed only)
    const donationTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });

      const monthDonations = completedDonations.filter((d: any) => {
        if (!d.created_at) return false;
        const donationDate = new Date(d.created_at);
        return donationDate.getMonth() === date.getMonth() &&
               donationDate.getFullYear() === date.getFullYear();
      });

      const donors = new Set(monthDonations.map((d: any) => d.donor_id).filter(Boolean)).size;

      donationTrends.push({
        month,
        count: monthDonations.length,
        donors
      });
    }

    // Calculate donation method breakdown (completed only)
    const methodBreakdown = completedDonations
      .reduce((acc: Record<string, number>, d: any) => {
        const method = d.payment_method || 'unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const totalCompletedDonations: number = (Object.values(methodBreakdown) as number[]).reduce((sum: number, count: number) => sum + count, 0);

    const donationMethods = [
      {
        name: 'Bank Transfer',
        value: Math.round(((methodBreakdown.bank_transfer || 0) / totalCompletedDonations) * 100) || 0,
        color: '#3B82F6'
      },
      {
        name: 'Card Payment',
        value: Math.round(((methodBreakdown.card || 0) / totalCompletedDonations) * 100) || 0,
        color: '#10B981'
      },
      {
        name: 'Cryptocurrency',
        value: Math.round(((methodBreakdown.crypto || 0) / totalCompletedDonations) * 100) || 0,
        color: '#F59E0B'
      },
      {
        name: 'Other',
        value: Math.round(((methodBreakdown.other || methodBreakdown.unknown || 0) / totalCompletedDonations) * 100) || 0,
        color: '#EF4444'
      },
    ];

    // Get recent activities (last 5 - including both completed and pending)
    const recentDonations = donationData
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    const recentActivities = recentDonations.map((donation: any, index: number) => {
      const createdAt = new Date(donation.created_at);
      return {
        id: index + 1,
        type: 'donation',
        user: 'Anonymous Donor',
        amount: parseFloat(donation.amount),
        currency: String(donation.currency || 'USD').toUpperCase(),
        method: donation.payment_method,
        status: donation.status,
        time: Number.isNaN(createdAt.getTime()) ? null : createdAt.toISOString()
      };
    });

    const stats = {
      totalsByCurrency: Object.values(totalsByCurrency),
      pendingCount: pendingDonations.length,
      completedCount: completedDonations.length,
      monthlyCompletedCount: currentMonthDonations.length,
      donorCount: donorCount || 0,
      volunteerCount: volunteerCount || 0,
      messageCount: messageCount || 0,
      unreadMessageCount: unreadCount || 0,
      donationTrends,
      donationMethods,
      recentActivities,
      cryptoWallets: [
        process.env.BTC_WALLET_ADDRESS || process.env.NEXT_PUBLIC_BTC_WALLET_ADDRESS,
        process.env.ETH_WALLET_ADDRESS || process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS,
        process.env.USDT_WALLET_ADDRESS || process.env.NEXT_PUBLIC_USDT_WALLET_ADDRESS,
        process.env.USDC_WALLET_ADDRESS || process.env.NEXT_PUBLIC_USDC_WALLET_ADDRESS,
        process.env.XRP_WALLET_ADDRESS || process.env.NEXT_PUBLIC_XRP_WALLET_ADDRESS,
        process.env.SOL_WALLET_ADDRESS || process.env.NEXT_PUBLIC_SOL_WALLET_ADDRESS
      ].filter(Boolean).length,
      successRate: donationData.length > 0 ?
        Number(((completedDonations.length / donationData.length) * 100).toFixed(1)) : 0
    };

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Admin stats API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdminAuth(handler);
