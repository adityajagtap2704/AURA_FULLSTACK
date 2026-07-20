import { NextRequest, NextResponse } from 'next/server';
import { NotionConnector } from '@/lib/connectors/notion';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import { signState } from '@/lib/auth/oauthState';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuthContext(request);

    const connector = new NotionConnector();
    const { authUrl } = await connector.authorize(signState(userId));

    return NextResponse.json({ authUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notion authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Notion authorization' },
      { status: 500 }
    );
  }
}
