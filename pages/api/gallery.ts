import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getGallery(req, res);
    case 'POST':
      return await createGalleryItem(req, res);
    case 'PUT':
      return await updateGalleryItem(req, res);
    case 'DELETE':
      return await deleteGalleryItem(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getGallery(req: NextApiRequest, res: NextApiResponse) {

  try {
    const { status = 'published', limit } = req.query;

    let query = supabase
      .from('content')
      .select('*')
      .eq('type', 'gallery')
      .eq('status', status)
      .order('publish_date', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      // Fallback to mock data if Supabase fails
      return res.status(200).json(getMockGallery(limit ? parseInt(limit as string) : undefined));
    }

    if (!data || data.length === 0) {
      // Return mock data if no data in database
      return res.status(200).json(getMockGallery(limit ? parseInt(limit as string) : undefined));
    }

    // Transform data to match component interface
    const transformedData = data.map(item => ({
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
    // Fallback to mock data on any error
    res.status(200).json(getMockGallery(limit ? parseInt(limit as string) : undefined));
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
      title: 'Education Support Program',
      description: 'Providing school supplies, uniforms, and scholarships to orphaned children across Lagos State.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: 'GraduationCap',
      category: 'Education',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mobile Health Clinics',
      description: 'Bringing medical care directly to underserved communities with our mobile healthcare units.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: 'Heart',
      category: 'Healthcare',
      date: '2024-01-10'
    },
    {
      id: '3',
      title: 'Women Empowerment Initiative',
      description: 'Training widows in skills acquisition and providing micro-loans for sustainable businesses.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: 'Users',
      category: 'Empowerment',
      date: '2024-01-05'
    },
    {
      id: '4',
      title: 'Water Infrastructure Projects',
      description: 'Building wells and water purification systems in rural communities to ensure clean water access.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      icon: 'Building',
      category: 'Infrastructure',
      date: '2023-12-20'
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

    const { data, error } = await supabase
      .from('content')
      .insert([newGalleryItem])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Return mock response for development
      return res.status(201).json({
        id: Date.now().toString(),
        ...newGalleryItem,
        message: 'Gallery item created successfully (mock mode)'
      });
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

    const { data, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', id)
      .eq('type', 'gallery')
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Return mock response for development
      return res.status(200).json({
        id,
        ...updateData,
        message: 'Gallery item updated successfully (mock mode)'
      });
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

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
      .eq('type', 'gallery');

    if (error) {
      console.error('Supabase error:', error);
      // Return mock response for development
      return res.status(200).json({
        message: 'Gallery item deleted successfully (mock mode)'
      });
    }

    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}