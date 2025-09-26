import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabase) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Supabase client is not configured'
    });
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const {
          type = 'all',
          status = 'all',
          limit = 50,
          offset = 0,
          search = ''
        } = req.query;

        let query = supabase
          .from('content')
          .select('*')
          .order('updated_at', { ascending: false })
          .range(Number(offset), Number(offset) + Number(limit) - 1);

        if (type !== 'all') {
          query = query.eq('type', type);
        }

        if (status !== 'all') {
          query = query.eq('status', status);
        }

        if (search) {
          query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) {
          console.error('Content fetch error:', error);
          return res.status(500).json({
            error: 'Failed to fetch content',
            message: error.message
          });
        }

        return res.status(200).json({
          success: true,
          data: data || [],
          total: count || 0,
          limit: Number(limit),
          offset: Number(offset)
        });

      } catch (error) {
        console.error('Content API error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'POST':
      try {
        const contentData = req.body;

        // Generate slug if not provided
        if (!contentData.slug) {
          contentData.slug = contentData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }

        const { data, error } = await (supabase as any)
          .from('content')
          .insert([contentData])
          .select()
          .single();

        if (error) {
          console.error('Content creation error:', error);
          return res.status(400).json({
            error: 'Failed to create content',
            message: error.message
          });
        }

        return res.status(201).json({
          success: true,
          data
        });

      } catch (error) {
        console.error('Content creation error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'PUT':
      try {
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({
            error: 'Content ID is required'
          });
        }

        const { data, error } = await (supabase as any)
          .from('content')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Content update error:', error);
          return res.status(400).json({
            error: 'Failed to update content',
            message: error.message
          });
        }

        return res.status(200).json({
          success: true,
          data
        });

      } catch (error) {
        console.error('Content update error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            error: 'Content ID is required'
          });
        }

        const { error } = await supabase
          .from('content')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Content deletion error:', error);
          return res.status(400).json({
            error: 'Failed to delete content',
            message: error.message
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Content deleted successfully'
        });

      } catch (error) {
        console.error('Content deletion error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}