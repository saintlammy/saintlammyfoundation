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
    'supported_currencies',
    'payment_methods',
    'donation_types',
    'donation_preset_amounts'
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
    const { status = 'all', currency_code } = req.query;

    let query = (supabaseAdmin as any).from(table).select('*');

    // Filter by status
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }

    // Special filter for preset amounts by currency
    if (table === 'donation_preset_amounts' && currency_code) {
      query = query.eq('currency_code', currency_code);
    }

    // Special filter for crypto currencies
    if (table === 'supported_currencies' && req.query.crypto !== undefined) {
      query = query.eq('is_crypto', req.query.crypto === 'true');
    }

    // Order by sort_order
    query = query.order('sort_order', { ascending: true });

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
    const dbData: any = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Validation based on table
    if (table === 'supported_currencies') {
      if (!dbData.code || !dbData.name || !dbData.symbol) {
        return res.status(400).json({ error: 'Missing required fields: code, name, symbol' });
      }
      dbData.code = dbData.code.toUpperCase().substring(0, 3);
    } else if (table === 'donation_preset_amounts') {
      if (!dbData.currency_code || !dbData.amount) {
        return res.status(400).json({ error: 'Missing required fields: currency_code, amount' });
      }
      if (parseFloat(dbData.amount) <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
      }
    } else {
      // For other tables, require at least title/name
      if (!dbData.title && !dbData.name) {
        return res.status(400).json({ error: 'Missing required field: title or name' });
      }
    }

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
          message: 'An option with this value already exists'
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

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid option ID' });
    }

    const updateData: any = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    // Remove id and timestamps from update data
    delete updateData.id;
    delete updateData.created_at;

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
          message: 'An option with this value already exists'
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
