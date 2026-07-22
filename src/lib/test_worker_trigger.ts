import dotenv from 'dotenv';
dotenv.config();

import { GoogleConnector } from './connectors/google';
import { supabaseServer } from './supabase/server';

async function main() {
  const userId = '46b26fd3-8fbe-4374-9950-49d46496fead';
  const tenantId = userId;
  const connector = new GoogleConnector();

  console.log('Triggering google sync via connector.sync...');
  const result = await connector.sync(userId, tenantId);
  console.log('Trigger result:', result);

  console.log('Waiting 10 seconds for the worker to process the job...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('Checking recent sync_jobs in Supabase...');
  const { data: jobs, error } = await supabaseServer
    .from('sync_jobs')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Failed to query sync_jobs:', error);
  } else {
    console.log('Recent sync jobs after trigger:', jobs?.map(j => ({
      id: j.id,
      connector: j.connector,
      status: j.status,
      items_synced: j.items_synced,
      error_message: j.error_message,
      started_at: j.started_at,
      completed_at: j.completed_at
    })));
  }
}

main().catch(console.error);
