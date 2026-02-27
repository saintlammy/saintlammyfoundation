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

    const { data: inquiryTypes, error } = await (client as any)
      .from('contact_inquiry_types')
      .select('id, title, description, icon')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching inquiry types:', error);
      return res.status(500).json({ error: 'Failed to fetch inquiry types' });
    }

    return res.status(200).json(inquiryTypes || []);
  } catch (error) {
    console.error('Contact inquiry types API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
