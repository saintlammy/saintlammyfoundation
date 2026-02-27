import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  const { table } = req.query;

  if (!table || typeof table !== 'string') {
    return res.status(400).json({ error: 'Invalid table parameter' });
  }

  const validTables = [
    'organization_types',
    'partnership_types',
    'partnership_timelines'
  ];

  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getOptions(table, req, res);
      case 'POST':
        return await createOption(table, req, res);
      case 'PUT':
        return await updateOption(table, req, res);
      case 'DELETE':
        return await deleteOption(table, req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(`${table} API error:`, error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function getOptions(table: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status = 'all' } = req.query;

    let query = (supabaseAdmin as any).from(table).select('*');

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
      console.error(`Error fetching ${table}:`, error);
      return res.status(500).json({
        error: `Failed to fetch ${table}`,
        message: error.message
      });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error(`Get ${table} error:`, error);
    return res.status(500).json({ error: `Failed to fetch ${table}` });
  }
}

async function createOption(table: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, description, is_active = true, sort_order = 0 } = req.body;

    if (!title || title.trim().length < 2) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Title must be at least 2 characters long'
      });
    }

    const dbData = {
      title: title.trim(),
      description: description?.trim() || null,
      is_active,
      sort_order: parseInt(sort_order) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabaseAdmin as any)
      .from(table)
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${table} option:`, error);

      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'An option with this title already exists'
        });
      }

      return res.status(500).json({
        error: `Failed to create ${table} option`,
        message: error.message
      });
    }

    return res.status(201).json({
      success: true,
      data,
      message: 'Option created successfully'
    });
  } catch (error) {
    console.error(`Create ${table} option error:`, error);
    return res.status(500).json({ error: `Failed to create ${table} option` });
  }
}

async function updateOption(table: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { title, description, is_active, sort_order } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid option ID' });
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
    if (is_active !== undefined) updateData.is_active = is_active;
    if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order) || 0;

    const { data, error } = await (supabaseAdmin as any)
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${table} option:`, error);

      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'An option with this title already exists'
        });
      }

      return res.status(500).json({
        error: `Failed to update ${table} option`,
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'Option not found' });
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Option updated successfully'
    });
  } catch (error) {
    console.error(`Update ${table} option error:`, error);
    return res.status(500).json({ error: `Failed to update ${table} option` });
  }
}

async function deleteOption(table: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid option ID' });
    }

    // Soft delete by setting is_active to false
    const { data, error } = await (supabaseAdmin as any)
      .from(table)
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error deleting ${table} option:`, error);
      return res.status(500).json({
        error: `Failed to delete ${table} option`,
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'Option not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Option deactivated successfully'
    });
  } catch (error) {
    console.error(`Delete ${table} option error:`, error);
    return res.status(500).json({ error: `Failed to delete ${table} option` });
  }
}
