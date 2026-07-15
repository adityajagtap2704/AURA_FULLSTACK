import { NextRequest, NextResponse } from 'next/server';
import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

type ConnectorName = 'google' | 'notion';

const ALL_CONNECTORS: ConnectorName[] = ['google', 'notion'];

export async function POST(request: NextRequest) {
  try {
    const { userId, tenantId } = await getAuthContext(request);

    let requestedConnector: ConnectorName | undefined;
    try {
      const body = await request.json();
      if (body?.connector === 'google' || body?.connector === 'notion') {
        requestedConnector = body.connector;
      }
    } catch {
      // No JSON body provided — trigger every connector
    }

    const targets = requestedConnector ? [requestedConnector] : ALL_CONNECTORS;

    const results = await Promise.all(
      targets.map(async (name) => {
        const instance = name === 'google' ? new GoogleConnector() : new NotionConnector();
        const result = await instance.sync(userId, tenantId);
        return { connector: name, ...result };
      })
    );

    return NextResponse.json({ triggered: results });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sync trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger sync' },
      { status: 500 }
    );
  }
}
