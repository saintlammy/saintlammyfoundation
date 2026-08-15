import type { NextApiRequest, NextApiResponse } from 'next';
import { testSupabaseConnection, getSupabaseStatus } from '@/lib/supabase';
import { withAdminAuth } from '@/lib/serverAuth';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current status
    const status = getSupabaseStatus();

    // Test connection
    const connectionTest = await testSupabaseConnection();

    if (connectionTest.success) {
      return res.status(200).json({
        success: true,
        message: 'Supabase connection successful',
        status,
        connectionTest
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        status,
        connectionTest
      });
    }

  } catch (error) {
    console.error('Supabase test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : String(error),
      status: getSupabaseStatus()
    });
  }
}

export default withAdminAuth(handler);
