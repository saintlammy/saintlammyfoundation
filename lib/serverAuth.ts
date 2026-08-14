import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

const ADMIN_ROLES = new Set(['admin', 'super_admin']);

export interface AdminApiRequest extends NextApiRequest {
  adminUser?: User;
}

function getBearerToken(req: NextApiRequest): string | null {
  const authorization = req.headers.authorization;
  if (!authorization) return null;

  const [scheme, token, extra] = authorization.trim().split(/\s+/);
  if (scheme !== 'Bearer' || !token || extra) return null;

  return token;
}

function getSessionCookie(req: NextApiRequest): string | null {
  const rawCookie = req.headers.cookie;
  if (!rawCookie) return null;

  for (const entry of rawCookie.split(';')) {
    const [rawName, ...rawValue] = entry.trim().split('=');
    if (rawName === 'slf_admin_session' && rawValue.length > 0) {
      return decodeURIComponent(rawValue.join('='));
    }
  }

  return null;
}

async function hasTrustedAdminRole(user: User): Promise<boolean> {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === 'string' && ADMIN_ROLES.has(appRole)) {
    return true;
  }

  if (!supabaseAdmin) return false;

  const { data, error } = await (supabaseAdmin as any)
    .from('users')
    .select('role, status')
    .eq('auth_user_id', user.id)
    .maybeSingle();

  if (error || !data || data.status === 'inactive') {
    return false;
  }

  return typeof data.role === 'string' && ADMIN_ROLES.has(data.role);
}

export async function requireAdmin(
  req: AdminApiRequest,
  res: NextApiResponse
): Promise<User | null> {
  const verifiedUser = await getOptionalAdmin(req);
  if (!verifiedUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  req.adminUser = verifiedUser;
  return verifiedUser;
}

export async function getOptionalAdmin(req: NextApiRequest): Promise<User | null> {
  const candidateTokens = [getBearerToken(req), getSessionCookie(req)].filter(
    (token, index, tokens): token is string => Boolean(token) && tokens.indexOf(token) === index
  );

  if (candidateTokens.length === 0 || !supabaseAdmin) return null;

  let verifiedUser: User | null = null;
  for (const token of candidateTokens) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data.user) {
      verifiedUser = data.user;
      break;
    }
  }

  if (!verifiedUser) {
    return null;
  }

  if (!(await hasTrustedAdminRole(verifiedUser))) {
    return null;
  }

  return verifiedUser;
}

export function withAdminAuth(handler: NextApiHandler): NextApiHandler {
  return async (req: AdminApiRequest, res: NextApiResponse) => {
    const user = await requireAdmin(req, res);
    if (!user) return;

    return handler(req, res);
  };
}
