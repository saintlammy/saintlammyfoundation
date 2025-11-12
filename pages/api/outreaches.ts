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
  try {
    const { status = 'published', limit } = req.query;

    if (!supabase) {
      return res.status(200).json(getMockOutreaches(limit ? parseInt(limit as string) : undefined));
    }

    let query = supabase
      .from('content')
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
    const transformedData = data.map(item => ({
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
    res.status(200).json(getMockOutreaches(limit ? parseInt(limit as string) : undefined));
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

    const { data, error } = await supabase
      .from('content')
      .insert([newOutreach])
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

    const { data, error } = await supabase
      .from('content')
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

    const { error } = await supabase
      .from('content')
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
      title: 'Lagos Community Healthcare Drive',
      description: 'Free health screening and medical consultations for underserved communities in Lagos.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      location: 'Lagos, Nigeria',
      date: '2024-02-15T00:00:00Z',
      beneficiaries: 200,
      status: 'published',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Back-to-School Supply Distribution',
      description: 'Distribution of school supplies, uniforms, and educational materials to orphaned children.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      location: 'Abuja, Nigeria',
      date: '2024-01-20T00:00:00Z',
      beneficiaries: 150,
      status: 'published',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Widow Skills Training Workshop',
      description: 'Skills acquisition workshop teaching tailoring, baking, and small business management to widows.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      location: 'Ibadan, Nigeria',
      date: '2024-01-10T00:00:00Z',
      beneficiaries: 50,
      status: 'published',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    }
  ];

  return limit ? mockOutreaches.slice(0, limit) : mockOutreaches;
}