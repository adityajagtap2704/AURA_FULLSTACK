import { NextRequest, NextResponse } from 'next/server';
import { GoogleConnector } from '@/lib/connectors/google';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function POST(request: NextRequest) {
  try {
    const { userId, tenantId } = await getAuthContext(request);

    const connector = new GoogleConnector();
    const result = await connector.sync(userId, tenantId);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Google sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync Google data' },
      { status: 500 }
    );
  }
}
