import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: User;
  isAdmin?: boolean;
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function withAuth(
  handler: AuthenticatedHandler,
  options: AuthMiddlewareOptions = {}
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const { requireAuth = true, requireAdmin = false } = options;

    try {
      // Skip auth check if not required
      if (!requireAuth) {
        return handler(req, res);
      }

      // Get the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No authorization header provided'
        });
      }

      // Extract the token
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No token provided'
        });
      }

      if (!supabase) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Authentication service not available'
        });
      }

      // Verify the token
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token'
        });
      }

      // Check admin status if required
      const isAdmin = user.email?.includes('@saintlammyfoundation.org') ||
                     user.user_metadata?.role === 'admin' ||
                     user.email === 'admin@saintlammyfoundation.org';

      if (requireAdmin && !isAdmin) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required'
        });
      }

      // Add user info to request
      req.user = user;
      req.isAdmin = isAdmin;

      // Call the original handler
      return handler(req, res);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Authentication check failed'
      });
    }
  };
}

// Utility function to get user from session (client-side)
export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Utility function to check if user is admin
export function checkIsAdmin(user: User | null): boolean {
  if (!user) return false;

  return user.email?.includes('@saintlammyfoundation.org') ||
         user.user_metadata?.role === 'admin' ||
         user.email === 'admin@saintlammyfoundation.org';
}

export default withAuth;