import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, handleSupabaseError, isSupabaseAvailable, getTypedSupabaseClient } from '@/lib/supabase';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category: 'donation' | 'volunteer' | 'program' | 'general' | 'emergency' | 'system';
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  user_id?: string;
  metadata?: any;
  created_at: string;
  read_at?: string;
}

/**
 * Notification API endpoints
 * GET - Fetch notifications (with filters)
 * POST - Create notification
 * PUT - Update notification (mark as read)
 * DELETE - Delete notification
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      return await getNotifications(req, res);
    } else if (req.method === 'POST') {
      return await createNotification(req, res);
    } else if (req.method === 'PUT') {
      return await updateNotification(req, res);
    } else if (req.method === 'DELETE') {
      return await deleteNotification(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in notifications API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getNotifications(req: NextApiRequest, res: NextApiResponse) {
  const { user_id, type, category, read, limit = 50, offset = 0 } = req.query;

  if (!isSupabaseAvailable || !supabase) {
    // Return empty array if database not available
    return res.status(200).json({
      success: true,
      notifications: [],
      total: 0,
      message: 'Database not configured'
    });
  }

  try {
    const client = getTypedSupabaseClient();
    let query = (client as any)
      .from('notifications')
      .select('*', { count: 'exact' });

    // Apply filters
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (read !== undefined) {
      query = query.eq('read', read === 'true');
    }

    // Apply pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    query = query
      .order('created_at', { ascending: false })
      .range(offsetNum, offsetNum + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({
        error: 'Failed to fetch notifications',
        message: handleSupabaseError(error)
      });
    }

    return res.status(200).json({
      success: true,
      notifications: data || [],
      total: count || 0
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return res.status(500).json({
      error: 'Failed to fetch notifications',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function createNotification(req: NextApiRequest, res: NextApiResponse) {
  const { title, message, type, category, priority, user_id, metadata } = req.body;

  // Validate required fields
  if (!title || !message || !type) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'title, message, and type are required'
    });
  }

  if (!isSupabaseAvailable || !supabase) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Cannot create notification without database connection'
    });
  }

  try {
    const client = getTypedSupabaseClient();
    const { data, error } = await (client as any)
      .from('notifications')
      .insert({
        title,
        message,
        type,
        category: category || 'general',
        priority: priority || 'medium',
        user_id,
        metadata,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({
        error: 'Failed to create notification',
        message: handleSupabaseError(error)
      });
    }

    return res.status(201).json({
      success: true,
      notification: data,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error in createNotification:', error);
    return res.status(500).json({
      error: 'Failed to create notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function updateNotification(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { read, read_at } = req.body;

  if (!id) {
    return res.status(400).json({
      error: 'Missing notification ID',
      message: 'Notification ID is required'
    });
  }

  if (!isSupabaseAvailable || !supabase) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Cannot update notification without database connection'
    });
  }

  try {
    const client = getTypedSupabaseClient();
    const updateData: any = {};

    if (read !== undefined) {
      updateData.read = read;
      if (read && !read_at) {
        updateData.read_at = new Date().toISOString();
      }
    }

    const { data, error } = await (client as any)
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({
        error: 'Failed to update notification',
        message: handleSupabaseError(error)
      });
    }

    return res.status(200).json({
      success: true,
      notification: data,
      message: 'Notification updated successfully'
    });
  } catch (error) {
    console.error('Error in updateNotification:', error);
    return res.status(500).json({
      error: 'Failed to update notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function deleteNotification(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: 'Missing notification ID',
      message: 'Notification ID is required'
    });
  }

  if (!isSupabaseAvailable || !supabase) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Cannot delete notification without database connection'
    });
  }

  try {
    const client = getTypedSupabaseClient();
    const { error } = await (client as any)
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({
        error: 'Failed to delete notification',
        message: handleSupabaseError(error)
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return res.status(500).json({
      error: 'Failed to delete notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
