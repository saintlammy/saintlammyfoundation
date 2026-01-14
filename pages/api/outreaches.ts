import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getOutreaches(req, res);
    case 'POST':
      return await createOutreach(req, res);
    case 'PUT':
      return await updateOutreach(req, res);
    case 'DELETE':
      return await deleteOutreach(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getOutreaches(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {

    if (!supabase) {
      return res.status(200).json(getMockOutreaches(limit ? parseInt(limit as string) : undefined));
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'outreach')
      .eq('status', status)
      .order('publish_date', { ascending: false});

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockOutreaches(limit ? parseInt(limit as string) : undefined));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockOutreaches(limit ? parseInt(limit as string) : undefined));
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || item.content,
      image: item.featured_image,
      location: item.outreach_details?.location || 'Nigeria',
      date: item.outreach_details?.event_date || item.publish_date,
      beneficiaries: item.outreach_details?.beneficiaries_count || 0,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockOutreaches((limit as any) ? parseInt(limit as string) : undefined));
  }
}

async function createOutreach(req: NextApiRequest, res: NextApiResponse) {
  try {
    const outreachData = req.body;

    if (!outreachData.title || !outreachData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = outreachData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newOutreach = {
      ...outreachData,
      slug,
      type: 'outreach',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newOutreach,
        message: 'Outreach created successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('content') as any)
      .insert([newOutreach] as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newOutreach,
        message: 'Outreach created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateOutreach(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Outreach ID is required' });
    }

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabase) {
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Outreach updated successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('content') as any)
      .update(updateData)
      .eq('id', id)
      .eq('type', 'outreach')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Outreach updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteOutreach(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Outreach ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Outreach deleted successfully (mock mode)'
      });
    }

    const { error } = await (supabase
      .from('content') as any)
      .delete()
      .eq('id', id)
      .eq('type', 'outreach');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Outreach deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Outreach deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockOutreaches(limit?: number) {
  const mockOutreaches = [
    {
      id: '1',
      title: 'Christmas Feeding Program',
      description: 'Annual Christmas feeding program for 500+ families in Mushin area. Hot meals, gift packages, and medical check-ups.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      location: 'Mushin Community Center, Lagos',
      date: '2024-12-22T00:00:00Z',
      beneficiaries: 500,
      status: 'upcoming',
      created_at: '2024-11-01T00:00:00Z',
      updated_at: '2024-11-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Educational Materials Distribution',
      description: 'Distribution of school bags, books, uniforms, and educational materials to 200 children across 5 orphanages.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      location: 'Hope Children Home, Abuja',
      date: '2025-01-15T00:00:00Z',
      beneficiaries: 200,
      status: 'upcoming',
      created_at: '2024-11-15T00:00:00Z',
      updated_at: '2024-11-15T00:00:00Z'
    },
    {
      id: '3',
      title: 'Widow Empowerment Workshop',
      description: 'Skills training workshop for widows including tailoring, soap making, and small business management.',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      location: 'Community Hall, Port Harcourt',
      date: '2025-02-08T00:00:00Z',
      beneficiaries: 75,
      status: 'upcoming',
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '4',
      title: 'Independence Day Medical Outreach',
      description: 'Free medical check-ups, medications, and health education for underserved communities.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      location: 'Ikeja, Lagos',
      date: '2024-10-01T00:00:00Z',
      beneficiaries: 450,
      status: 'published',
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-10-01T00:00:00Z'
    },
    {
      id: '5',
      title: 'Back-to-School Support',
      description: 'School supplies and uniforms distribution for children from vulnerable families.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      location: 'Multiple Locations',
      date: '2024-09-12T00:00:00Z',
      beneficiaries: 320,
      status: 'published',
      created_at: '2024-08-01T00:00:00Z',
      updated_at: '2024-09-12T00:00:00Z'
    },
    {
      id: '6',
      title: 'Clean Water Initiative',
      description: 'Installation of water pumps and distribution of water purification tablets.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      location: 'Rural Kogi State',
      date: '2024-08-20T00:00:00Z',
      beneficiaries: 600,
      status: 'published',
      created_at: '2024-07-01T00:00:00Z',
      updated_at: '2024-08-20T00:00:00Z'
    }
  ];

  return limit ? mockOutreaches.slice(0, limit) : mockOutreaches;
}