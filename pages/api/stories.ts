import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getStories(req, res);
    case 'POST':
      return await createStory(req, res);
    case 'PUT':
      return await updateStory(req, res);
    case 'DELETE':
      return await deleteStory(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getStories(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {
    if (!supabase) {
      console.error('⚠️ Supabase not configured');
      return res.status(200).json([]);
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'story')
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
      return res.status(500).json({ error: 'Failed to fetch stories', details: error.message });
    }

    // Return empty array if no data (DO NOT return mock data)
    if (!data || data.length === 0) {
      console.log('📭 No stories found in database');
      return res.status(200).json([]);
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      name: item.story_details?.beneficiary_name || 'Anonymous',
      age: item.story_details?.beneficiary_age,
      location: item.story_details?.location || 'Nigeria',
      story: item.content || item.excerpt,
      quote: item.story_details?.quote || '',
      image: item.featured_image || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: item.story_details?.category || 'orphan',
      impact: item.story_details?.impact || '',
      dateHelped: item.story_details?.date_helped || item.publish_date
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('❌ API error:', error);
    return res.status(500).json({ error: 'Failed to fetch stories', message: (error as any)?.message });
  }
}

async function createStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storyData = req.body;

    if (!storyData.title || !storyData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = storyData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newStory = {
      id: storyData.id || `story-${Date.now()}`,
      ...storyData,
      slug,
      type: 'story',
      status: storyData.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      console.error('❌ No database client available!');
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not save story to database.'
      });
    }

    console.log('📝 Creating story:', newStory.id);

    const { data, error } = await (dbClient
      .from('content') as any)
      .insert([newStory] as any)
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

    console.log(`✅ Created story ${newStory.id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(201).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function updateStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
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
        message: 'Could not update story.'
      });
    }

    const { data, error } = await (dbClient
      .from('content') as any)
      .update(updateData as any)
      .eq('id', id)
      .eq('type', 'story')
      .select()
      .single();

    if (error) {
      console.error('❌ Database update failed:', error);
      return res.status(500).json({
        error: 'Database update failed',
        message: error.message
      });
    }

    console.log(`✅ Updated story ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function deleteStory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Story ID is required' });
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
      .eq('type', 'story');

    if (error) {
      console.error('❌ Delete failed:', error);
      return res.status(500).json({
        error: 'Failed to delete story',
        message: error.message
      });
    }

    console.log(`✅ Deleted story ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json({ success: true, message: 'Story deleted successfully' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}