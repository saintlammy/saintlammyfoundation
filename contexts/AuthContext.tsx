import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

// Enhanced interfaces for better type safety
interface UserMetadata {
  name?: string;
  /** Display-only legacy metadata. Never use for authorization. */
  role?: 'admin' | 'moderator' | 'user';
  phone?: string;
  organization?: string;
  /** Display-only legacy metadata. Never use for authorization. */
  permissions?: string[];
}

interface AuthUser extends User {
  user_metadata: UserMetadata;
}

type EditableUserMetadata = Pick<UserMetadata, 'name' | 'phone' | 'organization'>;

interface SignUpData {
  name?: string;
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
  updateProfile: (updates: Partial<EditableUserMetadata>) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

async function getTrustedRole(session: Session | null): Promise<string | null> {
  if (!session) return null;

  const appRole = session.user.app_metadata?.role;

  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    if (response.ok) {
      const payload = await response.json();
      if (typeof payload?.user?.role === 'string') {
        return payload.user.role;
      }
    }
  } catch (error) {
    console.warn('Unable to refresh trusted authorization role:', error);
  }

  return typeof appRole === 'string' ? appRole : null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [trustedRole, setTrustedRole] = useState<string | null>(null);
  const roleRequestIdRef = useRef(0);
  const router = useRouter();

  // Auto refresh session before expiry
  useEffect(() => {
    if (!session || !supabase) return;

    const refreshTimer = setInterval(async () => {
      const now = new Date().getTime();
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const timeUntilExpiry = expiresAt - now;

      // Refresh 5 minutes before expiry
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        console.log('Auto-refreshing session before expiry');
        await refreshSession();
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(refreshTimer);
  }, [session]);

  // Enhanced role-based authentication logic
  const trustedPermissions = Array.isArray(user?.app_metadata?.permissions)
    ? user.app_metadata.permissions.filter((permission): permission is string => typeof permission === 'string')
    : [];

  const isAdmin = trustedRole === 'admin' || trustedRole === 'super_admin';

  const isModerator = Boolean(
    isAdmin ||
    trustedRole === 'moderator'
  );

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (isAdmin) return true; // Admin has all permissions

    return trustedPermissions.includes(permission);
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const requestId = ++roleRequestIdRef.current;

      if (!supabase) {
        console.warn('Supabase not available - skipping session initialization');
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          // Don't clear session state on network errors
          if (!error.message?.includes('fetch failed')) {
            setSession(null);
            setUser(null);
          }
        } else {
          setSession(session);
          setUser(session?.user as AuthUser ?? null);
          const nextRole = await getTrustedRole(session);
          if (requestId === roleRequestIdRef.current) {
            setTrustedRole(nextRole);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        // Only clear session on non-network errors
        if (!(error instanceof Error && error.message.includes('fetch failed'))) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (requestId === roleRequestIdRef.current) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Set up auth state listener
    if (supabase) {
      try {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          const requestId = ++roleRequestIdRef.current;
          setLoading(true);
          console.log('Auth state changed:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user as AuthUser ?? null);

          // Supabase warns against awaiting additional work inside auth event
          // callbacks because auth methods wait for the callback to return.
          void (async () => {
            const nextRole = await getTrustedRole(session);
            if (requestId !== roleRequestIdRef.current) return;

            setTrustedRole(nextRole);
            setLoading(false);

            if (event === 'SIGNED_OUT') {
              localStorage.removeItem('supabase.auth.token');
              router.push('/admin/login');
            } else if (event === 'SIGNED_IN' && (nextRole === 'admin' || nextRole === 'super_admin')) {
              if (router.pathname === '/admin/login') {
                router.push('/admin');
              }
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Session token refreshed successfully');
            }
          })();
        });

        return () => {
          roleRequestIdRef.current += 1;
          try {
            subscription.unsubscribe();
          } catch (error) {
            console.warn('Error unsubscribing from auth state changes:', error);
          }
        };
      } catch (error) {
        console.error('Error setting up auth state listener:', error);
      }
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
            phone: userData?.phone || '',
            organization: userData?.organization || 'Saintlammy Foundation'
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
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (logoutError) {
        console.warn('Unable to clear the server session cookie:', logoutError);
      }

      const { error } = await supabase.auth.signOut();

      // Always clear local authorization state when the user requests logout.
      roleRequestIdRef.current += 1;
      setUser(null);
      setSession(null);
      setTrustedRole(null);

      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: new Error('Authentication service not available. Please contact support.') as AuthError };
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: new Error('Please enter a valid email address') as AuthError };
      }

      // Only allow admin emails for password reset
      const isValidAdminEmail = email.includes('@saintlammyfoundation.org') ||
                               email === 'saintlammyfoundation@gmail.com' ||
                               email === 'saintlammy@gmail.com';

      if (!isValidAdminEmail) {
        return { error: new Error('Password reset is only available for admin accounts') as AuthError };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        // Handle specific error cases
        if (error.message.includes('fetch failed') || error.message.includes('network')) {
          return { error: new Error('Network error. Please check your connection and try again.') as AuthError };
        }
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      if (error instanceof Error && error.message.includes('fetch failed')) {
        return { error: new Error('Network error. Please check your connection and try again.') as AuthError };
      }
      return { error: error as AuthError };
    }
  };

  const updateProfile = async (updates: Partial<EditableUserMetadata>) => {
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
    if (!supabase) {
      console.warn('Supabase not available - cannot refresh session');
      return;
    }

    let requestId: number | null = null;
    setLoading(true);

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Refresh session error:', error);
        // If token refresh fails, try to get existing session
        try {
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          if (existingSession) {
            setSession(existingSession);
            setUser(existingSession.user as AuthUser ?? null);
            requestId = ++roleRequestIdRef.current;
            const nextRole = await getTrustedRole(existingSession);
            if (requestId === roleRequestIdRef.current) {
              setTrustedRole(nextRole);
            }
          } else {
            // No valid session - clear state
            setSession(null);
            setUser(null);
          }
        } catch (getSessionError) {
          console.error('Failed to get existing session:', getSessionError);
          // Clear session state if everything fails
          setSession(null);
          setUser(null);
        }
      } else {
        setSession(session);
        setUser(session?.user as AuthUser ?? null);
        requestId = ++roleRequestIdRef.current;
        const nextRole = await getTrustedRole(session);
        if (requestId === roleRequestIdRef.current) {
          setTrustedRole(nextRole);
        }
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      // If network error or other issue, try to maintain existing session
      if (error instanceof Error && error.message.includes('fetch failed')) {
        console.warn('Network error during session refresh - maintaining existing session');
        // Don't clear the session if it's a network error
      } else {
        // Other errors - clear session state
        setSession(null);
        setUser(null);
      }
    } finally {
      if (requestId === null || requestId === roleRequestIdRef.current) {
        setLoading(false);
      }
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
