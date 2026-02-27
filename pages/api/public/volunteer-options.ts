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

    // Fetch all volunteer-related options in parallel
    const [availabilityResult, interestAreasResult] = await Promise.all([
      (client as any)
        .from('volunteer_availability_options')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true }),

      (client as any)
        .from('volunteer_interest_areas')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('title', { ascending: true })
    ]);

    // Check for errors
    if (availabilityResult.error) {
      console.error('Error fetching availability options:', availabilityResult.error);
    }
    if (interestAreasResult.error) {
      console.error('Error fetching interest areas:', interestAreasResult.error);
    }

    return res.status(200).json({
      availabilityOptions: availabilityResult.data || [],
      interestAreas: interestAreasResult.data || []
    });
  } catch (error) {
    console.error('Volunteer options API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
