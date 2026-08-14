import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Authorization, Cookie');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Database connection not available' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Keep a same-site, HTTP-only copy of the verified session so legacy admin
    // screens can call protected APIs without exposing tokens in page code.
    res.setHeader(
      'Set-Cookie',
      `slf_admin_session=${encodeURIComponent(token)}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=3600${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );

    // Get user details from users table
    const { data: userData, error: userError } = await (supabaseAdmin as any)
      .from('users')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .maybeSingle();

    if (userError) {
      console.error('Unable to load trusted user profile:', userError);
      return res.status(500).json({ error: 'Unable to load user profile' });
    }

    if (!userData) {
      return res.status(200).json({
        user: {
          id: authUser.id,
          email: authUser.email,
          role: 'user',
          status: 'active'
        }
      });
    }

    const { data: volunteers, error: volunteerError } = await (supabaseAdmin as any)
      .from('volunteers')
      .select(`
        id,
        status,
        interests,
        skills,
        availability,
        role_id,
        volunteer_roles (
          id,
          title,
          category
        )
      `)
      .eq('user_id', userData.id);

    if (volunteerError) {
      console.warn('Unable to load optional volunteer profile:', volunteerError);
    }

    return res.status(200).json({
      user: {
        ...userData,
        volunteers: volunteers || []
      }
    });
  } catch (error) {
    console.error('Auth me API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
