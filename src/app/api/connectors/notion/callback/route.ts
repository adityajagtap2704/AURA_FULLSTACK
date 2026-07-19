import { NextRequest, NextResponse } from 'next/server';
import { NotionConnector } from '@/lib/connectors/notion';
import { verifyState } from '@/lib/auth/oauthState';

// The dashboard this redirects to lives in the separate frontend app
// (frontend/, port 3001 in dev) — not on this backend's own origin.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // signed { userId, ts } from /authorize
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard/integrations?error=${error}`, FRONTEND_URL)
      );
    }

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    // Verifying the signature proves this callback belongs to the user who
    // called /authorize — Notion's redirect carries no Authorization header.
    const userId = verifyState(state);

    const connector = new NotionConnector();
    await connector.handleCallback(code, userId);

    return NextResponse.redirect(
      new URL('/dashboard/integrations?connected=notion', FRONTEND_URL)
    );
  } catch (error) {
    console.error('Notion callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=notion_auth_failed', FRONTEND_URL)
    );
  }
}
