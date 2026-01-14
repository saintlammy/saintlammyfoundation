import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

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
      // GET - Fetch scheduled content
      const { status = 'scheduled', limit = '50' } = req.query;

      (let query = client
        .from('content_pages') as any)
        .select(`
          id,
          title,
          slug,
          type,
          status,
          publish_date,
          created_at,
          updated_at
        `)
        .order('publish_date', { ascending: true });

      if (status === 'scheduled') {
        query = query.eq('status', 'scheduled');
      } else if (status === 'pending') {
        // Content that should be published now
        query = query
          .eq('status', 'scheduled')
          .lte('publish_date', new Date().toISOString());
      }

      const { data: scheduledContent, error } = await query.limit(parseInt(limit as any));

      if (error) {
        console.error('Error fetching scheduled content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch scheduled content',
          details: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: scheduledContent,
        total: scheduledContent.length
      });

    } else if (req.method === 'POST') {
      // POST - Schedule content for publication
      const { content_id, publish_date, timezone = 'UTC' } = req.body;

      if (!content_id || !publish_date) {
        return res.status(400).json({
          success: false,
          error: 'Content ID and publish date are required'
        });
      }

      // Validate publish date is in the future
      const scheduleDate = new Date(publish_date);
      const now = new Date();

      if (scheduleDate <= now) {
        return res.status(400).json({
          success: false,
          error: 'Publish date must be in the future'
        });
      }

      // Update content status to scheduled
      const { data: updatedContent, error } = await (client
        .from('content_pages') as any)
        .update({
          status: 'scheduled',
          publish_date: scheduleDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', content_id)
        .select()
        .single();

      if (error) {
        console.error('Error scheduling content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to schedule content',
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
        data: updatedContent,
        message: `Content scheduled for publication on ${scheduleDate.toLocaleString()}`
      });

    } else if (req.method === 'PUT') {
      // PUT - Publish scheduled content (manual trigger or cron job)
      const { content_ids, force = false } = req.body;

      if (!content_ids || !Array.isArray(content_ids)) {
        return res.status(400).json({
          success: false,
          error: 'Content IDs array is required'
        });
      }

      const now = new Date().toISOString();
      let query = (client
        .from('content_pages') as any)
        .update({
          status: 'published',
          updated_at: now
        })
        .in('id', content_ids)
        .eq('status', 'scheduled');

      // Only publish if publish_date has passed, unless forced
      if (!force) {
        query = query.lte('publish_date', now);
      }

      const { data: publishedContent, error } = await query.select();

      if (error) {
        console.error('Error publishing scheduled content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to publish scheduled content',
          details: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: publishedContent,
        published_count: publishedContent.length,
        message: `${publishedContent.length} content items published successfully`
      });

    } else if (req.method === 'DELETE') {
      // DELETE - Cancel scheduled publication
      const { content_id } = req.query;

      if (!content_id) {
        return res.status(400).json({
          success: false,
          error: 'Content ID is required'
        });
      }

      // Update status back to draft and clear publish_date
      const { data: updatedContent, error } = await (client
        .from('content_pages') as any)
        .update({
          status: 'draft',
          publish_date: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', content_id)
        .eq('status', 'scheduled')
        .select()
        .single();

      if (error) {
        console.error('Error canceling scheduled content:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to cancel scheduled content',
          details: error.message
        });
      }

      if (!updatedContent) {
        return res.status(404).json({
          success: false,
          error: 'Scheduled content not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedContent,
        message: 'Scheduled publication canceled successfully'
      });

    } else {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Content scheduling API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function for cron jobs or background tasks
export async function publishScheduledContent() {
  try {
    const client = getTypedSupabaseClient();
    const now = new Date().toISOString();

    // Find content that should be published
    const { data: contentToPublish, error: fetchError } = await (client
      .from('content_pages') as any)
      .select('id, title')
      .eq('status', 'scheduled')
      .lte('publish_date', now);

    if (fetchError) {
      console.error('Error fetching scheduled content:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!contentToPublish || contentToPublish.length === 0) {
      return { success: true, published_count: 0, message: 'No content to publish' };
    }

    // Publish the content
    const contentIds = (contentToPublish as any).map((item: any) => item.id);
    const { data: publishedContent, error: publishError } = await (client
      .from('content_pages') as any)
      .update({
        status: 'published',
        updated_at: now
      })
      .in('id', contentIds)
      .select();

    if (publishError) {
      console.error('Error publishing content:', publishError);
      return { success: false, error: publishError.message };
    }

    console.log(`Successfully published ${publishedContent.length} scheduled content items`);
    return {
      success: true,
      published_count: publishedContent.length,
      published_items: publishedContent
    };

  } catch (error) {
    console.error('Error in publishScheduledContent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}