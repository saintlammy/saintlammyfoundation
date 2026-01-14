import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';
import { validateInput, sanitizeHtml } from '@/lib/validation';
import { ContentSchema } from '@/lib/schemas';

export interface ContentItem {
  id: string;
  title: string;
  type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: {
    name: string;
    email?: string;
  };
  content?: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  publishDate?: string;
  views: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ContentRequest {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  type: 'page' | 'blog' | 'program' | 'story' | 'media' | 'team' | 'partnership';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  featured_image?: string;
  publish_date?: string;
  metadata?: Record<string, any>;
  author_id?: string;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Ensure slug is unique
async function ensureUniqueSlug(client: any, slug: string, excludeId?: string): Promise<string> {
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const query = (client
      .from('content_pages') as any)
      .select('id')
      .eq('slug', uniqueSlug);

    if (excludeId) {
      query.neq('id', excludeId);
    }

    const { data } = await query.single();

    if (!data) {
      break; // Slug is unique
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Admin access required'
      });
    }

    const client = getTypedSupabaseClient();

    if (req.method === 'GET') {
      // GET - Fetch content with filtering and pagination
      const {
        type = 'all',
        status = 'all',
        search = '',
        limit = '50',
        offset = '0',
        author_id,
        date_from,
        date_to
      } = req.query;

      let query = (client
        .from('content_pages') as any)
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          type,
          status,
          featured_image,
          publish_date,
          metadata,
          author_id,
          created_at,
          updated_at
        `);

      // Apply filters
      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (author_id) {
        query = query.eq('author_id', author_id);
      }

      if (date_from) {
        query = query.gte('created_at', date_from);
      }

      if (date_to) {
        query = query.lte('created_at', date_to);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      // Get total count for pagination
      const { count } = await (client
        .from('content_pages') as any)
        .select('*', { count: 'exact', head: true });

      // Apply pagination and ordering - FIX: Handle query params as string | string[]
      const offsetNum = parseInt(Array.isArray(offset) ? offset[0] : offset || '0');
      const limitNum = parseInt(Array.isArray(limit) ? limit[0] : limit || '10');

      const { data: contentItems, error } = await query
        .order('created_at', { ascending: false })
        .range(offsetNum, offsetNum + limitNum - 1);

      if (error) {
        console.error('Error fetching content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch content',
          details: error.message
        });
      }

      // Transform data to include mock author info for now
      const transformedData = (contentItems as any).map((item: any) => ({
        ...item,
        views: Math.floor(Math.random() * 1000), // Mock views for now
        author: {
          name: 'Admin User', // In production, fetch from users table
          email: 'admin@saintlammyfoundation.org'
        }
      }));

      return res.status(200).json({
        success: true,
        data: transformedData,
        total: count || 0,
        limit: limitNum,
        offset: offsetNum
      });

    } else if (req.method === 'POST') {
      // POST - Create new content
      const validation = validateInput(ContentSchema)(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          details: validation.errors
        });
      }

      const contentData = validation.data as ContentRequest;

      // Sanitize content
      const sanitizedData = {
        title: sanitizeHtml(contentData.title),
        content: contentData.content, // Don't sanitize rich content, just validate
        excerpt: contentData.excerpt ? sanitizeHtml(contentData.excerpt) : null,
        type: contentData.type,
        status: contentData.status,
        featured_image: contentData.featured_image || null,
        publish_date: contentData.publish_date || null,
        metadata: contentData.metadata || {},
        author_id: contentData.author_id || null
      };

      // Generate and ensure unique slug
      const baseSlug = contentData.slug || generateSlug(sanitizedData.title);
      const uniqueSlug = await ensureUniqueSlug(client, baseSlug);

      const dbData = {
        ...sanitizedData,
        slug: uniqueSlug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newContent, error } = await (client
        .from('content_pages') as any)
        .insert([dbData] as any)
        .select()
        .single();

      if (error) {
        console.error('Error creating content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to create content',
          details: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          ...(newContent as any),
          author: {
            name: 'Admin User',
            email: 'admin@saintlammyfoundation.org'
          }
        },
        message: 'Content created successfully'
      });

    } else if (req.method === 'PUT') {
      // PUT - Update existing content
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Content ID is required for updates'
        });
      }

      const validation = validateInput(ContentSchema)(updateData);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input data',
          details: validation.errors
        });
      }

      // Sanitize update data
      const sanitizedData: any = {};

      if (updateData.title) {
        sanitizedData.title = sanitizeHtml(updateData.title);
      }
      if (updateData.content !== undefined) {
        sanitizedData.content = updateData.content;
      }
      if (updateData.excerpt !== undefined) {
        sanitizedData.excerpt = updateData.excerpt ? sanitizeHtml(updateData.excerpt) : null;
      }
      if (updateData.type) {
        sanitizedData.type = updateData.type;
      }
      if (updateData.status) {
        sanitizedData.status = updateData.status;
      }
      if (updateData.featured_image !== undefined) {
        sanitizedData.featured_image = updateData.featured_image;
      }
      if (updateData.publish_date !== undefined) {
        sanitizedData.publish_date = updateData.publish_date;
      }
      if (updateData.metadata !== undefined) {
        sanitizedData.metadata = updateData.metadata;
      }

      // Handle slug updates
      if (updateData.slug || updateData.title) {
        const newSlug = updateData.slug || generateSlug(sanitizedData.title || updateData.title);
        sanitizedData.slug = await ensureUniqueSlug(client, newSlug, id);
      }

      sanitizedData.updated_at = new Date().toISOString();

      const { data: updatedContent, error } = await (client
        .from('content_pages') as any)
        .update(sanitizedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to update content',
          details: error.message
        });
      }

      if (!updatedContent) {
        return res.status(404).json({
          success: false,
          error: 'Content not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          ...(updatedContent as any),
          author: {
            name: 'Admin User',
            email: 'admin@saintlammyfoundation.org'
          }
        },
        message: 'Content updated successfully'
      });

    } else if (req.method === 'DELETE') {
      // DELETE - Remove content
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Content ID is required for deletion'
        });
      }

      const { error } = await (client
        .from('content_pages') as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete content',
          details: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Content deleted successfully'
      });

    } else {
      // Method not allowed
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}