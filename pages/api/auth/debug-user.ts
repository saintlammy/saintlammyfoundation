import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function debugUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'No authorization header',
        message: 'Please provide Bearer token from browser localStorage'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not available' });
    }

    // Get user from token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({ error: 'Invalid token', details: error.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    // Check admin status
    const isAdmin = Boolean(
      user.email?.includes('@saintlammyfoundation.org') ||
      user.user_metadata?.role === 'admin' ||
      user.email === 'admin@saintlammyfoundation.org' ||
      user.email === 'saintlammyfoundation@gmail.com' ||
      user.email === 'saintlammy@gmail.com'
    );

    const debugInfo = {
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata
      },
      adminChecks: {
        email: user.email,
        hasSaintlammyFoundationDomain: user.email?.includes('@saintlammyfoundation.org'),
        isSaintlammyGmail: user.email === 'saintlammy@gmail.com',
        roleMetadata: user.user_metadata?.role,
        isRoleAdmin: user.user_metadata?.role === 'admin',
        finalAdminStatus: isAdmin
      },
      permissions: user.user_metadata?.permissions || [],
      organization: user.user_metadata?.organization
    };

    return res.status(200).json({
      success: true,
      debug: debugInfo,
      message: isAdmin ? 'User should have admin access' : 'User does NOT have admin access'
    });

  } catch (error) {
    console.error('Debug user error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}