import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

// Whether a token exists is the actual source of truth for "connected" —
// inferring it from synced data (as the dashboard's stats do) breaks the
// moment stale data outlives a token (pre-OAuth demo rows, a disconnect
// that leaves old synced rows behind, a sync that's never succeeded yet).
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuthContext(request);

    const { data, error } = await supabaseServer
      .from('oauth_tokens')
      .select('provider')
      .eq('user_id', userId);

    if (error) {
      console.error('Connector status fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch connector status' }, { status: 500 });
    }

    const providers = new Set((data || []).map((row) => row.provider));

    return NextResponse.json({
      google: providers.has('google'),
      notion: providers.has('notion'),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Connector status API error:', error);
    return NextResponse.json({ error: 'Failed to fetch connector status' }, { status: 500 });
  }
}
