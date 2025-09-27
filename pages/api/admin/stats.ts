import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = getTypedSupabaseClient();

    // Get donation statistics
    const { data: donations, error: donationsError } = await (client as any)
      .from('donations')
      .select('amount, currency, created_at, payment_method, status');

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
    const totalDonations = donationData
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    // Get current month donations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyDonations = donationData
      .filter(d => {
        if (!d.created_at) return false;
        const donationDate = new Date(d.created_at);
        return donationDate.getMonth() === currentMonth &&
               donationDate.getFullYear() === currentYear &&
               d.status === 'completed';
      })
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

    // Get donation trends for last 6 months
    const donationTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });

      const monthDonations = donationData.filter(d => {
        if (!d.created_at) return false;
        const donationDate = new Date(d.created_at);
        return donationDate.getMonth() === date.getMonth() &&
               donationDate.getFullYear() === date.getFullYear() &&
               d.status === 'completed';
      });

      const amount = monthDonations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      const donors = new Set(monthDonations.map(d => d.donor_id)).size;

      donationTrends.push({
        month,
        amount: Math.round(amount),
        donors
      });
    }

    // Calculate donation method breakdown
    const methodBreakdown = donationData
      .filter(d => d.status === 'completed')
      .reduce((acc, d) => {
        const method = d.payment_method || 'unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const totalCompletedDonations = Object.values(methodBreakdown).reduce((sum, count) => sum + count, 0);

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

    // Get recent activities (last 5)
    const recentDonations = donationData
      .filter(d => d.status === 'completed')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);

    const recentActivities = recentDonations.map((donation, index) => ({
      id: index + 1,
      type: 'donation',
      user: 'Anonymous Donor',
      amount: parseFloat(donation.amount),
      method: donation.payment_method,
      time: new Date(donation.created_at).toLocaleString()
    }));

    const stats = {
      totalDonations: Math.round(totalDonations),
      monthlyDonations: Math.round(monthlyDonations),
      donorCount: donorCount || 0,
      volunteerCount: volunteerCount || 0,
      messageCount: messageCount || 0,
      unreadMessageCount: unreadCount || 0,
      donationTrends,
      donationMethods,
      recentActivities,
      cryptoWallets: 6, // We have 6 crypto wallets configured
      successRate: totalCompletedDonations > 0 ?
        Math.round((totalCompletedDonations / donationData.length) * 100) : 0
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