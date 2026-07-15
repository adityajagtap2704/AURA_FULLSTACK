import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { DEMO_USER_ID, DEMO_MODE_ENABLED } from '@/lib/config/demo-credentials';

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
 * Falls back to the demo user only when AURA_DEMO_MODE=true and no token was sent —
 * keeps local/demo curl testing working without weakening auth once demo mode is off.
 */
export async function getAuthContext(request: NextRequest): Promise<AuthContext> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token) {
    if (DEMO_MODE_ENABLED) {
      return { userId: DEMO_USER_ID, tenantId: DEMO_USER_ID };
    }
    throw new AuthError('Missing Authorization header');
  }

  const { data, error } = await supabaseServer.auth.getUser(token);

  if (error || !data.user) {
    throw new AuthError('Invalid or expired session');
  }

  return { userId: data.user.id, tenantId: data.user.id };
}
