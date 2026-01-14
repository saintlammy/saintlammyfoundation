import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPages(req, res);
    case 'POST':
      return await createPage(req, res);
    case 'PUT':
      return await updatePage(req, res);
    case 'DELETE':
      return await deletePage(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPages(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {

    if (!supabase) {
      return res.status(200).json(getMockPages(limit ? parseInt(limit as string) : undefined));
    }

    let query = supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'page')
      .eq('status', status)
      .order('publish_date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json(getMockPages(limit ? parseInt(limit as string) : undefined));
    }

    if (!data || data.length === 0) {
      return res.status(200).json(getMockPages(limit ? parseInt(limit as string) : undefined));
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      excerpt: item.excerpt,
      status: item.status,
      seo_title: item.page_details?.seo_title || item.title,
      seo_description: item.page_details?.seo_description || item.excerpt,
      template: item.page_details?.template || 'default',
      featured_image: item.featured_image,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    res.status(200).json(getMockPages((limit as any) ? parseInt(limit as string) : undefined));
  }
}

async function createPage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const pageData = req.body;

    if (!pageData.title || !pageData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = pageData.slug || pageData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPage = {
      ...pageData,
      slug,
      type: 'page',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabase) {
      return res.status(201).json({
        id: Date.now().toString(),
        ...newPage,
        message: 'Page created successfully (mock mode)'
      });
    }

    const { data, error } = await supabase
      .from('content') as any)
      .insert([newPage] as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(201).json({
        id: Date.now().toString(),
        ...newPage,
        message: 'Page created successfully (mock mode)'
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updatePage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Page ID is required' });
    }

    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabase) {
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page updated successfully (mock mode)'
      });
    }

    const { data, error } = await (supabase
      .from('content') as any)
      .update(updateData)
      .eq('id', id)
      .eq('type', 'page')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Page updated successfully (mock mode)'
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deletePage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Page ID is required' });
    }

    if (!supabase) {
      return res.status(200).json({
        success: true,
        message: 'Page deleted successfully (mock mode)'
      });
    }

    const { error } = await supabase
      .from('content') as any)
      .delete()
      .eq('id', id)
      .eq('type', 'page');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(200).json({
        message: 'Page deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function getMockPages(limit?: number) {
  const mockPages = [
    {
      id: '1',
      title: 'About Us',
      slug: 'about',
      content: 'Learn about Saintlammy Foundation\'s mission, vision, and the impact we\'re making across Nigeria.',
      excerpt: 'Discover our story and commitment to transforming lives.',
      status: 'published',
      seo_title: 'About Saintlammy Foundation - Our Mission & Impact',
      seo_description: 'Learn about Saintlammy Foundation\'s mission to support orphans, widows, and communities across Nigeria.',
      template: 'default',
      featured_image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Contact Us',
      slug: 'contact',
      content: 'Get in touch with Saintlammy Foundation. We\'d love to hear from you.',
      excerpt: 'Connect with us through multiple channels.',
      status: 'published',
      seo_title: 'Contact Saintlammy Foundation - Get In Touch',
      seo_description: 'Contact Saintlammy Foundation to learn more about our programs or get involved.',
      template: 'contact',
      featured_image: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Privacy Policy',
      slug: 'privacy',
      content: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
      excerpt: 'Learn how we protect your privacy.',
      status: 'published',
      seo_title: 'Privacy Policy - Saintlammy Foundation',
      seo_description: 'Read our privacy policy to understand how we handle your personal information.',
      template: 'legal',
      featured_image: '',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-05T00:00:00Z'
    }
  ];

  return limit ? mockPages.slice(0, limit) : mockPages;
}