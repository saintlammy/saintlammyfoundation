import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase configuration missing');
  return createClient(url, key);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = getSupabaseAdmin();

    if (req.method === 'GET') {
      // List all budget templates (lightweight — no full data unless ?id=xxx)
      const { id } = req.query;

      if (id) {
        // Fetch a single template by ID
        const { data, error } = await supabase
          .from('budget_templates')
          .select('*')
          .eq('id', id as string)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Template not found' });
          }
          console.error('Error fetching budget template:', error);
          return res.status(500).json({ error: 'Failed to fetch template', message: error.message });
        }

        return res.status(200).json({ success: true, data });
      }

      // List all (return id, name, description, created_at, updated_at — skip heavy data column)
      const { data, error } = await supabase
        .from('budget_templates')
        .select('id, name, description, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error listing budget templates:', error);
        return res.status(500).json({ error: 'Failed to list templates', message: error.message });
      }

      return res.status(200).json({ success: true, data: data || [] });

    } else if (req.method === 'POST') {
      // Create a new budget template
      const { name, description, data: templateData } = req.body;

      if (!name || !templateData) {
        return res.status(400).json({ error: 'name and data are required' });
      }

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('budget_templates')
        .insert([{
          name,
          description: description || '',
          data: templateData,
          created_at: now,
          updated_at: now,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating budget template:', error);
        return res.status(500).json({ error: 'Failed to create template', message: error.message });
      }

      return res.status(201).json({ success: true, data, message: 'Template saved successfully' });

    } else if (req.method === 'PUT') {
      // Update an existing budget template
      const { id, name, description, data: templateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'id is required for update' });
      }

      const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (name !== undefined) updatePayload.name = name;
      if (description !== undefined) updatePayload.description = description;
      if (templateData !== undefined) updatePayload.data = templateData;

      const { data, error } = await supabase
        .from('budget_templates')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating budget template:', error);
        return res.status(500).json({ error: 'Failed to update template', message: error.message });
      }

      return res.status(200).json({ success: true, data, message: 'Template updated successfully' });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'id query param is required' });
      }

      const { error } = await supabase
        .from('budget_templates')
        .delete()
        .eq('id', id as string);

      if (error) {
        console.error('Error deleting budget template:', error);
        return res.status(500).json({ error: 'Failed to delete template', message: error.message });
      }

      return res.status(200).json({ success: true, message: 'Template deleted successfully' });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Budget templates API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
