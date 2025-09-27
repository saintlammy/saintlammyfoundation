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

      let query = (client as any).from('testimonials').select('*');

      // Filter by status
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Search functionality
      if (search) {
        query = query.or(`name.ilike.%${search}%,role.ilike.%${search}%,content.ilike.%${search}%`);
      }

      // Pagination
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query = query.range(offset, offset + parseInt(limit as string) - 1);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data: testimonials, error } = await query;

      if (error) {
        console.error('Error fetching testimonials:', error);
        return res.status(500).json({
          error: 'Failed to fetch testimonials',
          message: error.message
        });
      }

      // Get total count
      const { count, error: countError } = await (client as any)
        .from('testimonials')
        .select('*', { count: 'exact', head: true });

      // Get approved count
      const { count: approvedCount } = await (client as any)
        .from('testimonials')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get pending count
      const { count: pendingCount } = await (client as any)
        .from('testimonials')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return res.status(200).json({
        success: true,
        data: testimonials || [],
        stats: {
          approved: approvedCount || 0,
          pending: pendingCount || 0,
          total: count || 0,
          featured: (testimonials || []).filter((t: any) => t.is_featured).length
        },
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit as string))
        }
      });

    } else if (req.method === 'PUT') {
      // Update testimonial
      const { testimonialId, status, is_featured, rating } = req.body;

      if (!testimonialId) {
        return res.status(400).json({
          error: 'Testimonial ID is required'
        });
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (status) updateData.status = status;
      if (typeof is_featured === 'boolean') updateData.is_featured = is_featured;
      if (rating) updateData.rating = rating;

      const { data: testimonial, error } = await (client as any)
        .from('testimonials')
        .update(updateData)
        .eq('id', testimonialId)
        .select()
        .single();

      if (error) {
        console.error('Error updating testimonial:', error);
        return res.status(500).json({
          error: 'Failed to update testimonial',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: testimonial,
        message: 'Testimonial updated successfully'
      });

    } else if (req.method === 'POST') {
      // Create new testimonial
      const { name, role, content, rating = 5, featured_image } = req.body;

      if (!name || !content) {
        return res.status(400).json({
          error: 'Name and content are required'
        });
      }

      const { data: newTestimonial, error } = await (client as any)
        .from('testimonials')
        .insert([{
          name: name.trim(),
          role: role?.trim() || '',
          content: content.trim(),
          rating: parseInt(rating),
          featured_image: featured_image || null,
          status: 'approved', // Admin created testimonials are auto-approved
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating testimonial:', error);
        return res.status(500).json({
          error: 'Failed to create testimonial',
          message: error.message
        });
      }

      return res.status(201).json({
        success: true,
        data: newTestimonial,
        message: 'Testimonial created successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete testimonial
      const { testimonialId } = req.body;

      if (!testimonialId) {
        return res.status(400).json({
          error: 'Testimonial ID is required'
        });
      }

      const { error } = await (client as any)
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) {
        console.error('Error deleting testimonial:', error);
        return res.status(500).json({
          error: 'Failed to delete testimonial',
          message: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Testimonial deleted successfully'
      });

    } else {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Admin testimonials API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}