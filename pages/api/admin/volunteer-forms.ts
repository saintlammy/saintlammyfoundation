import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getVolunteerForms(req, res);
      case 'POST':
        return await createVolunteerForm(req, res);
      case 'PUT':
        return await updateVolunteerForm(req, res);
      case 'DELETE':
        return await deleteVolunteerForm(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Volunteer forms API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getVolunteerForms(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'all', role_id } = req.query;

  let query = (supabaseAdmin as any).from('volunteer_forms').select('*');

  if (status !== 'all') {
    query = query.eq('is_active', status === 'active');
  }

  if (role_id) {
    query = query.eq('role_id', role_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching volunteer forms:', error);
    return res.status(500).json({ error: 'Failed to fetch volunteer forms' });
  }

  return res.status(200).json(data || []);
}

async function createVolunteerForm(req: NextApiRequest, res: NextApiResponse) {
  const formData = req.body;

  if (!formData.title) {
    return res.status(400).json({ error: 'Form title is required' });
  }

  const dbData = {
    title: formData.title,
    description: formData.description || '',
    role_id: formData.role_id || null,
    event_id: formData.event_id || null,
    custom_fields: formData.custom_fields || [],
    required_fields: formData.required_fields || ['first_name', 'last_name', 'email', 'phone'],
    success_message: formData.success_message || 'Thank you for applying! We will review your application and get back to you soon.',
    redirect_url: formData.redirect_url || null,
    is_active: formData.is_active !== undefined ? formData.is_active : true,
    start_date: formData.start_date || null,
    end_date: formData.end_date || null,
    max_submissions: formData.max_submissions || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await (supabaseAdmin as any)
    .from('volunteer_forms')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating volunteer form:', error);
    return res.status(500).json({ error: 'Failed to create volunteer form' });
  }

  console.log('✅ Volunteer form created:', data.id);
  return res.status(201).json(data);
}

async function updateVolunteerForm(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const formData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Form ID is required' });
  }

  const dbData = {
    title: formData.title,
    description: formData.description,
    role_id: formData.role_id,
    event_id: formData.event_id,
    custom_fields: formData.custom_fields,
    required_fields: formData.required_fields,
    success_message: formData.success_message,
    redirect_url: formData.redirect_url,
    is_active: formData.is_active,
    start_date: formData.start_date,
    end_date: formData.end_date,
    max_submissions: formData.max_submissions,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await (supabaseAdmin as any)
    .from('volunteer_forms')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating volunteer form:', error);
    return res.status(500).json({ error: 'Failed to update volunteer form' });
  }

  console.log('✅ Volunteer form updated:', id);
  return res.status(200).json(data);
}

async function deleteVolunteerForm(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Form ID is required' });
  }

  const { error } = await (supabaseAdmin as any)
    .from('volunteer_forms')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting volunteer form:', error);
    return res.status(500).json({ error: 'Failed to delete volunteer form' });
  }

  console.log('✅ Volunteer form deleted:', id);
  return res.status(200).json({ success: true, message: 'Form deleted successfully' });
}
