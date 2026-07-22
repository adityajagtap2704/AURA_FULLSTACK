import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAuthContext, AuthError } from '@/lib/auth/getAuthContext';

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);

    const { data: notifications, error } = await (supabaseServer as any)
      .from('notifications')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      // Handle the case where the migration hasn't been run yet (table doesn't exist)
      if (error.code === '42P01') {
        console.warn('Notifications table not found. Please run migration 008.');
        return NextResponse.json({ notifications: [], warning: 'Notifications table not initialized.' });
      }
      throw error;
    }

    return NextResponse.json({ notifications: notifications || [] });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notifications GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);
    const body = await request.json();

    if (!body.title || !body.description || !body.type) {
      return NextResponse.json({ error: 'Missing required fields: title, description, type' }, { status: 400 });
    }

    const payload = {
      tenant_id: tenantId,
      title: body.title,
      description: body.description,
      type: body.type,
      link: body.link || null,
      is_read: false,
    };

    const { data: notification, error } = await (supabaseServer as any)
      .from('notifications')
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ error: 'Notifications table not found. Apply migration 008.' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notifications POST error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);

    const { data: notifications, error } = await (supabaseServer as any)
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .eq('is_read', false)
      .select();

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ error: 'Notifications table not found.' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, count: notifications?.length || 0 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Notifications PATCH error:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { tenantId } = await getAuthContext(request);

    const { error } = await (supabaseServer as any)
      .from('notifications')
      .delete()
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
    console.error('Notifications DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
  }
}
