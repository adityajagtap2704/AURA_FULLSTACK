import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: tasks, error: tasksError } = await supabaseServer
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: true });

    const { data: events, error: eventsError } = await supabaseServer
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });

    const { data: messages, error: messagesError } = await supabaseServer
      .from('messages')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (tasksError || eventsError || messagesError) {
      console.error('Today API fetch errors:', { tasksError, eventsError, messagesError });
    }

    return NextResponse.json({
      tasks: tasks || [],
      events: events || [],
      messages: messages || [],
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Today API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today data' },
      { status: 500 }
    );
  }
}
