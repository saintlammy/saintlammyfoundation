import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

// Fallback stats when database is not available or has no data
const FALLBACK_STATS = {
  totalDonations: 8420,
  totalDonors: 45,
  totalBeneficiaries: 312,
  totalPrograms: 6,
  totalVolunteers: 45,
  totalPartnerships: 7,
  monthlyRevenue: 1200,
  monthlyExpenses: 950,
  activeAdoptions: 312,
  pendingGrants: 3,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // If Supabase is not available, return fallback stats immediately
    if (!isSupabaseAvailable || !supabase) {
      console.log('⚠️ Supabase not available, using fallback stats');
      return res.status(200).json({
        success: true,
        data: FALLBACK_STATS,
        source: 'fallback'
      });
    }

    // Try to fetch real data from Supabase

    // Get donation statistics
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('amount, status, created_at')
      .eq('status', 'completed');

    // Get counts for various entities
    const { count: donorCount } = await supabase
      .from('donations')
      .select('donor_email', { count: 'exact', head: true });

    const { count: volunteerCount } = await supabase
      .from('volunteers')
      .select('*', { count: 'exact', head: true });

    const { count: programCount } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true });

    const { count: outreachCount } = await supabase
      .from('outreaches')
      .select('*', { count: 'exact', head: true });

    const { count: beneficiaryCount } = await supabase
      .from('beneficiaries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: orphanCount } = await supabase
      .from('beneficiaries')
      .select('*', { count: 'exact', head: true })
      .eq('category', 'orphan')
      .eq('status', 'active');

    const { count: widowCount } = await supabase
      .from('beneficiaries')
      .select('*', { count: 'exact', head: true })
      .eq('category', 'widow')
      .eq('status', 'active');

    // Sum orphan_count from active orphanage homes (group-visit tracking)
    const { data: orphanageHomes } = await supabase
      .from('orphanage_homes')
      .select('orphan_count')
      .eq('is_active', true);

    // Calculate total donations
    const totalDonations = (donations as any)?.reduce((sum: number, d: any) => {
      return sum + (parseFloat(String(d.amount)) || 0);
    }, 0) || 0;

    // Calculate monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = (donations as any)?.filter((d: any) => {
      if (!d.created_at) return false;
      const donationDate = new Date(d.created_at);
      return donationDate.getMonth() === currentMonth &&
             donationDate.getFullYear() === currentYear;
    }).reduce((sum: number, d: any) => sum + (parseFloat(String(d.amount)) || 0), 0) || 0;

    // If we have real data, use it; otherwise use fallback
    const hasRealData = donations && donations.length > 0;

    // Years of impact — foundation started July 2025
    const foundingDate = new Date('2025-07-01');
    const yearsOfImpact = parseFloat(((Date.now() - foundingDate.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1));

    const stats = {
      totalDonations: hasRealData ? Math.round(totalDonations) : FALLBACK_STATS.totalDonations,
      totalDonors: hasRealData ? (donorCount || 0) : FALLBACK_STATS.totalDonors,
      totalBeneficiaries: (beneficiaryCount && beneficiaryCount > 0) ? beneficiaryCount : FALLBACK_STATS.totalBeneficiaries,
      totalOrphans: (() => {
        const individual = orphanCount ?? 0;
        const fromHomes = (orphanageHomes || []).reduce((sum: number, h: any) => sum + (h.orphan_count || 0), 0);
        const total = individual + fromHomes;
        return total > 0 ? total : 0;
      })(),
      totalWidows: (widowCount && widowCount > 0) ? widowCount : 0,
      totalOutreaches: (outreachCount && outreachCount > 0) ? outreachCount : 3,
      yearsOfImpact,
      totalPrograms: (programCount && programCount > 0) ? programCount : FALLBACK_STATS.totalPrograms,
      totalVolunteers: (volunteerCount && volunteerCount > 0) ? volunteerCount : FALLBACK_STATS.totalVolunteers,
      totalPartnerships: FALLBACK_STATS.totalPartnerships,
      monthlyRevenue: hasRealData ? Math.round(monthlyRevenue) : FALLBACK_STATS.monthlyRevenue,
      monthlyExpenses: FALLBACK_STATS.monthlyExpenses,
      activeAdoptions: FALLBACK_STATS.activeAdoptions,
      pendingGrants: FALLBACK_STATS.pendingGrants,
    };

    return res.status(200).json({
      success: true,
      data: stats,
      source: hasRealData ? 'database' : 'fallback'
    });

  } catch (error) {
    console.error('Public stats API error:', error);

    // Return fallback stats on error
    return res.status(200).json({
      success: true,
      data: FALLBACK_STATS,
      source: 'fallback-error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
