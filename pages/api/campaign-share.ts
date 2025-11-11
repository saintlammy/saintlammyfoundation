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

interface ShareEventLog {
  campaign_id: string;
  share_platform: string;
  utm_source: string;
  utm_medium: string;
  shared_at: string;
  ip_address?: string;
  user_agent?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { campaignId, platform, utmSource, utmMedium } = req.body;

    if (!campaignId || !platform) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'campaignId and platform are required'
      });
    }

    const shareEvent: ShareEventLog = {
      campaign_id: campaignId,
      share_platform: platform,
      utm_source: utmSource || platform,
      utm_medium: utmMedium || 'social',
      shared_at: new Date().toISOString(),
      ip_address: (req.headers['x-forwarded-for'] as string) ||
                  (req.headers['x-real-ip'] as string) ||
                  req.socket.remoteAddress,
      user_agent: req.headers['user-agent']
    };

    if (!supabase) {
      // Log to console when database unavailable
      console.log('Share event (DB unavailable):', shareEvent);
      return res.status(200).json({
        success: true,
        message: 'Share event logged locally',
        logged: true
      });
    }

    // Log share event to database
    const { data: logData, error: logError } = await supabase
      .from('campaign_share_logs')
      .insert([shareEvent]);

    if (logError) {
      console.error('Error logging share event:', logError);
      // Don't fail the request if logging fails
      console.log('Share event (log failed):', shareEvent);
    }

    // Update campaign share count
    const { data: campaign, error: fetchError } = await supabase
      .from('campaigns')
      .select('id, share_count')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Error fetching campaign:', fetchError);
      return res.status(200).json({
        success: true,
        message: 'Share logged but count not updated'
      });
    }

    const currentCount = campaign?.share_count || 0;
    const { error: updateError } = await supabase
      .from('campaigns')
      .update({ share_count: currentCount + 1 })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating share count:', updateError);
      return res.status(200).json({
        success: true,
        message: 'Share logged but count not updated'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Share event tracked successfully',
      shareCount: currentCount + 1
    });

  } catch (error) {
    console.error('Campaign share tracking error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to track share event'
    });
  }
}
