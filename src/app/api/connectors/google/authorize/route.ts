import { NextRequest, NextResponse } from 'next/server';
import { GoogleConnector } from '@/lib/connectors/google';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import { signState } from '@/lib/auth/oauthState';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuthContext(request);

    // ConnectorInterface.authorize() forwards its argument straight into the
    // OAuth `state` param — pass the signed state (not the raw userId) so the
    // callback can verify who initiated this flow without a session/header.
    const connector = new GoogleConnector();
    const { authUrl } = await connector.authorize(signState(userId));

    return NextResponse.json({ authUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Google authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google authorization' },
      { status: 500 }
    );
  }
}
