import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, handleSupabaseError } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/serverAuth';

/**
 * Broadcast a notification to all users or specific user groups
 * POST /api/notifications/broadcast
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  if (!supabaseAdmin) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Cannot broadcast notification without database connection'
    });
  }

  if (!['all', 'admins', 'donors', 'volunteers'].includes(target)) {
    return res.status(400).json({ error: 'Invalid target', message: 'target must be all, admins, donors, or volunteers' });
  }

  try {
    // Get target users based on filter
    let userQuery = (supabaseAdmin as any).from('users').select('id, email, role');

    if (target === 'admins') {
      // Filter for admin users
      userQuery = userQuery.in('role', ['admin', 'super_admin']);
    } else if (target === 'donors') {
      userQuery = userQuery.eq('role', 'donor');
    } else if (target === 'volunteers') {
      userQuery = userQuery.eq('role', 'volunteer');
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
    const notifications = (users || []).map((user: any) => ({
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

    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        broadcast_count: 0,
        notifications: [],
        message: 'No matching recipients were found'
      });
    }

    // Batch insert notifications
    const { data, error } = await (supabaseAdmin as any)
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

export default withAdminAuth(handler);
