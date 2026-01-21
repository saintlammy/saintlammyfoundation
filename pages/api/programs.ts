import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getPrograms(req, res);
    case 'POST':
      return await createProgram(req, res);
    case 'PUT':
      return await updateProgram(req, res);
    case 'DELETE':
      return await deleteProgram(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPrograms(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {
    if (!supabase) {
      console.error('⚠️ Supabase not configured');
      return res.status(200).json([]);
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'program')
      .order('publish_date', { ascending: false });

    // Only filter by status if it's not 'all'
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Database query failed:', error);
      return res.status(500).json({ error: 'Failed to fetch programs', details: error.message });
    }

    // Return empty array if no data (DO NOT return mock data)
    if (!data || data.length === 0) {
      console.log('📭 No programs found in database');
      return res.status(200).json([]);
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || item.content,
      image: item.featured_image,
      category: item.program_details?.category || 'education',
      targetAudience: item.program_details?.target_audience || 'General',
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('❌ API error:', error);
    return res.status(500).json({ error: 'Failed to fetch programs', message: (error as any)?.message });
  }
}

async function createProgram(req: NextApiRequest, res: NextApiResponse) {
  try {
    const programData = req.body;

    if (!programData.title || !programData.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = programData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProgram = {
      id: programData.id || `program-${Date.now()}`,
      ...programData,
      slug,
      type: 'program',
      status: programData.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      console.error('❌ No database client available!');
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not save program to database.'
      });
    }

    console.log('📝 Creating program:', newProgram.id);

    const { data, error } = await (dbClient
      .from('content') as any)
      .insert([newProgram] as any)
      .select()
      .single();

    if (error) {
      console.error('❌ Database insert failed:', error);
      return res.status(500).json({
        error: 'Database save failed',
        message: error.message,
        code: error.code
      });
    }

    console.log(`✅ Created program ${newProgram.id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(201).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function updateProgram(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Program ID is required' });
    }

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    updateData.updated_at = new Date().toISOString();

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Could not update program.'
      });
    }

    const { data, error} = await (dbClient
      .from('content') as any)
      .update(updateData as any)
      .eq('id', id)
      .eq('type', 'program')
      .select()
      .single();

    if (error) {
      console.error('❌ Database update failed:', error);
      return res.status(500).json({
        error: 'Database update failed',
        message: error.message
      });
    }

    console.log(`✅ Updated program ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}

async function deleteProgram(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Program ID is required' });
    }

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({
        error: 'Database not configured'
      });
    }

    const { error } = await (dbClient
      .from('content') as any)
      .delete()
      .eq('id', id)
      .eq('type', 'program');

    if (error) {
      console.error('❌ Delete failed:', error);
      return res.status(500).json({
        error: 'Failed to delete program',
        message: error.message
      });
    }

    console.log(`✅ Deleted program ${id} using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
    res.status(200).json({ success: true, message: 'Program deleted successfully' });
  } catch (error: any) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
}