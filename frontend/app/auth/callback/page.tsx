'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      router.replace('/dashboard');
    };

    // PKCE flow: Supabase redirects back with ?code=...
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) setError(exchangeError.message);
        else finish();
      });
      return;
    }

    // Implicit flow: tokens arrive in the URL hash (#access_token=...) and
    // the client auto-parses/sets the session on load (detectSessionInUrl).
    // Check immediately in case it already resolved, then listen for it.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish();
    });

    const timeout = setTimeout(() => {
      if (!settled) setError('Sign-in timed out. Please try again.');
    }, 8000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE4D8] p-8">
        <div className="bg-[#FDFBF7] rounded-3xl p-8 shadow-lg border border-[#E5DDD0] w-full max-w-md space-y-4 text-center">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-[#1F1B16]">Sign-in failed</h2>
          <p className="text-xs text-[#6B6258]">{error}</p>
          <Link href="/login" className="inline-block text-xs font-bold text-[#C17817] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE4D8]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C17817] border-t-transparent" />
        <p className="text-sm text-[#6B6258]">Finishing sign-in...</p>
      </div>
    </div>
  );
}
