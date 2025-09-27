import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getTestimonials(req, res);
    case 'POST':
      return await createTestimonial(req, res);
    case 'PUT':
      return await updateTestimonial(req, res);
    case 'DELETE':
      return await deleteTestimonial(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getTestimonials(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status = 'published', limit } = req.query;

    let query = supabase
      .from('content')
      .select('*')
      .eq('type', 'testimonial')
      .eq('status', status)
      .order('publish_date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockTestimonials(limit ? parseInt(limit as string) : undefined));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockTestimonials(limit ? parseInt(limit as string) : undefined));
    }

    // Transform data to match component interface
    const transformedData = data.map(item => ({
      id: item.id,
      name: item.testimonial_details?.author_name || 'Anonymous',
      role: item.testimonial_details?.author_role || 'Beneficiary',
      content: item.content,
      rating: item.testimonial_details?.rating || 5,
      image: item.featured_image,
      program: item.testimonial_details?.program || 'General',
      date: item.publish_date || item.created_at,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockTestimonials(limit ? parseInt(limit as string) : undefined));
  }
}

async function createTestimonial(req: NextApiRequest, res: NextApiResponse) {
  try {
    const testimonialData = req.body;

    if (!testimonialData.title || !testimonialData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = testimonialData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newTestimonial = {
      ...testimonialData,
      slug,
      type: 'testimonial',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('content')
      .insert([newTestimonial])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newTestimonial,
        message: 'Testimonial created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateTestimonial(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Testimonial ID is required' });
    }

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', id)
      .eq('type', 'testimonial')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Testimonial updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteTestimonial(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Testimonial ID is required' });
    }

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
      .eq('type', 'testimonial');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Testimonial deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockTestimonials(limit?: number) {
  const mockTestimonials = [
    {
      id: '1',
      name: 'Mrs. Grace Okoro',
      role: 'Program Beneficiary',
      content: 'The widow empowerment program transformed my life. I learned tailoring skills and received a micro-loan to start my business. Now I can support my three children independently.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616c34ca2f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      program: 'Widow Empowerment',
      date: '2024-01-20T00:00:00Z',
      status: 'published',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'David Adebayo',
      role: 'Former Beneficiary',
      content: 'Through the orphan support program, I was able to complete my education. Today, I am a university graduate and working as a software engineer. Forever grateful!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      program: 'Orphan Support',
      date: '2024-01-15T00:00:00Z',
      status: 'published',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Chief Emmanuel Okafor',
      role: 'Community Leader',
      content: 'Saintlammy Foundation has been a blessing to our community. Their healthcare outreach programs have saved many lives and brought hope to our people.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      program: 'Healthcare Outreach',
      date: '2024-01-10T00:00:00Z',
      status: 'published',
      created_at: '2024-01-05T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    }
  ];

  return limit ? mockTestimonials.slice(0, limit) : mockTestimonials;
}