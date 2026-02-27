import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const client = getTypedSupabaseClient();

    if (!client) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Fetch all partnership-related options in parallel
    const [orgTypesResult, partnershipTypesResult, timelinesResult] = await Promise.all([
      (client as any)
        .from('organization_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true }),

      (client as any)
        .from('partnership_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true }),

      (client as any)
        .from('partnership_timelines')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true })
    ]);

    // Check for errors
    if (orgTypesResult.error) {
      console.error('Error fetching organization types:', orgTypesResult.error);
    }
    if (partnershipTypesResult.error) {
      console.error('Error fetching partnership types:', partnershipTypesResult.error);
    }
    if (timelinesResult.error) {
      console.error('Error fetching timelines:', timelinesResult.error);
    }

    return res.status(200).json({
      organizationTypes: orgTypesResult.data || [],
      partnershipTypes: partnershipTypesResult.data || [],
      timelines: timelinesResult.data || []
    });
  } catch (error) {
    console.error('Partnership options API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
