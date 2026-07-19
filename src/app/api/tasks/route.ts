import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);

    const { data: tasks, error } = await supabaseServer
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ tasks: tasks || [] });
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('Tasks GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);
    const body = await request.json();

    // Try inserting with all extended fields first (requires migration 007)
    const fullPayload = {
      tenant_id: tenantId,
      title: body.title,
      status: body.status || 'To Do',
      due_date: body.due_date || null,
      priority: body.priority || 'Medium',
      description: body.description || null,
      assignee: body.assignee || null,
      labels: body.labels || [],
      source: 'local',
      source_id: `local-${Date.now()}`,
    };

    const { data: task, error } = await supabaseServer
      .from('tasks')
      .insert(fullPayload)
      .select()
      .single();

    // If columns don't exist yet (migration not run), fall back to base schema only
    if (error) {
      const isColumnMissing =
        error.code === '42703' || // undefined_column
        error.message?.toLowerCase().includes('column') ||
        error.message?.toLowerCase().includes('priority') ||
        error.message?.toLowerCase().includes('description');

      if (isColumnMissing) {
        console.warn('Extended task columns not found — falling back to base schema. Run migration 007 to enable full features.');

        const basePayload = {
          tenant_id: tenantId,
          title: body.title,
          status: body.status || 'To Do',
          due_date: body.due_date || null,
          source: 'local',
          source_id: `local-${Date.now()}`,
        };

        const { data: fallbackTask, error: fallbackError } = await supabaseServer
          .from('tasks')
          .insert(basePayload)
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return NextResponse.json({ task: fallbackTask }, { status: 201 });
      }

      throw error;
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('Tasks POST error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
