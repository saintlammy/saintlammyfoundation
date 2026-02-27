import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Get user details from users table
    const { data: userData, error: userError } = await (supabaseAdmin as any)
      .from('users')
      .select(`
        *,
        volunteers (
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
        )
      `)
      .eq('auth_user_id', authUser.id)
      .single();

    if (userError) {
      // User might not exist in users table yet
      // Return basic auth user info
      return res.status(200).json({
        user: {
          id: authUser.id,
          email: authUser.email,
          role: 'user',
          status: 'active'
        }
      });
    }

    return res.status(200).json({
      user: userData
    });
  } catch (error) {
    console.error('Auth me API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
