import { NextRequest, NextResponse } from 'next/server';
import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { userId } = await getAuthContext(request);
    const { provider } = await params;

    const connector = provider === 'google' ? new GoogleConnector()
      : provider === 'notion' ? new NotionConnector()
      : null;

    if (!connector) {
      return NextResponse.json({ error: `Unknown connector: ${provider}` }, { status: 400 });
    }

    await connector.disconnect(userId);

    return NextResponse.json({ disconnected: provider });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Disconnect error:', error);
    return NextResponse.json({ error: 'Failed to disconnect connector' }, { status: 500 });
  }
}
