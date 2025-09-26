import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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

export interface AuthenticatedRequest extends NextApiRequest {
  user?: AuthUser;
  isAdmin?: boolean;
  isModerator?: boolean;
  hasPermission?: (permission: string) => boolean;
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireModerator?: boolean;
  requiredPermissions?: string[];
  allowAnonymous?: boolean;
}

export function withAuth(
  handler: AuthenticatedHandler,
  options: AuthMiddlewareOptions = {}
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const {
      requireAuth = true,
      requireAdmin = false,
      requireModerator = false,
      requiredPermissions = [],
      allowAnonymous = false
    } = options;

    try {
      // Skip auth check if not required or anonymous access allowed
      if (!requireAuth || allowAnonymous) {
        return handler(req, res);
      }

      // Get the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No authorization header provided',
          code: 'NO_AUTH_HEADER'
        });
      }

      // Extract the token
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'No token provided',
          code: 'NO_TOKEN'
        });
      }

      if (!supabase) {
        return res.status(503).json({
          error: 'Service unavailable',
          message: 'Authentication service not available',
          code: 'SERVICE_UNAVAILABLE'
        });
      }

      // Verify the token
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }

      const authUser = user as AuthUser;

      // Enhanced role checking
      const isAdmin = Boolean(
        authUser.email?.includes('@saintlammyfoundation.org') ||
        authUser.user_metadata?.role === 'admin' ||
        authUser.email === 'admin@saintlammyfoundation.org' ||
        authUser.email === 'saintlammyfoundation@gmail.com' ||
        authUser.email === 'saintlammy@gmail.com'
      );

      const isModerator = Boolean(
        isAdmin ||
        authUser.user_metadata?.role === 'moderator'
      );

      const hasPermission = (permission: string): boolean => {
        if (isAdmin) return true; // Admin has all permissions
        const userPermissions = authUser.user_metadata?.permissions || [];
        return userPermissions.includes(permission);
      };

      // Check admin access if required
      if (requireAdmin && !isAdmin) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin access required',
          code: 'ADMIN_REQUIRED'
        });
      }

      // Check moderator access if required
      if (requireModerator && !isModerator) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Moderator access required',
          code: 'MODERATOR_REQUIRED'
        });
      }

      // Check specific permissions if required
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
        if (!hasAllPermissions) {
          return res.status(403).json({
            error: 'Forbidden',
            message: `Missing required permissions: ${requiredPermissions.join(', ')}`,
            code: 'INSUFFICIENT_PERMISSIONS'
          });
        }
      }

      // Add user info to request
      req.user = authUser;
      req.isAdmin = isAdmin;
      req.isModerator = isModerator;
      req.hasPermission = hasPermission;

      // Call the original handler
      return handler(req, res);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Authentication check failed',
        code: 'INTERNAL_ERROR'
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

// Enhanced utility functions
export function checkIsAdmin(user: AuthUser | null): boolean {
  if (!user) return false;

  return Boolean(
    user.email?.includes('@saintlammyfoundation.org') ||
    user.user_metadata?.role === 'admin' ||
    user.email === 'admin@saintlammyfoundation.org' ||
    user.email === 'saintlammyfoundation@gmail.com' ||
    user.email === 'saintlammy@gmail.com'
  );
}

export function checkIsModerator(user: AuthUser | null): boolean {
  if (!user) return false;

  return Boolean(
    checkIsAdmin(user) ||
    user.user_metadata?.role === 'moderator'
  );
}

export function checkHasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  if (checkIsAdmin(user)) return true;

  const userPermissions = user.user_metadata?.permissions || [];
  return userPermissions.includes(permission);
}

// Rate limiting helper (can be extended with Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const requestData = requestCounts.get(identifier);

  if (!requestData || now > requestData.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (requestData.count >= maxRequests) {
    return false;
  }

  requestData.count++;
  return true;
}

export default withAuth;