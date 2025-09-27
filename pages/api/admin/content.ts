import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = getTypedSupabaseClient();

    if (req.method === 'GET') {
      const {
        page = '1',
        limit = '20',
        type,
        status,
        search
      } = req.query;

      // Determine which table to query based on type
      let tableName = 'content_pages';
      if (type === 'programs') tableName = 'programs';
      else if (type === 'outreaches') tableName = 'outreaches';
      else if (type === 'testimonials') tableName = 'testimonials';

      let query = (client as any).from(tableName).select('*');

      // Filter by status if applicable
      if (status && status !== 'all' && tableName !== 'outreaches') {
        query = query.eq('status', status);
      } else if (status && status !== 'all' && tableName === 'outreaches') {
        query = query.eq('status', status);
      }

      // Search functionality
      if (search) {
        if (tableName === 'content_pages') {
          query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        } else if (tableName === 'programs') {
          query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        } else if (tableName === 'outreaches') {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        } else if (tableName === 'testimonials') {
          query = query.or(`name.ilike.%${search}%,content.ilike.%${search}%`);
        }
      }

      // Pagination
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query = query.range(offset, offset + parseInt(limit as string) - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data: content, error } = await query;

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return res.status(500).json({
          error: `Failed to fetch ${tableName}`,
          message: error.message
        });
      }

      // Get total count for pagination
      const { count, error: countError } = await (client as any)
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      return res.status(200).json({
        success: true,
        data: content || [],
        type: tableName,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      });

    } else if (req.method === 'POST') {
      // Create new content
      const { type, ...contentData } = req.body;

      if (!type) {
        return res.status(400).json({
          error: 'Content type is required'
        });
      }

      let tableName = 'content_pages';
      if (type === 'programs') tableName = 'programs';
      else if (type === 'outreaches') tableName = 'outreaches';
      else if (type === 'testimonials') tableName = 'testimonials';

      const { data: newContent, error } = await (client as any)
        .from(tableName)
        .insert([{
          ...contentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${tableName}:`, error);
        return res.status(500).json({
          error: `Failed to create ${tableName}`,
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: newContent,
        message: `${tableName} created successfully`
      });

    } else if (req.method === 'PUT') {
      // Update content
      const { id, type, ...updateData } = req.body;

      if (!id || !type) {
        return res.status(400).json({
          error: 'Content ID and type are required'
        });
      }

      let tableName = 'content_pages';
      if (type === 'programs') tableName = 'programs';
      else if (type === 'outreaches') tableName = 'outreaches';
      else if (type === 'testimonials') tableName = 'testimonials';

      const { data: updatedContent, error } = await (client as any)
        .from(tableName)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        return res.status(500).json({
          error: `Failed to update ${tableName}`,
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedContent,
        message: `${tableName} updated successfully`
      });

    } else if (req.method === 'DELETE') {
      // Delete content
      const { id, type } = req.body;

      if (!id || !type) {
        return res.status(400).json({
          error: 'Content ID and type are required'
        });
      }

      let tableName = 'content_pages';
      if (type === 'programs') tableName = 'programs';
      else if (type === 'outreaches') tableName = 'outreaches';
      else if (type === 'testimonials') tableName = 'testimonials';

      const { error } = await (client as any)
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting ${tableName}:`, error);
        return res.status(500).json({
          error: `Failed to delete ${tableName}`,
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: `${tableName} deleted successfully`
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin content API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}