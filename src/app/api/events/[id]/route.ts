import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';
import { GoogleConnector } from '@/lib/connectors/google';

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

// PUT /api/events/[id]
// Update a specific event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = await getAuthContext(request);
    const { id } = await params;
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

    // Fetch the existing event first to check if it's synced with Google
    const { data: existingEvent, error: fetchErr } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (fetchErr || !existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Merge updates for Google sync representation
    const existingEventAny = existingEvent as any;
    const mergedEvent = {
      title: title !== undefined ? title : existingEventAny.title,
      start_time: start_time !== undefined ? start_time : existingEventAny.start_time,
      end_time: end_time !== undefined ? end_time : existingEventAny.end_time,
      description: description !== undefined ? description : existingEventAny.description,
      attendees: attendees !== undefined ? attendees : existingEventAny.attendees,
    };

    // Build the update payload
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (start_time !== undefined) updateData.start_time = start_time;
    if (end_time !== undefined) updateData.end_time = end_time;
    if (description !== undefined) updateData.description = description;
    if (color !== undefined) updateData.color = color;
    if (reminder !== undefined) updateData.reminder = reminder;
    if (meeting_link !== undefined) updateData.meeting_link = meeting_link;
    if (attendees !== undefined) updateData.attendees = attendees;
    
    updateData.updated_at = new Date().toISOString();

    // Google Calendar Bidirectional Sync: Update or Create on Google Calendar if connected
    const googleConnector = new GoogleConnector();
    if (existingEventAny.source === 'google_calendar' && existingEventAny.source_id) {
      await googleConnector.updateGoogleEvent(tenantId, existingEventAny.source_id, mergedEvent);
    } else {
      // Promote local event to Google Calendar if user is connected
      const googleEventId = await googleConnector.createGoogleEvent(tenantId, mergedEvent);
      if (googleEventId) {
        updateData.source = 'google_calendar';
        updateData.source_id = googleEventId;
      }
    }

    let result = await supabaseServer
      .from('events')
      .update(updateData as any)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    // Check if table missing columns (PostgREST schema cache error or column not found)
    if (
      result.error &&
      (result.error.code === 'PGRST200' ||
        result.error.message?.includes('column') ||
        result.error.message?.includes('schema cache'))
    ) {
      console.warn('Events table missing columns on update. Falling back to JSONB metadata packaging.');

      let attendeesList = Array.isArray(existingEvent.attendees) ? existingEvent.attendees : [];
      const metadataIndex = attendeesList.findIndex((a: any) => a?.type === 'metadata');
      
      let currentMetadata: any = {};
      if (metadataIndex !== -1) {
        currentMetadata = attendeesList[metadataIndex];
        attendeesList = attendeesList.filter((_, idx) => idx !== metadataIndex);
      }

      const updatedMetadata = {
        type: 'metadata',
        description: description !== undefined ? description : currentMetadata.description,
        color: color !== undefined ? color : currentMetadata.color,
        reminder: reminder !== undefined ? reminder : currentMetadata.reminder,
        meeting_link: meeting_link !== undefined ? meeting_link : currentMetadata.meeting_link
      };

      const finalAttendees = [...(attendees !== undefined ? attendees : attendeesList), updatedMetadata];

      const fallbackUpdate: Record<string, any> = {
        updated_at: new Date().toISOString()
      };
      if (title !== undefined) fallbackUpdate.title = title;
      if (start_time !== undefined) fallbackUpdate.start_time = start_time;
      if (end_time !== undefined) fallbackUpdate.end_time = end_time;
      fallbackUpdate.attendees = finalAttendees;

      // Persist the source values if promoted
      if (updateData.source) fallbackUpdate.source = updateData.source;
      if (updateData.source_id) fallbackUpdate.source_id = updateData.source_id;

      result = await supabaseServer
        .from('events')
        .update(fallbackUpdate as any)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error updating event:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    const processed = processEvents([result.data])[0];
    return NextResponse.json(processed);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Events PUT API error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]
// Delete a specific event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { tenantId } = await getAuthContext(request);
    const { id } = await params;

    // Fetch the existing event to check if we need to delete it from Google Calendar
    const { data: existingEvent } = await supabaseServer
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .single();

    if (existingEvent && existingEvent.source === 'google_calendar' && existingEvent.source_id) {
      const googleConnector = new GoogleConnector();
      await googleConnector.deleteGoogleEvent(tenantId, existingEvent.source_id);
    }

    const { error } = await supabaseServer
      .from('events')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Events DELETE API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
