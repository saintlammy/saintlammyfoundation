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

    // Fetch active volunteer roles
    const { data: roles, error } = await (client as any)
      .from('volunteer_roles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching volunteer roles:', error);
      return res.status(500).json({ error: 'Failed to fetch volunteer roles' });
    }

    return res.status(200).json(roles || []);
  } catch (error) {
    console.error('Volunteer roles API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
