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

      let query = (client as any).from('newsletter_subscribers').select('*');

      // Filter by status
      if (status && status !== 'all') {
        query = query.eq('is_active', status === 'active');
      }

      // Search functionality
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Pagination
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query = query.range(offset, offset + parseInt(limit as string) - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data: subscribers, error } = await query;

      if (error) {
        console.error('Error fetching newsletter subscribers:', error);
        return res.status(500).json({
          error: 'Failed to fetch subscribers',
          message: error.message
        });
      }

      // Get total count
      const { count, error: countError } = await (client as any)
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true });

      // Get active count
      const { count: activeCount } = await (client as any)
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return res.status(200).json({
        success: true,
        data: subscribers || [],
        stats: {
          active: activeCount || 0,
          total: count || 0,
          inactive: (count || 0) - (activeCount || 0)
        },
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      });

    } else if (req.method === 'PUT') {
      // Update subscriber status
      const { subscriberId, is_active } = req.body;

      if (!subscriberId) {
        return res.status(400).json({
          error: 'Subscriber ID is required'
        });
      }

      const updateData: any = {
        is_active,
        updated_at: new Date().toISOString()
      };

      const { data: subscriber, error } = await (client as any)
        .from('newsletter_subscribers')
        .update(updateData)
        .eq('id', subscriberId)
        .select()
        .single();

      if (error) {
        console.error('Error updating subscriber:', error);
        return res.status(500).json({
          error: 'Failed to update subscriber',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: subscriber,
        message: 'Subscriber updated successfully'
      });

    } else if (req.method === 'POST') {
      // Add new subscriber manually
      const { name, email, source = 'admin' } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          error: 'Name and email are required'
        });
      }

      // Check if email already exists
      const { data: existingSubscriber } = await (client as any)
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existingSubscriber) {
        return res.status(409).json({
          error: 'Subscriber already exists',
          message: 'A subscriber with this email already exists.'
        });
      }

      const { data: newSubscriber, error } = await (client as any)
        .from('newsletter_subscribers')
        .insert([{
          name: name.trim(),
          email: email.toLowerCase().trim(),
          source,
          is_active: true,
          subscribed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating subscriber:', error);
        return res.status(500).json({
          error: 'Failed to create subscriber',
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: newSubscriber,
        message: 'Subscriber added successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete subscriber
      const { subscriberId } = req.body;

      if (!subscriberId) {
        return res.status(400).json({
          error: 'Subscriber ID is required'
        });
      }

      const { error } = await (client as any)
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) {
        console.error('Error deleting subscriber:', error);
        return res.status(500).json({
          error: 'Failed to delete subscriber',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Subscriber deleted successfully'
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin newsletter API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}