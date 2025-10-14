import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, handleSupabaseError, isSupabaseAvailable, getTypedSupabaseClient } from '@/lib/supabase';

/**
 * Broadcast a notification to all users or specific user groups
 * POST /api/notifications/broadcast
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    title,
    message,
    type = 'info',
    category = 'general',
    priority = 'medium',
    target = 'all', // 'all', 'admins', 'donors', 'volunteers'
    metadata
  } = req.body;

  // Validate required fields
  if (!title || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'title and message are required'
    });
  }

  if (!isSupabaseAvailable || !supabase) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Cannot broadcast notification without database connection'
    });
  }

  try {
    const client = getTypedSupabaseClient();

    // Get target users based on filter
    let userQuery = (client as any).from('donors').select('id, email');

    if (target === 'admins') {
      // Filter for admin users
      userQuery = userQuery.eq('role', 'admin');
    } else if (target === 'donors') {
      // Filter for users who have made donations
      userQuery = userQuery.not('id', 'is', null);
    }

    const { data: users, error: userError } = await userQuery;

    if (userError) {
      console.error('Error fetching users:', userError);
      return res.status(500).json({
        error: 'Failed to fetch users',
        message: handleSupabaseError(userError)
      });
    }

    // Create notifications for all target users
    const notifications = users.map((user: any) => ({
      title,
      message,
      type,
      category,
      priority,
      user_id: user.id,
      metadata,
      read: false,
      created_at: new Date().toISOString()
    }));

    // Batch insert notifications
    const { data, error } = await (client as any)
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {
      console.error('Error broadcasting notifications:', error);
      return res.status(500).json({
        error: 'Failed to broadcast notifications',
        message: handleSupabaseError(error)
      });
    }

    console.log(`📢 Broadcast notification to ${notifications.length} users: "${title}"`);

    return res.status(201).json({
      success: true,
      broadcast_count: notifications.length,
      notifications: data,
      message: `Notification broadcast to ${notifications.length} user(s)`
    });
  } catch (error) {
    console.error('Error in broadcast:', error);
    return res.status(500).json({
      error: 'Failed to broadcast notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
