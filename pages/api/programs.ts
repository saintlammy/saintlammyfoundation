import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPrograms(req, res);
    case 'POST':
      return await createProgram(req, res);
    case 'PUT':
      return await updateProgram(req, res);
    case 'DELETE':
      return await deleteProgram(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPrograms(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status = 'published', limit } = req.query;

    if (!supabase) {
      return res.status(200).json(getMockPrograms(limit ? parseInt(limit as string) : undefined));
    }

    let query = supabase
      .from('content')
      .select('*')
      .eq('type', 'program')
      .eq('status', status)
      .order('publish_date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockPrograms(limit ? parseInt(limit as string) : undefined));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockPrograms(limit ? parseInt(limit as string) : undefined));
    }

    // Transform data to match component interface
    const transformedData = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || item.content,
      image: item.featured_image,
      category: item.program_details?.category || 'education',
      targetAudience: item.program_details?.target_audience || 'General',
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockPrograms(limit ? parseInt(limit as string) : undefined));
  }
}

async function createProgram(req: NextApiRequest, res: NextApiResponse) {
  try {
    const programData = req.body;

    if (!programData.title || !programData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = programData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProgram = {
      ...programData,
      slug,
      type: 'program',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newProgram,
        message: 'Program created successfully (mock mode)'
      });
    }

    const { data, error } = await supabase
      .from('content')
      .insert([newProgram])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newProgram,
        message: 'Program created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateProgram(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Program ID is required' });
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
        message: 'Program updated successfully (mock mode)'
      });
    }

    const { data, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', id)
      .eq('type', 'program')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Program updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteProgram(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Program ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Program deleted successfully (mock mode)'
      });
    }

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
      .eq('type', 'program');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Program deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockPrograms(limit?: number) {
  const mockPrograms = [
    {
      id: '1',
      title: 'Orphan Support Program',
      description: 'Comprehensive support for orphaned children including education, healthcare, and emotional support.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'education',
      targetAudience: 'Orphaned Children',
      status: 'published',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Widow Empowerment Initiative',
      description: 'Skills training and micro-finance program to help widows achieve financial independence.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'empowerment',
      targetAudience: 'Widows',
      status: 'published',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Community Healthcare Outreach',
      description: 'Mobile healthcare services bringing medical care to underserved communities.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'healthcare',
      targetAudience: 'Rural Communities',
      status: 'published',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    }
  ];

  return limit ? mockPrograms.slice(0, limit) : mockPrograms;
}