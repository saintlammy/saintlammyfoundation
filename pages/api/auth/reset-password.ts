import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Only allow admin emails for password reset
    const isValidAdminEmail = email.includes('@saintlammyfoundation.org') ||
                             email === 'saintlammyfoundation@gmail.com' ||
                             email === 'saintlammy@gmail.com';

    if (!isValidAdminEmail) {
      return res.status(403).json({ error: 'Password reset is only available for admin accounts' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Authentication service not available' });
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.origin || 'http://localhost:3000'}/admin/reset-password`
    });

    if (error) {
      console.error('Password reset error:', error);

      // Handle specific error cases
      if (error.message.includes('fetch failed') || error.message.includes('network')) {
        return res.status(500).json({ error: 'Network error. Please try again later.' });
      }

      if (error.message.includes('rate limit')) {
        return res.status(429).json({ error: 'Too many reset attempts. Please try again later.' });
      }

      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Password reset API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}