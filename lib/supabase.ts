import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check if we have valid Supabase configuration
const isValidSupabaseConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  (supabaseUrl.startsWith('https://') || supabaseUrl.startsWith('http://'));

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
  } catch (error) {
    console.warn('Failed to create Supabase client:', error);
    supabaseClient = null;
  }
}

export const supabase = supabaseClient;

// Flag to check if Supabase is available
export const isSupabaseAvailable = !!supabase;

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
    throw new Error('Supabase client is not available');
  }
  return supabase as ReturnType<typeof createClient<Database>>;
}