import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

interface CookieConsentLog {
  sessionId: string;
  consentAction: 'accept_all' | 'reject_all' | 'customize';
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  consentVersion?: string;
  pageUrl?: string;
  referrer?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      sessionId,
      consentAction,
      necessary,
      analytics,
      marketing,
      preferences,
      consentVersion = '1.0',
      pageUrl,
      referrer,
    }: CookieConsentLog = req.body;

    // Validation
    if (!sessionId || !consentAction) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, consentAction',
      });
    }

    if (!['accept_all', 'reject_all', 'customize'].includes(consentAction)) {
      return res.status(400).json({
        error: 'Invalid consentAction. Must be: accept_all, reject_all, or customize',
      });
    }

    // Get client metadata
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || null;

    // Log to database
    const { data, error } = await supabase
      .from('cookie_consent_logs')
      .insert([
        {
          session_id: sessionId,
          ip_address: ipAddress,
          user_agent: userAgent,
          consent_action: consentAction,
          necessary: necessary !== undefined ? necessary : true,
          analytics: analytics || false,
          marketing: marketing || false,
          preferences: preferences || false,
          consent_version: consentVersion,
          page_url: pageUrl,
          referrer: referrer,
          consent_date: new Date().toISOString(),
        },
      ] as any)
      .select()
      .single();

    if (error) {
      console.error('Error logging cookie consent:', error);

      // Don't fail the request even if logging fails
      // This ensures user experience isn't affected
      return res.status(200).json({
        success: true,
        message: 'Consent recorded locally',
        logged: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cookie consent logged successfully',
      logged: true,
      id: (data as any).id,
    });
  } catch (error) {
    console.error('Cookie consent API error:', error);

    // Return success even on error to not block user
    return res.status(200).json({
      success: true,
      message: 'Consent recorded locally',
      logged: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Get client IP address from request
 */
function getClientIp(req: NextApiRequest): string | null {
  // Check various headers for IP address
  const forwarded = req.headers['x-forwarded-for'];
  const real = req.headers['x-real-ip'];
  const cloudflare = req.headers['cf-connecting-ip'];

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }

  if (typeof real === 'string') {
    return real;
  }

  if (typeof cloudflare === 'string') {
    return cloudflare;
  }

  // Fallback to socket address
  return req.socket.remoteAddress || null;
}
