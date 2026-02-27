import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

interface ContactInquiryType {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getInquiryTypes(req, res);
      case 'POST':
        return await createInquiryType(req, res);
      case 'PUT':
        return await updateInquiryType(req, res);
      case 'DELETE':
        return await deleteInquiryType(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Contact inquiry types API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getInquiryTypes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status = 'all' } = req.query;

    let query = (supabaseAdmin as any).from('contact_inquiry_types').select('*');

    // Filter by status
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    // Order by sort_order, then title
    query = query.order('sort_order', { ascending: true }).order('title', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inquiry types:', error);
      return res.status(500).json({
        error: 'Failed to fetch inquiry types',
        message: error.message
      });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Get inquiry types error:', error);
    return res.status(500).json({ error: 'Failed to fetch inquiry types' });
  }
}

async function createInquiryType(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, icon, is_active = true, sort_order = 0 } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Title must be at least 2 characters long'
      });
    }

    const dbData = {
      title: title.trim(),
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      is_active,
      sort_order: parseInt(sort_order) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabaseAdmin as any)
      .from('contact_inquiry_types')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating inquiry type:', error);

      // Check for duplicate
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'An inquiry type with this title already exists'
        });
      }

      return res.status(500).json({
        error: 'Failed to create inquiry type',
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      data,
      message: 'Inquiry type created successfully'
    });
  } catch (error) {
    console.error('Create inquiry type error:', error);
    return res.status(500).json({ error: 'Failed to create inquiry type' });
  }
}

async function updateInquiryType(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { title, description, icon, is_active, sort_order } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid inquiry type ID' });
    }

    if (title && title.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Title must be at least 2 characters long'
      });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (icon !== undefined) updateData.icon = icon?.trim() || null;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order) || 0;

    const { data, error } = await (supabaseAdmin as any)
      .from('contact_inquiry_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inquiry type:', error);

      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'An inquiry type with this title already exists'
        });
      }

      return res.status(500).json({
        error: 'Failed to update inquiry type',
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'Inquiry type not found' });
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Inquiry type updated successfully'
    });
  } catch (error) {
    console.error('Update inquiry type error:', error);
    return res.status(500).json({ error: 'Failed to update inquiry type' });
  }
}

async function deleteInquiryType(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid inquiry type ID' });
    }

    // Soft delete by setting is_active to false
    const { data, error } = await (supabaseAdmin as any)
      .from('contact_inquiry_types')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting inquiry type:', error);
      return res.status(500).json({
        error: 'Failed to delete inquiry type',
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'Inquiry type not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry type deactivated successfully'
    });
  } catch (error) {
    console.error('Delete inquiry type error:', error);
    return res.status(500).json({ error: 'Failed to delete inquiry type' });
  }
}
