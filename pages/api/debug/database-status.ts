import { NextApiRequest, NextApiResponse } from 'next';
import { getTypedSupabaseClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getTypedSupabaseClient();

    const status: any = {
      supabaseConfigured: !!client,
      timestamp: new Date().toISOString(),
      tables: {}
    };

    if (!client) {
      return res.status(200).json({
        ...status,
        error: 'Supabase client not configured. Check environment variables.'
      });
    }

    // Test outreach_reports table
    try {
      const { data, error } = await (client
        .from('outreach_reports') as any)
        .select('count')
        .limit(1);

      if (error) {
        status.tables.outreach_reports = {
          exists: false,
          error: error.message,
          errorCode: error.code,
          hint: error.code === '42P01'
            ? 'Table does not exist. Run the schema setup SQL in Supabase.'
            : 'Database query failed'
        };
      } else {
        status.tables.outreach_reports = {
          exists: true,
          accessible: true
        };

        // Get row count
        const { count } = await (client
          .from('outreach_reports') as any)
          .select('*', { count: 'exact', head: true });

        status.tables.outreach_reports.rowCount = count;
      }
    } catch (err: any) {
      status.tables.outreach_reports = {
        exists: false,
        error: err.message,
        type: 'exception'
      };
    }

    // Test content table (for outreaches)
    try {
      const { data, error } = await (client
        .from('content') as any)
        .select('count')
        .eq('type', 'outreach')
        .limit(1);

      if (error) {
        status.tables.content = {
          exists: false,
          error: error.message,
          errorCode: error.code
        };
      } else {
        status.tables.content = {
          exists: true,
          accessible: true
        };

        // Get outreach count
        const { count } = await (client
          .from('content') as any)
          .select('*', { count: 'exact', head: true })
          .eq('type', 'outreach');

        status.tables.content.outreachCount = count;
      }
    } catch (err: any) {
      status.tables.content = {
        exists: false,
        error: err.message,
        type: 'exception'
      };
    }

    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to check database status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
