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
        status,
        search
      } = req.query;

      let query = (client as any).from('volunteers').select('*');

      // Filter by status
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Search functionality
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Pagination
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query = query.range(offset, offset + parseInt(limit as string) - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data: volunteers, error } = await query;

      if (error) {
        console.error('Error fetching volunteers:', error);
        return res.status(500).json({
          error: 'Failed to fetch volunteers',
          message: error.message
        });
      }

      // Get total count for pagination
      const { count, error: countError } = await (client as any)
        .from('volunteers')
        .select('*', { count: 'exact', head: true });

      return res.status(200).json({
        success: true,
        data: volunteers || [],
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      });

    } else if (req.method === 'PUT') {
      // Update volunteer status
      const { volunteerId, status, notes } = req.body;

      if (!volunteerId || !status) {
        return res.status(400).json({
          error: 'Missing required fields: volunteerId, status'
        });
      }

      const { data: volunteer, error } = await (client as any)
        .from('volunteers')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', volunteerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating volunteer:', error);
        return res.status(500).json({
          error: 'Failed to update volunteer',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: volunteer,
        message: 'Volunteer updated successfully'
      });

    } else if (req.method === 'DELETE') {
      // Soft delete volunteer
      const { volunteerId } = req.body;

      if (!volunteerId) {
        return res.status(400).json({
          error: 'Missing required field: volunteerId'
        });
      }

      const { error } = await (client as any)
        .from('volunteers')
        .update({
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', volunteerId);

      if (error) {
        console.error('Error deactivating volunteer:', error);
        return res.status(500).json({
          error: 'Failed to deactivate volunteer',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Volunteer deactivated successfully'
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin volunteers API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}