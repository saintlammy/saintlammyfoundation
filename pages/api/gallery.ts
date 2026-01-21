import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';

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
  const { status = 'published', limit } = req.query;

  try {
    if (!supabase) {
      console.error('⚠️ Supabase not configured');
      return res.status(200).json([]);
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'gallery')
      .order('publish_date', { ascending: false });

    // Only filter by status if it's not 'all'
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Database query failed:', error);
      return res.status(500).json({ error: 'Failed to fetch gallery items', details: error.message });
    }

    // Return empty array if no data (DO NOT return mock data)
    if (!data || data.length === 0) {
      console.log('📭 No gallery items found in database');
      return res.status(200).json([]);
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
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
    console.error('❌ API error:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery items', message: (error as any)?.message });
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

async function createGalleryItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const galleryData = req.body;

    if (!galleryData.title || !galleryData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = galleryData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newGalleryItem = {
      id: galleryData.id || `gallery-${Date.now()}`,
      ...galleryData,
      slug,
      type: 'gallery',
      status: galleryData.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      console.error('❌ No database client available!');
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not save gallery item to database.'
      });
    }

    console.log('📝 Creating gallery item:', newGalleryItem.id);

    const { data, error } = await (dbClient
      .from('content') as any)
      .insert([newGalleryItem] as any)
      .select()
      .single();

    if (error) {
      console.error('❌ Database insert failed:', error);
      return res.status(500).json({
        error: 'Database save failed',
        message: error.message,
        code: error.code
      });
    }

    console.log(`✅ Created gallery item ${newGalleryItem.id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(201).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function updateGalleryItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Gallery item ID is required' });
    }

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not update gallery item.'
      });
    }

    const { data, error } = await (dbClient
      .from('content') as any)
      .update(updateData as any)
      .eq('id', id)
      .eq('type', 'gallery')
      .select()
      .single();

    if (error) {
      console.error('❌ Database update failed:', error);
      return res.status(500).json({
        error: 'Database update failed',
        message: error.message
      });
    }

    console.log(`✅ Updated gallery item ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function deleteGalleryItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Gallery item ID is required' });
    }

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({
        error: 'Database not configured'
      });
    }

    const { error } = await (dbClient
      .from('content') as any)
      .delete()
      .eq('id', id)
      .eq('type', 'gallery');

    if (error) {
      console.error('❌ Delete failed:', error);
      return res.status(500).json({
        error: 'Failed to delete gallery item',
        message: error.message
      });
    }

    console.log(`✅ Deleted gallery item ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}