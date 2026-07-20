import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await getAuthContext(request);
    const { id } = await params;
    const body = await request.json();

    // Always include safe base fields
    const updateFields: any = {};
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.due_date !== undefined) updateFields.due_date = body.due_date;
    updateFields.updated_at = new Date().toISOString();

    // Include extended fields (requires migration 007)
    if (body.priority !== undefined) updateFields.priority = body.priority;
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.assignee !== undefined) updateFields.assignee = body.assignee;
    if (body.labels !== undefined) updateFields.labels = body.labels;

    let { data: task, error } = await supabaseServer
      .from('tasks')
      .update(updateFields)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    // If extended columns don't exist yet, fall back to base fields only
    if (error) {
      const isColumnMissing =
        error.code === '42703' ||
        error.message?.toLowerCase().includes('column') ||
        error.message?.toLowerCase().includes('priority') ||
        error.message?.toLowerCase().includes('description');

      if (isColumnMissing) {
        console.warn('Extended task columns not found in PATCH — falling back to base schema.');
        const baseFields: any = {};
        if (body.status !== undefined) baseFields.status = body.status;
        if (body.title !== undefined) baseFields.title = body.title;
        if (body.due_date !== undefined) baseFields.due_date = body.due_date;
        baseFields.updated_at = new Date().toISOString();

        const { data: fallbackTask, error: fallbackError } = await supabaseServer
          .from('tasks')
          .update(baseFields)
          .eq('id', id)
          .eq('tenant_id', tenantId)
          .select()
          .single();

        if (fallbackError) throw fallbackError;
        return NextResponse.json({ task: fallbackTask });
      }
      throw error;
    }

    return NextResponse.json({ task });
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('Task PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await getAuthContext(request);
    const { id } = await params;

    const { error } = await supabaseServer
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    console.error('Task DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
