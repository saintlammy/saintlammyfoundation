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
        frequency
      } = req.query;

      let query = (client as any)
        .from('recurring_donations')
        .select(`
          *,
          donors(name, email)
        `);

      // Filter by status
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Filter by frequency
      if (frequency && frequency !== 'all') {
        query = query.eq('frequency', frequency);
      }

      // Pagination
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query = query.range(offset, offset + parseInt(limit as string) - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data: recurringDonations, error } = await query;

      if (error) {
        console.error('Error fetching recurring donations:', error);
        return res.status(500).json({
          error: 'Failed to fetch recurring donations',
          message: error.message
        });
      }

      // Get total count for pagination
      const { count, error: countError } = await (client as any)
        .from('recurring_donations')
        .select('*', { count: 'exact', head: true });

      return res.status(200).json({
        success: true,
        data: recurringDonations || [],
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      });

    } else if (req.method === 'PUT') {
      // Update recurring donation status
      const { donationId, status } = req.body;

      if (!donationId || !status) {
        return res.status(400).json({
          error: 'Missing required fields: donationId, status'
        });
      }

      const { data: recurringDonation, error } = await (client as any)
        .from('recurring_donations')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId)
        .select()
        .single();

      if (error) {
        console.error('Error updating recurring donation:', error);
        return res.status(500).json({
          error: 'Failed to update recurring donation',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: recurringDonation,
        message: 'Recurring donation updated successfully'
      });

    } else if (req.method === 'POST') {
      // Create new recurring donation
      const recurringData = req.body;

      const { data: newRecurringDonation, error } = await (client as any)
        .from('recurring_donations')
        .insert([{
          ...recurringData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating recurring donation:', error);
        return res.status(500).json({
          error: 'Failed to create recurring donation',
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: newRecurringDonation,
        message: 'Recurring donation created successfully'
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin recurring donations API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}