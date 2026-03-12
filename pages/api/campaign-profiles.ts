import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: ReturnType<typeof createClient> | null = null;

try {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export interface CampaignProfile {
  id: string;
  campaign_id: string;
  profile_code: string;
  title: string;
  descriptor: string;
  story_snippet: string;
  story_full: string;
  how_your_gift_helps: string;
  tags: string[];
  image_url?: string;
  video_url?: string;
  status: 'active' | 'inactive' | 'archived' | 'draft';
  is_featured: boolean;
  sort_order: number;
  funding_goal?: number;
  current_funding: number;
  sponsor_count: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Mock data for fallback when database is unavailable
function getMockProfiles(campaignId?: string): CampaignProfile[] {
  const mockCampaignId = '550e8400-e29b-41d4-a716-446655440000';

  const profiles: CampaignProfile[] = [
    {
      id: '1',
      campaign_id: mockCampaignId,
      profile_code: 'VH-001',
      title: 'Serah — Carrying Two Futures Alone',
      descriptor: 'Single mother of two children',
      story_snippet:
        'Serah is a 32-year-old single mother raising two children—Oba (7) and Eniola (12). When her husband left shortly after the children were born, the responsibility for everything fell on her shoulders.',
      story_full:
        'Serah is a 32-year-old single mother raising two children—Oba (7) and Eniola (12). When her husband left shortly after the children were born, the responsibility for everything fell on her shoulders. She works hard to keep food on the table and a roof over their heads, but even small setbacks can tip the home into crisis. Still, Serah holds onto one prayer: that her children will stay in school and have a better future than the struggle she\'s living through.',
      how_your_gift_helps: 'Food + hygiene pack and targeted school support for the children.',
      tags: ['Food Support', 'Hygiene', 'Education'],
      status: 'active',
      is_featured: true,
      sort_order: 1,
      current_funding: 0,
      sponsor_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      campaign_id: mockCampaignId,
      profile_code: 'VH-002',
      title: 'Mr. Alagbe — A Salary Swallowed by Sacrifice',
      descriptor: 'Older father, debt + health burden',
      story_snippet:
        'Mr. Alagbe is 63 and works as a local security officer. He took a loan to send his three sons to university, believing education was the best inheritance he could give.',
      story_full:
        'Mr. Alagbe is 63 and works as a local security officer. He took a loan to send his three sons to university, believing education was the best inheritance he could give. Soon after, he lost his job and the loan grew with interest. Even after finding work again, most of his monthly salary goes into repayments, leaving little for daily living. He also battles serious health challenges, yet he keeps showing up—because his sons\' education matters to him more than his comfort.',
      how_your_gift_helps:
        'Food + hygiene essentials to relieve pressure while he manages repayments and health.',
      tags: ['Food Support', 'Hygiene', 'Family Relief'],
      status: 'active',
      is_featured: true,
      sort_order: 2,
      current_funding: 0,
      sponsor_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      campaign_id: mockCampaignId,
      profile_code: 'VH-003',
      title: 'Olusegun — Starting Over with Special Care Needs',
      descriptor: 'Family of six, disability care',
      story_snippet:
        'Olusegun is a father of four whose life changed drastically after he was deported from Canada. Since returning, stable work has been difficult to secure.',
      story_full:
        'Olusegun is a father of four whose life changed drastically after he was deported from Canada. Since returning, stable work has been difficult to secure. His wife now carries the daily responsibility of providing food for the family. To make things harder, their youngest daughter lives with a disability and needs special care—adding pressure to already limited resources. Yet this family is still standing, still trying, still hoping for stability.',
      how_your_gift_helps: 'Food support plus capped stability casework to help the family rebuild.',
      tags: ['Food Support', 'Stability', 'Caregiving'],
      status: 'active',
      is_featured: true,
      sort_order: 3,
      current_funding: 0,
      sponsor_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      campaign_id: mockCampaignId,
      profile_code: 'VH-004',
      title: 'Monsuru — Five Daughters, One Unsteady Income',
      descriptor: 'Father of five, informal work',
      story_snippet:
        'Monsuru is a father of five girls. After losing his job due to a workplace relocation issue, he turned to bricklaying to support his family—hard work, but not steady income.',
      story_full:
        'Monsuru is a father of five girls. After losing his job due to a workplace relocation issue, he turned to bricklaying to support his family—hard work, but not steady income. His wife also hawks drinks just to keep the home running. Even with the uncertainty, both parents keep fighting for their daughters\' future, determined that hardship won\'t be the final word over their family.',
      how_your_gift_helps: 'Food + hygiene packs and education support to keep the girls in school.',
      tags: ['Food Support', 'Hygiene', 'Education'],
      status: 'active',
      is_featured: true,
      sort_order: 4,
      current_funding: 0,
      sponsor_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  if (campaignId) {
    return profiles.filter(p => p.campaign_id === campaignId);
  }
  return profiles;
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
  const { id, campaign_id, status, featured, tags, limit } = req.query;

  try {
    if (!supabase) {
      console.warn('⚠️ Database unavailable - using mock data');
      let profiles = getMockProfiles(campaign_id as string);

      if (id) {
        profiles = profiles.filter(p => p.id === id);
      }
      if (status) {
        profiles = profiles.filter(p => p.status === status);
      }
      if (featured === 'true') {
        profiles = profiles.filter(p => p.is_featured);
      }

      return res.status(200).json({ success: true, data: profiles });
    }

    let query = supabase.from('campaign_profiles').select('*');

    if (id) {
      const { data, error } = await (supabase
        .from('campaign_profiles') as any)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase query error:', error);
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.status(200).json({ success: true, data });
    }

    if (campaign_id) {
      query = query.eq('campaign_id', campaign_id);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query = query.contains('tags', tagArray);
    }

    query = query.order('sort_order', { ascending: true });

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      // Fallback to mock data on error
      const mockData = getMockProfiles(campaign_id as string);
      return res.status(200).json({ success: true, data: mockData });
    }

    return res.status(200).json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching campaign profiles:', error);
    // Fallback to mock data
    return res.status(200).json({ success: true, data: getMockProfiles() });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const profileData = req.body;

  if (!profileData.campaign_id || !profileData.title || !profileData.profile_code) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['campaign_id', 'title', 'profile_code']
    });
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Profile creation requires database connection'
    });
  }

  try {
    const newProfile = {
      campaign_id: profileData.campaign_id,
      profile_code: profileData.profile_code,
      title: profileData.title,
      descriptor: profileData.descriptor || '',
      story_snippet: profileData.story_snippet || '',
      story_full: profileData.story_full || '',
      how_your_gift_helps: profileData.how_your_gift_helps || '',
      tags: profileData.tags || [],
      image_url: profileData.image_url || '',
      video_url: profileData.video_url || '',
      status: profileData.status || 'draft',
      is_featured: profileData.is_featured !== undefined ? profileData.is_featured : false,
      sort_order: profileData.sort_order || 0,
      funding_goal: profileData.funding_goal || null,
      current_funding: profileData.current_funding || 0,
      sponsor_count: profileData.sponsor_count || 0,
      metadata: profileData.metadata || {}
    };

    const { data, error } = await (supabase
      .from('campaign_profiles') as any)
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✅ Created campaign profile: ${data.profile_code}`);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating campaign profile:', error);
    return res.status(500).json({ error: 'Failed to create profile' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Profile ID required' });
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Profile update requires database connection'
    });
  }

  try {
    const { data, error } = await (supabase
      .from('campaign_profiles') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log(`✅ Updated campaign profile: ${data.profile_code}`);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating campaign profile:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Profile ID required' });
  }

  if (!supabase) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Profile deletion requires database connection'
    });
  }

  try {
    const { error } = await (supabase
      .from('campaign_profiles') as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting profile:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✅ Deleted campaign profile: ${id}`);
    return res.status(200).json({ success: true, message: 'Profile deleted' });
  } catch (error) {
    console.error('Error deleting campaign profile:', error);
    return res.status(500).json({ error: 'Failed to delete profile' });
  }
}
