'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TIMEOUT_MS = 5000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ]);
}

const ROLE_CACHE_KEY = 'aura_user_role';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchRole = useCallback(async (userId: string) => {
    try {
      const profileQuery = supabase.from('profiles').select('role').eq('id', userId).single();
      const { data: profile } = await withTimeout(
        Promise.resolve(profileQuery),
        AUTH_TIMEOUT_MS
      );
      const resolvedRole = profile?.role || 'USER';
      setRole(resolvedRole);
      try { sessionStorage.setItem(ROLE_CACHE_KEY, resolvedRole); } catch {}
    } catch {
      const cached = (() => { try { return sessionStorage.getItem(ROLE_CACHE_KEY); } catch { return null; } })();
      setRole(cached || 'USER');
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT_MS
        );

        if (session?.user) {
          setUser(session.user);
          fetchRole(session.user.id);
        } else {
          setUser(null);
          setRole(null);
          try { sessionStorage.removeItem(ROLE_CACHE_KEY); } catch {}
        }
      } catch (err) {
        console.error('Error fetching Supabase session:', err);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
        try { sessionStorage.removeItem(ROLE_CACHE_KEY); } catch {}
      }
      setLoading(false);

      if (event === 'SIGNED_IN') {
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, fetchRole]);

  // Handle protected routing
  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === '/login' || pathname === '/signup';
    const isDashboardRoute = pathname.startsWith('/dashboard');
    const isAdminRoute = pathname.startsWith('/dashboard/admin');

    if (!user && isDashboardRoute) {
      router.push('/login');
    } else if (user && isAuthRoute) {
      router.push('/dashboard');
    } else if (user && isAdminRoute && role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [user, role, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, role, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
