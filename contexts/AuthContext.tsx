import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

// Enhanced interfaces for better type safety
interface UserMetadata {
  name?: string;
  role?: 'admin' | 'moderator' | 'user';
  phone?: string;
  organization?: string;
  permissions?: string[];
}

interface AuthUser extends User {
  user_metadata: UserMetadata;
}

interface SignUpData {
  name?: string;
  role?: string;
  phone?: string;
  organization?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  hasPermission: (permission: string) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; data?: any }>;
  signUp: (email: string, password: string, userData?: SignUpData) => Promise<{ error: AuthError | null; data?: any }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserMetadata>) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Enhanced role-based authentication logic
  const isAdmin = Boolean(
    user?.email?.includes('@saintlammyfoundation.org') ||
    user?.user_metadata?.role === 'admin' ||
    user?.email === 'admin@saintlammyfoundation.org' ||
    user?.email === 'saintlammyfoundation@gmail.com' ||
    user?.email === 'saintlammy@gmail.com'
  );

  const isModerator = Boolean(
    isAdmin ||
    user?.user_metadata?.role === 'moderator'
  );

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (isAdmin) return true; // Admin has all permissions

    const userPermissions = user.user_metadata?.permissions || [];
    return userPermissions.includes(permission);
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user as AuthUser ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user as AuthUser ?? null);
        setLoading(false);

        // Handle auth events
        if (event === 'SIGNED_OUT') {
          router.push('/admin/login');
        } else if (event === 'SIGNED_IN') {
          // Redirect to admin dashboard if signing in and on login page
          if (router.pathname === '/admin/login') {
            router.push('/admin');
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [router]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') as AuthError };
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: new Error('Please enter a valid email address') as AuthError };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, userData?: SignUpData) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') as AuthError };
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: new Error('Please enter a valid email address') as AuthError };
      }

      // Validate password strength
      if (password.length < 8) {
        return { error: new Error('Password must be at least 8 characters long') as AuthError };
      }

      // Only allow admin emails for registration
      const isValidAdminEmail = email.includes('@saintlammyfoundation.org') ||
                               email === 'saintlammyfoundation@gmail.com' ||
                               email === 'saintlammy@gmail.com';

      if (!isValidAdminEmail) {
        return { error: new Error('Registration is restricted to authorized email domains') as AuthError };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: userData?.name || '',
            role: userData?.role || 'admin',
            phone: userData?.phone || '',
            organization: userData?.organization || 'Saintlammy Foundation',
            permissions: ['read', 'write', 'admin']
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not available') as AuthError };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      // Clear local state
      setUser(null);
      setSession(null);

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') as AuthError };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<UserMetadata>) => {
    if (!supabase) {
      return { error: new Error('Supabase not available') as AuthError };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        console.error('Update profile error:', error);
        return { error };
      }

      // Update local user state
      if (user && data.user) {
        setUser(data.user as AuthUser);
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as AuthError };
    }
  };

  const refreshSession = async () => {
    if (!supabase) return;

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Refresh session error:', error);
      } else {
        setSession(session);
        setUser(session?.user as AuthUser ?? null);
      }
    } catch (error) {
      console.error('Refresh session error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    isModerator,
    hasPermission,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;