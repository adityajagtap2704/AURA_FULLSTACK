import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export interface AuthContext {
  userId: string;
  tenantId: string; // Phase 1: tenantId === userId
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Resolves the authenticated user from a Supabase JWT (Authorization: Bearer <token>).
 * Every route requires a real session — there is no demo/bypass user.
 */
export async function getAuthContext(request: NextRequest): Promise<AuthContext> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    throw new AuthError('Missing Authorization header');
  }

  const { data, error } = await supabaseServer.auth.getUser(token);

  if (error || !data.user) {
    throw new AuthError('Invalid or expired session');
  }

  return { userId: data.user.id, tenantId: data.user.id };
}
