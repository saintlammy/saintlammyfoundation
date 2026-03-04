import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const client = getTypedSupabaseClient();

  if (req.method === 'PATCH') {
    try {
      const { status } = req.body;

      if (!status || !['pending', 'approved', 'active', 'inactive', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const { data, error } = await (client as any)
        .from('volunteers')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating volunteer:', error);
        return res.status(500).json({ error: 'Failed to update volunteer' });
      }

      // TODO: Send approval email if status changed to 'approved'
      if (status === 'approved') {
        console.log('TODO: Send volunteer approval email to:', data.email);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error in volunteer update API:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
