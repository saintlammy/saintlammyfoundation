import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: ReturnType<typeof createClient> | null = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  deadline: string;
  status: 'active' | 'completed' | 'archived' | 'draft';
  is_featured: boolean;
  impact_details: Record<string, string>;
  image_url?: string;
  category?: string;
  share_count?: number;
  beneficiary_count?: number;
  stat_label?: string;
  urgency_message?: string;
  created_at: string;
  updated_at: string;
}

// Mock campaigns data for fallback (using USD for international donors)
function getMockCampaigns(): Campaign[] {
  return [
    {
      id: '1',
      title: 'Feed 100 Widows Before Christmas',
      description: 'Every day without your support means another hungry mother struggling to feed her children. Help us provide essential food supplies to 100 widows before Christmas.',
      goal_amount: 1795.00,
      current_amount: 808.00,
      currency: 'USD',
      deadline: '2025-12-20T23:59:59Z',
      status: 'active',
      is_featured: true,
      impact_details: {
        '5': 'Feeds one widow for 2 weeks',
        '25': 'Supports a widow\'s family for a month',
        '100': 'Provides essential food package for 4 widows'
      },
      category: 'widows',
      share_count: 0,
      beneficiary_count: 70,
      stat_label: 'Orphans Need',
      urgency_message: 'Time is running out',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Emergency Medical Fund for Children',
      description: 'Urgent medical care needed for vulnerable children in our care. Your donation provides life-saving treatment.',
      goal_amount: 717.00,
      current_amount: 251.00,
      currency: 'USD',
      deadline: '2025-11-30T23:59:59Z',
      status: 'active',
      is_featured: false,
      impact_details: {
        '10': 'Basic medical consultation',
        '50': 'Emergency treatment and medication',
        '100': 'Full medical care package'
      },
      category: 'medical',
      share_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id, status, featured } = req.query;

  try {
    if (!supabase) {
      // Fallback to mock data
      let campaigns = getMockCampaigns();

      if (id) {
        campaigns = campaigns.filter(c => c.id === id);
      }
      if (status) {
        campaigns = campaigns.filter(c => c.status === status);
      }
      if (featured === 'true') {
        campaigns = campaigns.filter(c => c.is_featured);
      }

      return res.status(200).json({ success: true, data: campaigns });
    }

    let query = supabase.from('campaigns').select('*');

    if (id) {
      query = query.eq('id', id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      // Fallback to mock data on error
      let campaigns = getMockCampaigns();
      if (status) {
        campaigns = campaigns.filter(c => c.status === status);
      }
      if (featured === 'true') {
        campaigns = campaigns.filter(c => c.is_featured);
      }
      return res.status(200).json({ success: true, data: campaigns });
    }

    return res.status(200).json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    // Fallback to mock data
    return res.status(200).json({ success: true, data: getMockCampaigns() });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const campaignData = req.body;

  if (!supabase) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Campaign creation requires database connection'
    });
  }

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData] as any)
      .select();

    if (error) {
      console.error('Error creating campaign:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({ error: 'Failed to create campaign' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Campaign ID required' });
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Campaign update requires database connection'
    });
  }

  try {
    const { data, error } = await (supabase
      .from('campaigns') as any)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating campaign:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    return res.status(200).json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return res.status(500).json({ error: 'Failed to update campaign' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Campaign ID required' });
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Campaign deletion requires database connection'
    });
  }

  try {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting campaign:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return res.status(500).json({ error: 'Failed to delete campaign' });
  }
}
