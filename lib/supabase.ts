import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if we have valid Supabase configuration
const isValidSupabaseConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://'));

// Additional check for development mode
const isDevelopmentMode = process.env.NODE_ENV === 'development';
const shouldWarnAboutSupabase = isDevelopmentMode && !isValidSupabaseConfig;

// Create client only if we have valid configuration
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

if (isValidSupabaseConfig) {
  try {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    // Log Supabase configuration status
    if (isDevelopmentMode) {
      console.log('✅ Supabase client created successfully');
      console.log(`🔗 Supabase URL: ${supabaseUrl}`);
    }
  } catch (error) {
    console.warn('❌ Failed to create Supabase client:', error);
    supabaseClient = null;
  }
} else {
  if (shouldWarnAboutSupabase) {
    console.warn('⚠️  Supabase not configured properly. Using fallback mode.');
    console.warn('📝 Check your .env.local file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

export const supabase = supabaseClient;

// Flag to check if Supabase is available
export const isSupabaseAvailable = !!supabase;

// Create admin client with service role key for server-side operations
// This bypasses RLS policies and should only be used in API routes
let supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null;

if (supabaseServiceRoleKey && supabaseUrl) {
  try {
    supabaseAdminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    if (isDevelopmentMode) {
      console.log('✅ Supabase admin client created with service role key');
    }
  } catch (error) {
    console.warn('❌ Failed to create Supabase admin client:', error);
    supabaseAdminClient = null;
  }
}

// Export admin client for server-side use only (API routes)
// This client bypasses RLS and has full database access
export const supabaseAdmin = supabaseAdminClient;
export const isSupabaseAdminAvailable = !!supabaseAdmin;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Helper function for type-safe queries
export const createTypedSupabaseClient = () => supabase;

// Type guard to ensure supabase client is properly typed
export function getTypedSupabaseClient(): ReturnType<typeof createClient<Database>> {
  if (!supabase) {
    throw new Error('Supabase client is not available. Check your environment configuration.');
  }
  return supabase as ReturnType<typeof createClient<Database>>;
}

// Check if we can connect to Supabase (for testing purposes)
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    if (!isSupabaseAvailable || !supabase) {
      return {
        success: false,
        error: 'Supabase client not available',
        details: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          isValidConfig: isValidSupabaseConfig,
        }
      };
    }

    // Test basic connection with a simple query
    const { error } = await supabase
      .from('donations')
      .select('id')
      .limit(1);

    if (error) {
      return {
        success: false,
        error: 'Database query failed',
        details: error
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

// Get connection status for diagnostic purposes
export function getSupabaseStatus() {
  return {
    isAvailable: isSupabaseAvailable,
    hasValidConfig: isValidSupabaseConfig,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    environment: process.env.NODE_ENV,
  };
}