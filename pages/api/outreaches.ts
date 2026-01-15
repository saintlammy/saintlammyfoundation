import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getOutreaches(req, res);
    case 'POST':
      return await createOutreach(req, res);
    case 'PUT':
      return await updateOutreach(req, res);
    case 'DELETE':
      return await deleteOutreach(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getOutreaches(req: NextApiRequest, res: NextApiResponse) {
  const { status = 'published', limit } = req.query;

  try {
    if (!supabase) {
      console.error('⚠️ Supabase not configured - returning empty array');
      return res.status(200).json([]);
    }

    let query = (supabase
      .from('content') as any)
      .select('*')
      .eq('type', 'outreach')
      .order('publish_date', { ascending: false});

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
      return res.status(500).json({ error: 'Failed to fetch outreaches', details: error.message });
    }

    // Return empty array if no data (DO NOT return mock data)
    if (!data || data.length === 0) {
      console.log('📭 No outreaches found in database');
      return res.status(200).json([]);
    }

    // Transform data to match component interface
    const transformedData = (data as any).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || item.content,
      image: item.featured_image,
      location: item.outreach_details?.location || 'Nigeria',
      date: item.outreach_details?.event_date || item.publish_date,
      beneficiaries: item.outreach_details?.beneficiaries_count || 0,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    console.log(`✅ Loaded ${transformedData.length} outreach(es) from DATABASE`);
    res.status(200).json(transformedData);
  } catch (error) {
    console.error('❌ API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createOutreach(req: NextApiRequest, res: NextApiResponse) {
  try {
    const outreachData = req.body;

    if (!outreachData.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const slug = outreachData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newOutreach = {
      id: outreachData.id || `outreach-${Date.now()}`,
      title: outreachData.title,
      excerpt: outreachData.description || '',
      content: outreachData.description || '',
      featured_image: outreachData.image || '',
      outreach_details: {
        location: outreachData.location || 'Nigeria',
        event_date: outreachData.date || new Date().toISOString(),
        beneficiaries_count: outreachData.beneficiaries || 0
      },
      status: outreachData.status || 'upcoming',
      slug,
      type: 'outreach',
      publish_date: outreachData.date || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let savedToDatabase = false;

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    // Try database save FIRST if available
    if (dbClient) {
      try {
        const { error } = await (dbClient
          .from('content') as any)
          .insert([newOutreach] as any);

        if (error) {
          console.error('Database insert failed:', error);
          throw error;
        }

        savedToDatabase = true;
        console.log(`✅ Created outreach ${newOutreach.id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);
      } catch (dbError) {
        console.error('Database save failed:', dbError);
      }
    }

    // If database save failed, return error (NO MORE MOCK STORAGE)
    if (!savedToDatabase) {
      return res.status(500).json({
        error: 'Database save failed',
        message: 'Could not save outreach to database. Please check database configuration.'
      });
    }

    return res.status(201).json({
      success: true,
      message: savedToDatabase
        ? 'Outreach created in database successfully'
        : 'Outreach created temporarily (database not available)',
      data: newOutreach,
      persistent: savedToDatabase
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateOutreach(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Outreach ID is required' });
    }

    // Transform data to match content table structure
    const dbUpdateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updateData.title) {
      dbUpdateData.title = updateData.title;
      dbUpdateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    if (updateData.description) {
      dbUpdateData.excerpt = updateData.description;
      dbUpdateData.content = updateData.description;
    }

    if (updateData.image) {
      dbUpdateData.featured_image = updateData.image;
    }

    if (updateData.status) {
      dbUpdateData.status = updateData.status;
    }

    if (updateData.date) {
      dbUpdateData.publish_date = updateData.date;
    }

    // Update outreach_details JSONB field
    if (updateData.location || updateData.beneficiaries || updateData.date) {
      dbUpdateData.outreach_details = {
        location: updateData.location,
        event_date: updateData.date,
        beneficiaries_count: updateData.beneficiaries
      };
    }

    let savedToDatabase = false;

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (dbClient) {
      try {
        const { data, error } = await (dbClient
          .from('content') as any)
          .update(dbUpdateData)
          .eq('id', id)
          .eq('type', 'outreach')
          .select()
          .single();

        if (error) {
          console.error('Database update failed:', error);
          throw error;
        }

        savedToDatabase = true;
        console.log(`✅ Updated outreach ${id} in DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);

        return res.status(200).json({
          ...data,
          persistent: true
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        console.log('⚠️ Update not persisted (database error)');
      }
    }

    return res.status(200).json({
      id,
      ...updateData,
      message: 'Outreach updated temporarily (database not available)',
      persistent: false
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteOutreach(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Outreach ID is required' });
    }

    // Use admin client if available (bypasses RLS), otherwise try regular client
    const dbClient = supabaseAdmin || supabase;

    if (!dbClient) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    // Delete from database
    const { error } = await (dbClient
      .from('content') as any)
      .delete()
      .eq('id', id)
      .eq('type', 'outreach');

    if (error) {
      console.error('Delete failed:', error);
      return res.status(500).json({ error: 'Failed to delete outreach', details: error.message });
    }

    console.log(`✅ Deleted outreach ${id} from DATABASE using ${supabaseAdmin ? 'ADMIN' : 'ANON'} client`);

    return res.status(200).json({
      success: true,
      message: 'Outreach deleted successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}