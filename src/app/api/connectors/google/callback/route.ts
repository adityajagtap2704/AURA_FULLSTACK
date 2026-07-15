import { NextRequest, NextResponse } from 'next/server';
import { GoogleConnector } from '@/lib/connectors/google';
import { verifyState } from '@/lib/auth/oauthState';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // signed { userId, ts } from /authorize
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    // Verifying the signature proves this callback belongs to the user who
    // called /authorize — Google's redirect carries no Authorization header.
    const userId = verifyState(state);

    const connector = new GoogleConnector();
    await connector.handleCallback(code, userId);

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL('/dashboard?connected=google', request.url)
    );
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=google_auth_failed', request.url)
    );
  }
}
