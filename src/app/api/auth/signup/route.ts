import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Create user using the service role (admin) so we can auto-confirm
    const { data: created, error: createError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Now sign in the user to obtain a session
    const { data: signInData, error: signInError } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // User was created but could not sign in — return user info but no session
      return NextResponse.json({ user: created.user, session: null, warning: signInError.message });
    }

    return NextResponse.json({ user: signInData.user, session: signInData.session });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
