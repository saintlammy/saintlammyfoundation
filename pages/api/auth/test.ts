import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { withAuth } from '@/lib/authMiddleware';

// Test endpoint to verify authentication system integration
async function testAuthHandler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  switch (method) {
    case 'GET':
      return handleAuthTest(req, res);
    case 'POST':
      return handleSupabaseTest(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleAuthTest(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test basic auth middleware functionality
    const testResults = {
      timestamp: new Date().toISOString(),
      supabaseAvailable: !!supabase,
      environmentChecks: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        configuredCorrectly:
          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url' &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key'
      },
      authMiddleware: {
        requestProcessed: true,
        userAttached: !!(req as any).user,
        adminStatus: !!(req as any).isAdmin,
        moderatorStatus: !!(req as any).isModerator,
        hasPermissionFunction: typeof (req as any).hasPermission === 'function'
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Authentication system test completed',
      data: testResults
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleSupabaseTest(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: 'Supabase client not available',
        message: 'Check environment configuration'
      });
    }

    // Test Supabase connection
    const { data, error } = await supabase
      .from('donations')
      .select('count(*)')
      .limit(1);

    const supabaseTests = {
      timestamp: new Date().toISOString(),
      connection: {
        available: true,
        canQuery: !error,
        error: error?.message || null
      },
      auth: {
        configured: true,
        // Test auth without actual user (just check methods exist)
        methodsAvailable: {
          signIn: typeof supabase.auth.signInWithPassword === 'function',
          signUp: typeof supabase.auth.signUp === 'function',
          signOut: typeof supabase.auth.signOut === 'function',
          getUser: typeof supabase.auth.getUser === 'function',
          resetPassword: typeof supabase.auth.resetPasswordForEmail === 'function'
        }
      }
    };

    return res.status(200).json({
      success: true,
      message: 'Supabase integration test completed',
      data: supabaseTests
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return res.status(500).json({
      success: false,
      error: 'Supabase test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Export with auth middleware that requires admin access
export default withAuth(testAuthHandler, {
  requireAuth: true,
  requireAdmin: true
});

// Also export a version without auth for initial testing
export { testAuthHandler as testAuthHandlerPublic };