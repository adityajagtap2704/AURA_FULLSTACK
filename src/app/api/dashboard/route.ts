import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import { triggerBackgroundSync } from '@/lib/sync/autoSync';

// Helper to unpack packed JSONB metadata from attendees if present
function processEvents(events: any[]) {
  return events.map(event => {
    const attendeesList = Array.isArray(event.attendees) ? event.attendees : [];
    const metadataIndex = attendeesList.findIndex((a: any) => a?.type === 'metadata');
    
    const updatedEvent = { ...event };
    
    if (metadataIndex !== -1) {
      const metadata = attendeesList[metadataIndex];
      if (!updatedEvent.description) updatedEvent.description = metadata.description;
      
      // Only fallback color/reminder/meeting_link if they are not already set as columns on row
      if (updatedEvent.color === undefined || updatedEvent.color === null || updatedEvent.color === 'orange') {
        updatedEvent.color = metadata.color || updatedEvent.color || 'orange';
      }
      if (updatedEvent.reminder === undefined || updatedEvent.reminder === null || updatedEvent.reminder === 'none') {
        updatedEvent.reminder = metadata.reminder || updatedEvent.reminder || 'none';
      }
      if (updatedEvent.meeting_link === undefined || updatedEvent.meeting_link === null) {
        updatedEvent.meeting_link = metadata.meeting_link;
      }
      
      // Filter out the metadata item from the public attendees array
      updatedEvent.attendees = attendeesList.filter((_: any, idx: number) => idx !== metadataIndex);
    }
    
    return updatedEvent;
  });
}

export async function GET(request: NextRequest) {
  try {
    const { userId, tenantId } = await getAuthContext(request);

    // Rate-limited background sync triggered asynchronously (does not block HTTP response)
    await triggerBackgroundSync(userId, tenantId);

    // Get today's date range
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    // Fetch all tasks (not just today - for Phase 1 demo)
    const { data: tasks, error: tasksError } = await supabaseServer
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: true });

    // Fetch events for next 7 days
    const { data: events, error: eventsError } = await supabaseServer
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', nextWeek.toISOString())
      .order('start_time', { ascending: true });

    // Fetch recent messages (flagged or not)
    const { data: messages, error: messagesError } = await supabaseServer
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Fetch recent documents
    const { data: documents, error: documentsError } = await supabaseServer
      .from('documents')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('last_modified', { ascending: false })
      .limit(10);

    // Fetch recent sync jobs
    const { data: syncJobs, error: syncError } = await supabaseServer
      .from('sync_jobs')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (tasksError || eventsError || messagesError || documentsError || syncError) {
      console.error('Dashboard fetch errors:', {
        tasksError,
        eventsError,
        messagesError,
        documentsError,
        syncError,
      });
    }

    return NextResponse.json({
      tasks: tasks || [],
      events: processEvents(events || []),
      messages: messages || [],
      documents: documents || [],
      syncJobs: syncJobs || [],
      stats: {
        totalTasks: tasks?.length || 0,
        totalEvents: events?.length || 0,
        totalMessages: messages?.length || 0,
        totalDocuments: documents?.length || 0,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
