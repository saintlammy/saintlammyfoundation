import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/serverAuth';
import { localizeNgoImage, NGO_IMAGES } from '@/lib/ngoImages';

const NEWS_CATEGORIES = new Set(['outreach', 'achievement', 'partnership', 'update']);

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
};

// Keep the sanitizer out of the public GET bundle path. Netlify loads API
// modules before invoking their handlers, and sanitize-html's transitive
// parser dependencies can otherwise prevent the route from starting at all.
// CMS writes still load and apply the sanitizer before content is persisted.
const sanitizeNewsWrite = async (value: unknown): Promise<string> => {
  const { sanitizeRichHtml } = await import('@/lib/sanitizeRichHtml');
  return sanitizeRichHtml(value);
};

const buildStoryDetails = (newsData: any, existing: Record<string, unknown> = {}) => {
  const metadata = newsData?.metadata || newsData?.story_details || newsData?.news_details || {};
  const requestedCategory = metadata.category || newsData?.category || existing.category || 'update';
  const category = NEWS_CATEGORIES.has(requestedCategory) ? requestedCategory : 'update';

  return {
    ...existing,
    category,
    read_time: metadata.read_time || metadata.readTime || newsData?.readTime || existing.read_time || '3 min read',
    author: metadata.author || newsData?.author || existing.author || 'Saintlammy Foundation Team',
    tags: normalizeStringArray(metadata.tags || newsData?.tags || existing.tags),
    featured: Boolean(metadata.featured ?? newsData?.featured ?? existing.featured ?? false),
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const isPublicRead = method === 'GET' && (req.query.status === undefined || req.query.status === 'published');
  if (!isPublicRead && !(await requireAdmin(req, res))) return;

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
    const transformedData = (data as any).map((item: any) => {
      // `story_details` is the metadata column that exists in the content table.
      // Keep the legacy lookup so older records remain readable if any exist.
      const details = item.story_details || item.news_details || {};

      return {
        id: item.id,
        slug: item.slug || item.id,
        title: item.title,
        excerpt: item.excerpt || '',
        content: typeof item.content === 'string' ? item.content : '',
        date: item.publish_date || item.created_at,
        category: details.category || 'update',
        image: localizeNgoImage(item.featured_image, NGO_IMAGES.community) || NGO_IMAGES.community,
        readTime: details.read_time || details.readTime || '3 min read',
        author: details.author || item.author || 'Saintlammy Foundation Team',
        tags: normalizeStringArray(details.tags),
        featured: Boolean(details.featured || item.featured),
        status: item.status,
      };
    });

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

    const title = String(newsData.title).trim();
    const slug = slugify(newsData.slug || title);
    const now = new Date().toISOString();

    const newNews = {
      id: newsData.id || `news-${Date.now()}`,
      title,
      slug,
      excerpt: typeof newsData.excerpt === 'string' ? newsData.excerpt.trim() : '',
      content: await sanitizeNewsWrite(String(newsData.content)),
      type: 'news',
      status: newsData.status || 'draft',
      featured_image: newsData.featured_image || newsData.image || NGO_IMAGES.community,
      publish_date: newsData.publish_date || newsData.date || now,
      story_details: buildStoryDetails(newsData),
      meta_description: newsData.meta_description || newsData.excerpt || null,
      meta_keywords: newsData.meta_keywords || null,
      created_at: now,
      updated_at: now,
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
    const newsData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'News ID is required' });
    }

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not update news.'
      });
    }

    const { data: currentNews, error: currentError } = await (dbClient
      .from('content') as any)
      .select('title, slug, story_details')
      .eq('id', id)
      .eq('type', 'news')
      .single();

    if (currentError || !currentNews) {
      return res.status(404).json({ error: 'News article not found' });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof newsData.title === 'string' && newsData.title.trim()) {
      updateData.title = newsData.title.trim();
      updateData.slug = slugify(newsData.slug || newsData.title);
    } else if (typeof newsData.slug === 'string' && newsData.slug.trim()) {
      updateData.slug = slugify(newsData.slug);
    }
    if (typeof newsData.excerpt === 'string') updateData.excerpt = newsData.excerpt.trim();
    if (typeof newsData.content === 'string') updateData.content = await sanitizeNewsWrite(newsData.content);
    if (typeof newsData.status === 'string') updateData.status = newsData.status;
    if (typeof newsData.featured_image === 'string' || typeof newsData.image === 'string') {
      updateData.featured_image = newsData.featured_image || newsData.image;
    }
    if (newsData.publish_date || newsData.date) updateData.publish_date = newsData.publish_date || newsData.date;
    if (newsData.meta_description !== undefined) updateData.meta_description = newsData.meta_description;
    if (newsData.meta_keywords !== undefined) updateData.meta_keywords = newsData.meta_keywords;
    if (
      newsData.metadata
      || newsData.story_details
      || newsData.news_details
      || newsData.category
      || newsData.readTime
      || newsData.author
      || newsData.tags
      || newsData.featured !== undefined
    ) {
      updateData.story_details = buildStoryDetails(newsData, currentNews.story_details || {});
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
