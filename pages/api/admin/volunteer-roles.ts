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
        return await getVolunteerRoles(req, res);
      case 'POST':
        return await createVolunteerRole(req, res);
      case 'PUT':
        return await updateVolunteerRole(req, res);
      case 'DELETE':
        return await deleteVolunteerRole(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Volunteer roles API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getVolunteerRoles(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'all' } = req.query;

  let query = (supabaseAdmin as any).from('volunteer_roles').select('*');

  if (status !== 'all') {
    query = query.eq('is_active', status === 'active');
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching volunteer roles:', error);
    return res.status(500).json({ error: 'Failed to fetch volunteer roles' });
  }

  return res.status(200).json(data || []);
}

async function createVolunteerRole(req: NextApiRequest, res: NextApiResponse) {
  const roleData = req.body;

  if (!roleData.title) {
    return res.status(400).json({ error: 'Role title is required' });
  }

  const dbData = {
    title: roleData.title,
    description: roleData.description || '',
    required_skills: roleData.required_skills || [],
    preferred_skills: roleData.preferred_skills || [],
    responsibilities: roleData.responsibilities || [],
    time_commitment: roleData.time_commitment || '',
    location: roleData.location || '',
    availability: roleData.availability || [],
    spots_available: roleData.spots_available || null,
    is_active: roleData.is_active !== undefined ? roleData.is_active : true,
    category: roleData.category || 'general',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await (supabaseAdmin as any)
    .from('volunteer_roles')
    .insert([dbData])
    .select()
    .single();

  if (error) {
    console.error('Error creating volunteer role:', error);
    return res.status(500).json({ error: 'Failed to create volunteer role' });
  }

  console.log('✅ Volunteer role created:', data.id);
  return res.status(201).json(data);
}

async function updateVolunteerRole(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const roleData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  const dbData = {
    title: roleData.title,
    description: roleData.description,
    required_skills: roleData.required_skills,
    preferred_skills: roleData.preferred_skills,
    responsibilities: roleData.responsibilities,
    time_commitment: roleData.time_commitment,
    location: roleData.location,
    availability: roleData.availability,
    spots_available: roleData.spots_available,
    is_active: roleData.is_active,
    category: roleData.category,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await (supabaseAdmin as any)
    .from('volunteer_roles')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating volunteer role:', error);
    return res.status(500).json({ error: 'Failed to update volunteer role' });
  }

  console.log('✅ Volunteer role updated:', id);
  return res.status(200).json(data);
}

async function deleteVolunteerRole(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  const { error } = await (supabaseAdmin as any)
    .from('volunteer_roles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting volunteer role:', error);
    return res.status(500).json({ error: 'Failed to delete volunteer role' });
  }

  console.log('✅ Volunteer role deleted:', id);
  return res.status(200).json({ success: true, message: 'Role deleted successfully' });
}
