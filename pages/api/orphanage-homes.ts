import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase configuration missing');
  return createClient(url, key);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = getSupabase();

    if (req.method === 'GET') {
      const { id, status } = req.query;

      if (id) {
        const { data, error } = await supabase
          .from('orphanage_homes')
          .select('*')
          .eq('id', id as string)
          .single();
        if (error) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json({ success: true, data });
      }

      let query = supabase
        .from('orphanage_homes')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status as string);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching orphanage homes:', error);
        return res.status(500).json({ error: 'Failed to fetch orphanage homes', message: error.message });
      }

      return res.status(200).json({ success: true, data: data || [] });

    } else if (req.method === 'POST') {
      const body = req.body;

      if (!body.name) {
        return res.status(400).json({ error: 'name is required' });
      }

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('orphanage_homes')
        .insert([{
          name: body.name,
          location: body.location || '',
          orphan_count: body.orphan_count ? parseInt(body.orphan_count) : 0,
          age_range: body.age_range || '',
          contact_person: body.contact_person || '',
          contact_phone: body.contact_phone || '',
          contact_email: body.contact_email || '',
          description: body.description || '',
          needs: body.needs || [],
          last_outreach_date: body.last_outreach_date || null,
          next_outreach_date: body.next_outreach_date || null,
          outreach_frequency: body.outreach_frequency || '',
          image: body.image || '',
          monthly_support: body.monthly_support ? parseFloat(body.monthly_support) : 0,
          is_active: body.is_active !== undefined ? body.is_active : true,
          status: body.status || 'active',
          notes: body.notes || '',
          created_at: now,
          updated_at: now,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating orphanage home:', error);
        return res.status(500).json({ error: 'Failed to create orphanage home', message: error.message });
      }

      return res.status(201).json({ success: true, data, message: 'Orphanage home created successfully' });

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const body = req.body;

      if (!id) return res.status(400).json({ error: 'id query param is required' });

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      const fields = [
        'name', 'location', 'orphan_count', 'age_range', 'contact_person',
        'contact_phone', 'contact_email', 'description', 'needs',
        'last_outreach_date', 'next_outreach_date', 'outreach_frequency',
        'image', 'monthly_support', 'is_active', 'status', 'notes'
      ];
      for (const f of fields) {
        if (body[f] !== undefined) updateData[f] = body[f];
      }
      if (body.orphan_count !== undefined) updateData.orphan_count = body.orphan_count ? parseInt(body.orphan_count) : 0;
      if (body.monthly_support !== undefined) updateData.monthly_support = body.monthly_support ? parseFloat(body.monthly_support) : 0;

      const { data, error } = await supabase
        .from('orphanage_homes')
        .update(updateData)
        .eq('id', id as string)
        .select()
        .single();

      if (error) {
        console.error('Error updating orphanage home:', error);
        return res.status(500).json({ error: 'Failed to update orphanage home', message: error.message });
      }

      return res.status(200).json({ success: true, data, message: 'Orphanage home updated successfully' });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param is required' });

      const { error } = await supabase
        .from('orphanage_homes')
        .delete()
        .eq('id', id as string);

      if (error) {
        console.error('Error deleting orphanage home:', error);
        return res.status(500).json({ error: 'Failed to delete orphanage home', message: error.message });
      }

      return res.status(200).json({ success: true, message: 'Orphanage home deleted successfully' });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Orphanage homes API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
