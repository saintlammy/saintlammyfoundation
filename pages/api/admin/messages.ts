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
        priority,
        search
      } = req.query;

      let query = (client as any).from('messages').select('*');

      // Filter by status
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Filter by priority
      if (priority && priority !== 'all') {
        query = query.eq('priority', priority);
      }

      // Search functionality
      if (search) {
        query = query.or(`sender_name.ilike.%${search}%,sender_email.ilike.%${search}%,subject.ilike.%${search}%`);
      }

      // Pagination
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query = query.range(offset, offset + parseInt(limit as string) - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data: messages, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({
          error: 'Failed to fetch messages',
          message: error.message
        });
      }

      // Get total count for pagination
      const { count, error: countError } = await (client as any)
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Get unread count
      const { count: unreadCount } = await (client as any)
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      return res.status(200).json({
        success: true,
        data: messages || [],
        stats: {
          unread: unreadCount || 0,
          total: count || 0
        },
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      });

    } else if (req.method === 'PUT') {
      // Update message status
      const { messageId, status, priority } = req.body;

      if (!messageId) {
        return res.status(400).json({
          error: 'Message ID is required'
        });
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;

      const { data: message, error } = await (client as any)
        .from('messages')
        .update(updateData)
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        console.error('Error updating message:', error);
        return res.status(500).json({
          error: 'Failed to update message',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: message,
        message: 'Message updated successfully'
      });

    } else if (req.method === 'POST') {
      // Store contact form submission as message
      const { sender_name, sender_email, subject, content, priority = 'normal' } = req.body;

      if (!sender_name || !sender_email || !subject || !content) {
        return res.status(400).json({
          error: 'Missing required fields: sender_name, sender_email, subject, content'
        });
      }

      const { data: newMessage, error } = await (client as any)
        .from('messages')
        .insert([{
          sender_name,
          sender_email,
          subject,
          content,
          priority,
          status: 'unread',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating message:', error);
        return res.status(500).json({
          error: 'Failed to create message',
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: newMessage,
        message: 'Message created successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete message
      const { messageId } = req.body;

      if (!messageId) {
        return res.status(400).json({
          error: 'Message ID is required'
        });
      }

      const { error } = await (client as any)
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({
          error: 'Failed to delete message',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin messages API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}