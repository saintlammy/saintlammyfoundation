import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin, isSupabaseAdminAvailable } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const status: any = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
      },
      clients: {
        regularClientAvailable: !!supabase,
        adminClientAvailable: isSupabaseAdminAvailable,
        usingAdminClient: !!supabaseAdmin
      }
    };

    // Test admin client insert
    if (supabaseAdmin) {
      try {
        const testOutreach = {
          id: `test-${Date.now()}`,
          title: 'Test Outreach (will be deleted)',
          excerpt: 'Test',
          content: 'Test',
          featured_image: '',
          outreach_details: {
            location: 'Test',
            event_date: new Date().toISOString(),
            beneficiaries_count: 0
          },
          status: 'draft',
          slug: `test-${Date.now()}`,
          type: 'outreach',
          publish_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await (supabaseAdmin
          .from('content') as any)
          .insert([testOutreach] as any);

        if (insertError) {
          status.adminInsertTest = {
            success: false,
            error: insertError.message,
            code: insertError.code,
            details: insertError
          };
        } else {
          // Delete the test record
          await (supabaseAdmin
            .from('content') as any)
            .delete()
            .eq('id', testOutreach.id);

          status.adminInsertTest = {
            success: true,
            message: 'Admin client can insert successfully'
          };
        }
      } catch (testError: any) {
        status.adminInsertTest = {
          success: false,
          error: testError.message || 'Unknown error',
          stack: testError.stack
        };
      }
    } else {
      status.adminInsertTest = {
        success: false,
        error: 'Admin client not available'
      };
    }

    return res.status(200).json(status);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      stack: error.stack
    });
  }
}
