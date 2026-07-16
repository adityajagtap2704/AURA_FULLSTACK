'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { authService } from '@/services/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Key,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';

interface TokenStatus {
  provider: string;
  user_id: string;
  access_token: boolean;
  refresh_token: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const [tokens, setTokens] = useState<TokenStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTokens = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await authService.checkTokens();
      setTokens(data || []);
    } catch (err: any) {
      console.error('Error fetching admin token status:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch system OAuth token statuses.'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'ADMIN') {
      fetchTokens();
    }
  }, [role, fetchTokens]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchTokens(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never / Long-lived';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Shield className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Access Restricted</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          You do not have administrative privileges to access this console.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-primary" /> Admin Security Console
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of encrypted OAuth credentials and sync health flags across AURA users.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={loading || isRefreshing}
          className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main token list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/20">
          <Key className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="font-bold text-foreground">No Active OAuth Credentials</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            There are currently no synchronized access tokens in the workspace.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {tokens.map((token, index) => (
              <motion.div
                key={`${token.provider}-${token.user_id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-4">
                  {/* Header card */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg border border-primary/25 text-primary">
                        <Key className="h-4 w-4" />
                      </div>
                      <span className="font-bold capitalize text-foreground">{token.provider} Access Token</span>
                    </div>

                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border uppercase">
                      Active
                    </span>
                  </div>

                  {/* Body elements */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User UUID:</span>
                      <span className="font-mono text-[10px] text-foreground">{token.user_id}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Access Token Present:</span>
                      <div className="flex items-center gap-1">
                        {token.access_token ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            <span className="text-success font-semibold text-[10px]">Loaded</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-danger" />
                            <span className="text-danger font-semibold text-[10px]">Missing</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Refresh Token Present:</span>
                      <div className="flex items-center gap-1">
                        {token.refresh_token ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                            <span className="text-success font-semibold text-[10px]">Loaded</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-danger" />
                            <span className="text-danger font-semibold text-[10px]">None (Inline only)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-4 pt-3 border-t border-border flex flex-col gap-1.5 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Expires: {formatDate(token.expires_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Registered: {new Date(token.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
