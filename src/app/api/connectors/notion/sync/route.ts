import { NextRequest, NextResponse } from 'next/server';
import { NotionConnector } from '@/lib/connectors/notion';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function POST(request: NextRequest) {
  try {
    const { userId, tenantId } = await getAuthContext(request);

    const connector = new NotionConnector();
    const result = await connector.sync(userId, tenantId);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notion sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync Notion data' },
      { status: 500 }
    );
  }
}
