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
      const { category, featured, limit } = req.query;

      let query = supabase
        .from('beneficiaries')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category as string);
      }
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }
      if (limit) {
        query = query.limit(parseInt(limit as string));
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching beneficiaries:', error);
        return res.status(500).json({ error: 'Failed to fetch beneficiaries', message: error.message });
      }

      return res.status(200).json({ success: true, data: data || [] });

    } else if (req.method === 'POST') {
      const body = req.body;

      if (!body.name || !body.category) {
        return res.status(400).json({ error: 'name and category are required' });
      }

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('beneficiaries')
        .insert([{
          name: body.name,
          age: body.age ? parseInt(body.age) : null,
          location: body.location || '',
          category: body.category,
          story: body.story || '',
          needs: body.needs || [],
          monthly_cost: body.monthly_cost ? parseFloat(body.monthly_cost) : 0,
          image: body.image || '',
          school_grade: body.school_grade || null,
          family_size: body.family_size ? parseInt(body.family_size) : null,
          dream_aspiration: body.dream_aspiration || '',
          is_sponsored: body.is_sponsored || false,
          days_supported: body.days_supported ? parseInt(body.days_supported) : 0,
          is_featured: body.is_featured !== undefined ? body.is_featured : true,
          status: body.status || 'active',
          created_at: now,
          updated_at: now,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating beneficiary:', error);
        return res.status(500).json({ error: 'Failed to create beneficiary', message: error.message });
      }

      return res.status(201).json({ success: true, data, message: 'Beneficiary created successfully' });

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const body = req.body;

      if (!id) {
        return res.status(400).json({ error: 'id query param is required' });
      }

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      const fields = [
        'name', 'age', 'location', 'category', 'story', 'needs',
        'monthly_cost', 'image', 'school_grade', 'family_size',
        'dream_aspiration', 'is_sponsored', 'days_supported', 'is_featured', 'status'
      ];
      for (const f of fields) {
        if (body[f] !== undefined) updateData[f] = body[f];
      }
      if (body.age !== undefined) updateData.age = body.age ? parseInt(body.age) : null;
      if (body.monthly_cost !== undefined) updateData.monthly_cost = body.monthly_cost ? parseFloat(body.monthly_cost) : 0;
      if (body.family_size !== undefined) updateData.family_size = body.family_size ? parseInt(body.family_size) : null;
      if (body.days_supported !== undefined) updateData.days_supported = body.days_supported ? parseInt(body.days_supported) : 0;

      const { data, error } = await supabase
        .from('beneficiaries')
        .update(updateData)
        .eq('id', id as string)
        .select()
        .single();

      if (error) {
        console.error('Error updating beneficiary:', error);
        return res.status(500).json({ error: 'Failed to update beneficiary', message: error.message });
      }

      return res.status(200).json({ success: true, data, message: 'Beneficiary updated successfully' });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'id query param is required' });
      }

      const { error } = await supabase
        .from('beneficiaries')
        .delete()
        .eq('id', id as string);

      if (error) {
        console.error('Error deleting beneficiary:', error);
        return res.status(500).json({ error: 'Failed to delete beneficiary', message: error.message });
      }

      return res.status(200).json({ success: true, message: 'Beneficiary deleted successfully' });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Beneficiaries API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
