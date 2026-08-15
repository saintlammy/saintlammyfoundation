import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { getOptionalAdmin, requireAdmin, type AdminApiRequest } from '@/lib/serverAuth';

interface GalleryContentRow {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  gallery_details?: {
    category?: string;
    project_date?: string;
  };
  publish_date?: string;
  created_at: string;
}

export default async function handler(req: AdminApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getGallery(req, res);
    case 'POST':
      if (!(await requireAdmin(req, res))) return;
      return await createGalleryItem(req, res);
    case 'PUT':
      if (!(await requireAdmin(req, res))) return;
      return await updateGalleryItem(req, res);
    case 'DELETE':
      if (!(await requireAdmin(req, res))) return;
      return await deleteGalleryItem(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getGallery(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Gallery data is temporarily unavailable' });
    }

    const isAdmin = Boolean(await getOptionalAdmin(req));
    const requestedStatus = typeof status === 'string' ? status : 'published';
    const visibleStatus = isAdmin ? requestedStatus : 'published';

    let query = (supabaseAdmin as any)
      .from('content')
      .select('*')
      .eq('type', 'gallery')
      .eq('status', visibleStatus)
      .order('publish_date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to load gallery items' });
    }

    // Transform data to match component interface
    const transformedData = (data as GalleryContentRow[]).map(item => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || item.content,
      image: item.featured_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: getCategoryIcon(item.gallery_details?.category),
      category: item.gallery_details?.category || 'Education',
      date: item.gallery_details?.project_date || item.publish_date || item.created_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to load gallery items' });
  }
}

function getCategoryIcon(category?: string) {
  switch (category?.toLowerCase()) {
    case 'education':
      return 'GraduationCap';
    case 'healthcare':
      return 'Heart';
    case 'empowerment':
      return 'Users';
    case 'infrastructure':
      return 'Building';
    default:
      return 'GraduationCap';
  }
}

function getMockGallery(limit?: number) {
  const mockGallery = [
    {
      id: '1',
      title: 'Widows Food Support Outreach',
      description: 'Over 30 widows received carefully packed food supplies including rice, oil, garri, and seasoning items during our second official outreach.',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop',
      icon: 'Heart',
      category: 'Relief',
      date: '2025-08-25'
    },
    {
      id: '2',
      title: 'Open Medical Checkup Outreach',
      description: 'Free medical consultations and basic treatments provided for over 40 widows and less privileged individuals during our second outreach.',
      image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=600&auto=format&fit=crop',
      icon: 'Heart',
      category: 'Healthcare',
      date: '2025-09-21'
    },
    {
      id: '3',
      title: 'Widow Empowerment Starter Support',
      description: 'Selected widows began receiving business starter items and monthly stipends, with one-on-one support sessions launched.',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=600&auto=format&fit=crop',
      icon: 'Users',
      category: 'Empowerment',
      date: '2025-10-14'
    },
    {
      id: '4',
      title: 'Community Support for Vulnerable Homes',
      description: 'Groceries, sanitary materials, and children\'s supplies distributed to families in poor housing conditions throughout Lagos.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop',
      icon: 'Home',
      category: 'Relief',
      date: '2025-08-01'
    }
  ];

  return limit ? mockGallery.slice(0, limit) : mockGallery;
}

async function createGalleryItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const galleryData = req.body;

    // Validate required fields
    if (!galleryData.title || !galleryData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Generate slug from title
    const slug = galleryData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newGalleryItem = {
      ...galleryData,
      slug,
      type: 'gallery',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { data, error } = await (supabaseAdmin as any)
      .from('content')
      .insert([newGalleryItem])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create gallery item' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateGalleryItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Gallery item ID is required' });
    }

    // Update slug if title changed
    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { data, error } = await (supabaseAdmin as any)
      .from('content')
      .update(updateData)
      .eq('id', id)
      .eq('type', 'gallery')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update gallery item' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteGalleryItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Gallery item ID is required' });
    }

    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { error } = await (supabaseAdmin as any)
      .from('content')
      .delete()
      .eq('id', id)
      .eq('type', 'gallery');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete gallery item' });
    }

    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
