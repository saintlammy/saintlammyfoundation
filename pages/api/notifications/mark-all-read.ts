import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, handleSupabaseError } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/serverAuth';

/**
 * Mark all notifications as read for a user
 * POST /api/notifications/mark-all-read
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id } = req.body;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ error: 'A user ID is required' });
  }

  if (!supabaseAdmin) {
    return res.status(503).json({
      error: 'Database not available',
      message: 'Cannot mark notifications as read without database connection'
    });
  }

  try {
    const query = (supabaseAdmin as any)
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('read', false)
      .eq('user_id', user_id);

    const { data, error, count } = await query.select('*', { count: 'exact' });

    if (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({
        error: 'Failed to mark notifications as read',
        message: handleSupabaseError(error)
      });
    }

    return res.status(200).json({
      success: true,
      updated_count: count || 0,
      message: `Marked ${count || 0} notification(s) as read`
    });
  } catch (error) {
    console.error('Error in mark-all-read:', error);
    return res.status(500).json({
      error: 'Failed to mark notifications as read',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAdminAuth(handler);
