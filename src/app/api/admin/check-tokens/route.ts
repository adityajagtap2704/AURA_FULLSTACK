import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import type { Database } from '@/lib/supabase/database.types';

type OAuthTokenRow = Database['public']['Tables']['oauth_tokens']['Row'];

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuthContext(request);

    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin role required' }, { status: 403 });
    }

    const { data: tokens, error } = await supabaseServer
      .from('oauth_tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tokens:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tokens', details: error },
        { status: 500 }
      );
    }

    // Never return raw token values — presence flags only, even to admins.
    const sanitized = (tokens || []).map((token: OAuthTokenRow) => ({
      ...token,
      access_token: !!token.access_token,
      refresh_token: !!token.refresh_token,
    }));

    return NextResponse.json({ tokens: sanitized });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Exception in check-tokens:', error);
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    );
  }
}
