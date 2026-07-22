import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import { GoogleConnector } from '@/lib/connectors/google';
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

// GET /api/events
// Fetch events for the authenticated tenant with optional date range parameters
export async function GET(request: NextRequest) {
  try {
    const { userId, tenantId } = await getAuthContext(request);
    
    // Rate-limited background sync triggered asynchronously (does not block HTTP response)
    await triggerBackgroundSync(userId, tenantId);
    
    const url = new URL(request.url);
    const startTimeParam = url.searchParams.get('start_time');
    const endTimeParam = url.searchParams.get('end_time');

    let query = supabaseServer
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId);

    if (startTimeParam) {
      query = query.gte('start_time', startTimeParam);
    }
    if (endTimeParam) {
      query = query.lte('start_time', endTimeParam);
    }

    // Sort by start_time ascending
    const { data: events, error } = await query.order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(processEvents(events || []));
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Events GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events
// Create a new calendar event
export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);
    const body = await request.json();

    const {
      title,
      start_time,
      end_time,
      description,
      color,
      reminder,
      meeting_link,
      attendees,
    } = body;

    if (!title || !start_time) {
      return NextResponse.json(
        { error: 'Title and start time are required' },
        { status: 400 }
      );
    }

    const newEvent = {
      tenant_id: tenantId,
      title,
      start_time,
      end_time: end_time || null,
      description: description || null,
      color: color || 'orange',
      reminder: reminder || 'none',
      meeting_link: meeting_link || null,
      attendees: attendees || [],
      source: 'local',
      source_id: crypto.randomUUID(), // unique local identifier
    };

    // Google Calendar Bidirectional Sync: Create on Google Calendar first if connected
    const googleConnector = new GoogleConnector();
    const googleEventId = await googleConnector.createGoogleEvent(tenantId, newEvent);
    if (googleEventId) {
      newEvent.source = 'google_calendar';
      newEvent.source_id = googleEventId;
    }

    let result = await supabaseServer
      .from('events')
      .insert([newEvent as any])
      .select()
      .single();

    // Check if table missing columns (PostgREST schema cache error or column not found)
    if (
      result.error &&
      (result.error.code === 'PGRST200' ||
        result.error.message?.includes('column') ||
        result.error.message?.includes('schema cache'))
    ) {
      console.warn('Events table missing columns in Supabase. Falling back to JSONB metadata packaging.');

      const metadataAttendee = {
        type: 'metadata',
        description: description || null,
        color: color || 'orange',
        reminder: reminder || 'none',
        meeting_link: meeting_link || null
      };

      const packedAttendees = [...(attendees || []), metadataAttendee];

      const fallbackEvent = {
        tenant_id: tenantId,
        title,
        start_time,
        end_time: end_time || null,
        attendees: packedAttendees,
        source: 'local',
        source_id: newEvent.source_id,
      };

      result = await supabaseServer
        .from('events')
        .insert([fallbackEvent])
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error creating event:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    // Process the returned event to unpack metadata if fallback was used
    const processed = processEvents([result.data])[0];
    return NextResponse.json(processed, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Events POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
