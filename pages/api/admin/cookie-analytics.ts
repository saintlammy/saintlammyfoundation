import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // SECURITY: Check if supabase is available
  if (!supabase) {
    return res.status(500).json({
      success: false,
      error: 'Database not configured'
    });
  }

  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange as string) || 30;

    // Get daily analytics for the specified time range
    const { data: dailyStats, error: dailyError } = await supabase
      .from('cookie_analytics')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (dailyError) {
      throw new Error(`Failed to fetch daily stats: ${dailyError.message}`);
    }

    // Get total counts from cookie_consent_logs
    const { data: totalLogs, error: logsError } = await supabase
      .from('cookie_consent_logs')
      .select('consent_action, analytics, marketing, preferences')
      .gte('consent_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (logsError) {
      throw new Error(`Failed to fetch logs: ${logsError.message}`);
    }

    // Calculate aggregated statistics
    const totalConsents = totalLogs?.length || 0;
    const acceptAllCount = totalLogs?.filter(log => log.consent_action === 'accept_all').length || 0;
    const rejectAllCount = totalLogs?.filter(log => log.consent_action === 'reject_all').length || 0;
    const customizeCount = totalLogs?.filter(log => log.consent_action === 'customize').length || 0;

    const analyticsOptedIn = totalLogs?.filter(log => log.analytics === true).length || 0;
    const marketingOptedIn = totalLogs?.filter(log => log.marketing === true).length || 0;
    const preferencesOptedIn = totalLogs?.filter(log => log.preferences === true).length || 0;

    const acceptanceRate = totalConsents > 0
      ? ((acceptAllCount / totalConsents) * 100).toFixed(2)
      : '0.00';

    // Get geographic distribution (if available)
    const { data: geoStats, error: geoError } = await supabase
      .from('cookie_consent_logs')
      .select('country_code, consent_action')
      .gte('consent_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .not('country_code', 'is', null);

    // Process geo data
    const geoDistribution = geoStats?.reduce((acc, log) => {
      const country = log.country_code || 'Unknown';
      if (!acc[country]) {
        acc[country] = {
          total: 0,
          accepts: 0,
          rejects: 0,
          customizes: 0,
        };
      }
      acc[country].total++;
      if (log.consent_action === 'accept_all') acc[country].accepts++;
      if (log.consent_action === 'reject_all') acc[country].rejects++;
      if (log.consent_action === 'customize') acc[country].customizes++;
      return acc;
    }, {} as Record<string, any>) || {};

    // Get recent consents for activity feed
    const { data: recentConsents, error: recentError } = await supabase
      .from('cookie_consent_logs')
      .select('id, consent_action, consent_date, country_code, analytics, marketing, preferences')
      .order('consent_date', { ascending: false })
      .limit(10);

    if (recentError) {
      throw new Error(`Failed to fetch recent consents: ${recentError.message}`);
    }

    // Calculate category opt-in rates
    const categoryOptInRates = {
      analytics: {
        count: analyticsOptedIn,
        percentage: totalConsents > 0 ? ((analyticsOptedIn / totalConsents) * 100).toFixed(2) : '0.00',
      },
      marketing: {
        count: marketingOptedIn,
        percentage: totalConsents > 0 ? ((marketingOptedIn / totalConsents) * 100).toFixed(2) : '0.00',
      },
      preferences: {
        count: preferencesOptedIn,
        percentage: totalConsents > 0 ? ((preferencesOptedIn / totalConsents) * 100).toFixed(2) : '0.00',
      },
    };

    // Return comprehensive analytics
    return res.status(200).json({
      success: true,
      timeRange: days,
      summary: {
        totalConsents,
        acceptAllCount,
        rejectAllCount,
        customizeCount,
        acceptanceRate: parseFloat(acceptanceRate),
      },
      categoryOptIns: categoryOptInRates,
      dailyStats: dailyStats || [],
      geoDistribution: Object.entries(geoDistribution).map(([country, stats]) => ({
        country,
        ...stats,
      })).sort((a, b) => b.total - a.total).slice(0, 10), // Top 10 countries
      recentActivity: recentConsents || [],
    });
  } catch (error) {
    console.error('Cookie analytics API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch cookie analytics',
    });
  }
}
