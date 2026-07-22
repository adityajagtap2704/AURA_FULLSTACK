import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await getAuthContext(request);
    const { id } = await params;
    const body = await request.json();

    if (body.is_read === undefined) {
      return NextResponse.json({ error: 'Missing required field: is_read' }, { status: 400 });
    }

    const { data: notification, error } = await (supabaseServer as any)
      .from('notifications')
      .update({ is_read: body.is_read, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ error: 'Notifications table not found.' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ notification });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notification ID PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { tenantId } = await getAuthContext(request);
    const { id } = await params;

    const { error } = await (supabaseServer as any)
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ error: 'Notifications table not found.' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notification ID DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
