import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import type { Database } from '@/lib/supabase/database.types';

type SyncJobRow = Database['public']['Tables']['sync_jobs']['Row'];

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);

    const { data: jobs, error } = await supabaseServer
      .from('sync_jobs')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Sync status fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch sync status' }, { status: 500 });
    }

    // Reduce to the most recent job per connector (jobs are already sorted newest-first)
    const latestByConnector = new Map<string, SyncJobRow>();
    for (const job of jobs || []) {
      if (!latestByConnector.has(job.connector)) {
        latestByConnector.set(job.connector, job);
      }
    }

    const connectors = Array.from(latestByConnector.values()).map((job) => ({
      name: job.connector,
      status: job.status,
      lastSync: job.completed_at || job.started_at,
      itemsSynced: job.items_synced,
      errorMessage: job.error_message,
    }));

    return NextResponse.json({ connectors });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Sync status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync status' },
      { status: 500 }
    );
  }
}
