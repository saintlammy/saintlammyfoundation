import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getNews(req, res);
    case 'POST':
      return await createNews(req, res);
    case 'PUT':
      return await updateNews(req, res);
    case 'DELETE':
      return await deleteNews(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getNews(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {
    if (!supabase) {
      console.error('⚠️ Supabase not configured');
      return res.status(200).json([]);
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'news')
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
      return res.status(500).json({ error: 'Failed to fetch news', details: error.message });
    }

    // Return empty array if no data (DO NOT return mock data)
    if (!data || data.length === 0) {
      console.log('📭 No news found in database');
      return res.status(200).json([]);
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      date: item.publish_date || item.created_at,
      category: item.news_details?.category || 'update',
      image: item.featured_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: item.news_details?.read_time || '3 min read',
      slug: item.slug || item.id
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('❌ API error:', error);
    return res.status(500).json({ error: 'Failed to fetch news', message: (error as any)?.message });
  }
}

async function createNews(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newsData = req.body;

    if (!newsData.title || !newsData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = newsData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newNews = {
      id: newsData.id || `news-${Date.now()}`,
      ...newsData,
      slug,
      type: 'news',
      status: newsData.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      console.error('❌ No database client available!');
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not save news to database.'
      });
    }

    console.log('📝 Creating news:', newNews.id);

    const { data, error } = await (dbClient
      .from('content') as any)
      .insert([newNews] as any)
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

    console.log(`✅ Created news ${newNews.id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(201).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function updateNews(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'News ID is required' });
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
        message: 'Could not update news.'
      });
    }

    const { data, error } = await (dbClient
      .from('content') as any)
      .update(updateData as any)
      .eq('id', id)
      .eq('type', 'news')
      .select()
      .single();

    if (error) {
      console.error('❌ Database update failed:', error);
      return res.status(500).json({
        error: 'Database update failed',
        message: error.message
      });
    }

    console.log(`✅ Updated news ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function deleteNews(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'News ID is required' });
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
      .eq('type', 'news');

    if (error) {
      console.error('❌ Delete failed:', error);
      return res.status(500).json({
        error: 'Failed to delete news',
        message: error.message
      });
    }

    console.log(`✅ Deleted news ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json({ success: true, message: 'News deleted successfully' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}