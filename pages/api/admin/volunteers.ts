import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = getTypedSupabaseClient();

  if (req.method === 'GET') {
    try {
      const { status } = req.query;

      let query = (client as any).from('volunteers').select('*');

      // Filter by status if provided
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Order by application date (newest first)
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching volunteers:', error);
        return res.status(500).json({ error: 'Failed to fetch volunteers' });
      }

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Error in volunteers API:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
