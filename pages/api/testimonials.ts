import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';

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
  const { status = 'published', limit } = req.query;

  try {
    if (!supabase) {
      console.error('⚠️ Supabase not configured');
      return res.status(200).json([]);
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'testimonial')
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
      return res.status(500).json({ error: 'Failed to fetch testimonials', details: error.message });
    }

    // Return empty array if no data (DO NOT return mock data)
    if (!data || data.length === 0) {
      console.log('📭 No testimonials found in database');
      return res.status(200).json([]);
    }

    // Transform data to match component interface
    // Testimonial details are stored in story_details JSONB field
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      name: item.story_details?.author_name || item.title || 'Anonymous',
      role: item.story_details?.author_role || item.excerpt || 'Beneficiary',
      content: item.content,
      rating: item.story_details?.rating || 5,
      image: item.featured_image,
      program: item.story_details?.program || 'General',
      date: item.publish_date || item.created_at,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('❌ API error:', error);
    return res.status(500).json({ error: 'Failed to fetch testimonials', message: (error as any)?.message });
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

    // Build the testimonial object with only valid database columns
    const newTestimonial = {
      id: testimonialData.id || `testimonial-${Date.now()}`,
      type: 'testimonial',
      title: testimonialData.title,
      slug,
      excerpt: testimonialData.excerpt || '',
      content: testimonialData.content,
      featured_image: testimonialData.featured_image || null,
      status: testimonialData.status || 'draft',
      publish_date: testimonialData.publish_date || new Date().toISOString(),
      // Store testimonial-specific data in story_details JSONB field
      story_details: testimonialData.testimonial_details || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      console.error('❌ No database client available!');
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not save testimonial to database.'
      });
    }

    console.log('📝 Creating testimonial:', newTestimonial.id);

    const { data, error } = await (dbClient
      .from('content') as any)
      .insert([newTestimonial] as any)
      .select()
      .single();

    if (error) {
      console.error('❌ Database insert failed:', error);
      return res.status(500).json({
        error: 'Database save failed',
        message: error.message,
        code: error.code,
        details: error.details || 'No additional details'
      });
    }

    console.log(`✅ Created testimonial ${newTestimonial.id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(201).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function updateTestimonial(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Testimonial ID is required' });
    }

    // Build update object with only valid columns
    const validUpdateData: any = {
      updated_at: new Date().toISOString()
    };

    // Map incoming fields to database columns
    if (updateData.title) {
      validUpdateData.title = updateData.title;
      validUpdateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (updateData.content) validUpdateData.content = updateData.content;
    if (updateData.excerpt !== undefined) validUpdateData.excerpt = updateData.excerpt;
    if (updateData.status) validUpdateData.status = updateData.status;
    if (updateData.featured_image !== undefined) validUpdateData.featured_image = updateData.featured_image;

    // Store testimonial-specific data in story_details JSONB
    if (updateData.testimonial_details) {
      validUpdateData.story_details = updateData.testimonial_details;
    }

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not update testimonial.'
      });
    }

    const { data, error } = await (dbClient
      .from('content') as any)
      .update(validUpdateData as any)
      .eq('id', id)
      .eq('type', 'testimonial')
      .select()
      .single();

    if (error) {
      console.error('❌ Database update failed:', error);
      return res.status(500).json({
        error: 'Database update failed',
        message: error.message
      });
    }

    console.log(`✅ Updated testimonial ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function deleteTestimonial(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Testimonial ID is required' });
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
      .eq('type', 'testimonial');

    if (error) {
      console.error('❌ Delete failed:', error);
      return res.status(500).json({
        error: 'Failed to delete testimonial',
        message: error.message
      });
    }

    console.log(`✅ Deleted testimonial ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}