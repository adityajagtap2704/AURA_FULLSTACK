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

    const handleError = (message: string) => {
      if (settled) return;
      settled = true;
      setError(message);
    };

    const code = new URLSearchParams(window.location.search).get('code');

    const init = async () => {
      try {
        // Exchange PKCE code for a session if present
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            handleError(exchangeError.message);
            return;
          }
        }

        // Check current session
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          handleError(sessionError.message);
          return;
        }

        if (data.session) {
          const hash = window.location.hash;

          // Password recovery links contain recovery tokens in the URL hash
          if (
            hash.includes('type=recovery') ||
            hash.includes('recovery')
          ) {
            settled = true;
            router.replace('/reset-password');
            return;
          }

          finish();
        }
      } catch (err) {
        handleError(
          err instanceof Error ? err.message : 'Authentication failed.'
        );
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session || settled) return;

      if (event === 'PASSWORD_RECOVERY') {
        settled = true;
        router.replace('/reset-password');
        return;
      }

      if (event === 'SIGNED_IN') {
        finish();
      }
    });

    const timeout = setTimeout(() => {
      if (!settled) {
        handleError('Sign-in timed out. Please try again.');
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE4D8] p-8">
        <div className="bg-[#FDFBF7] rounded-3xl p-8 shadow-lg border border-[#E5DDD0] w-full max-w-md space-y-4 text-center">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-[#1F1B16]">
            Authentication Failed
          </h2>
          <p className="text-xs text-[#6B6258]">{error}</p>
          <Link
            href="/login"
            className="inline-block text-xs font-bold text-[#C17817] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE4D8]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C17817] border-t-transparent" />
        <p className="text-sm text-[#6B6258]">
          Finishing authentication...
        </p>
      </div>
    </div>
  );
}