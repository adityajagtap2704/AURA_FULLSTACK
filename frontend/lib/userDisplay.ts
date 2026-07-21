import type { User } from '@supabase/supabase-js';

// Supabase populates user_metadata with the provider's real profile data for
// OAuth sign-ins (full_name/name + avatar_url/picture from Google) — for
// accounts that only ever used email/password, none of this exists, so
// callers must fall back to something derived from the email.
export function getDisplayName(user: User | null): string {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  const fullName = (metadata?.full_name || metadata?.name) as string | undefined;
  if (fullName) return fullName;

  const email = user?.email || 'user@aura.space';
  return email.split('@')[0];
}

export function getAvatarUrl(user: User | null): string | null {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  return (metadata?.avatar_url || metadata?.picture || null) as string | null;
}
