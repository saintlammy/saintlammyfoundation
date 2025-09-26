import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, accessToken } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and number' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Authentication service not available' });
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('Password update error:', error);

      // Handle specific error cases
      if (error.message.includes('fetch failed') || error.message.includes('network')) {
        return res.status(500).json({ error: 'Network error. Please try again later.' });
      }

      if (error.message.includes('invalid token') || error.message.includes('expired')) {
        return res.status(401).json({ error: 'Reset link has expired. Please request a new one.' });
      }

      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}