'use client';

import { useState, useEffect, useRef, ComponentType } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useDashboard } from '@/hooks/useDashboard';
import { authService } from '@/services/auth';
import {
  GmailIcon,
  GoogleCalendarIcon,
  GoogleMeetIcon,
  NotionIcon,
  SlackIcon,
  MicrosoftIcon,
  LinearIcon,
  DropboxIcon,
} from '@/components/icons/ServiceIcons';
import { Link2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface IntegrationCard {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  connected: boolean;
  lastSynced: string | null;
  real: boolean;
  onAction: () => void;
  actionLoading: boolean;
}

export default function IntegrationsPage() {
  const {
    isLoading,
    isError,
    refetch,
    syncGoogle,
    isSyncingGoogle,
    syncNotion,
    isSyncingNotion,
    connectorStatus,
    isLoadingConnectorStatus,
    data,
  } = useDashboard();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [notionLoading, setNotionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handledRedirect = useRef(false);

  // The OAuth callback only exchanges/stores the token — it doesn't sync any
  // data. Landing here with ?connected=<provider> means authorization just
  // succeeded, so refresh the (now stale) connector-status cache and kick
  // off the first sync automatically instead of leaving the card stuck on
  // "Not Connected" until the user notices and clicks Sync Now themselves.
  useEffect(() => {
    if (handledRedirect.current) return;
    const connected = searchParams.get('connected');
    const oauthError = searchParams.get('error');

    if (connected === 'google') {
      handledRedirect.current = true;
      queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
      syncGoogle();
      router.replace('/dashboard/integrations');
    } else if (connected === 'notion') {
      handledRedirect.current = true;
      queryClient.invalidateQueries({ queryKey: ['connectorStatus'] });
      syncNotion();
      router.replace('/dashboard/integrations');
    } else if (oauthError) {
      handledRedirect.current = true;
      setError(`Authorization failed: ${oauthError}`);
      router.replace('/dashboard/integrations');
    }
  }, [searchParams, syncGoogle, syncNotion, router, queryClient]);

  if (isLoading || isLoadingConnectorStatus) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !connectorStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load integrations status</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  // Source of truth is whether a token exists, not whether any data happens
  // to be synced — stale rows from a prior connection would otherwise read
  // as "connected" even with no valid token.
  const { google: googleConnected, notion: notionConnected } = connectorStatus;

  const formatRelativeTime = (dateString?: string | null) => {
    if (!dateString) return null;
    const diffMin = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
  };

  const lastSyncedFor = (connector: string) => {
    const jobs = (data?.syncJobs || []).filter((j) => j.connector === connector && j.status === 'completed' && j.completed_at);
    if (jobs.length === 0) return null;
    const latest = jobs.reduce((a, b) => (new Date(a.completed_at!).getTime() > new Date(b.completed_at!).getTime() ? a : b));
    return formatRelativeTime(latest.completed_at);
  };

  const handleGoogleConnect = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const authUrl = await authService.getGoogleAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to retrieve authorization URL');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Google OAuth failed to initiate');
      setGoogleLoading(false);
    }
  };

  const handleNotionConnect = async () => {
    setNotionLoading(true);
    setError(null);
    try {
      const authUrl = await authService.getNotionAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error('Failed to retrieve authorization URL');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Notion OAuth failed to initiate');
      setNotionLoading(false);
    }
  };

  const notAvailable = (label: string) => () => setComingSoon(label);

  const cards: IntegrationCard[] = [
    {
      key: 'gmail',
      label: 'Gmail',
      icon: GmailIcon,
      connected: googleConnected,
      lastSynced: lastSyncedFor('google'),
      real: true,
      onAction: googleConnected ? () => syncGoogle() : handleGoogleConnect,
      actionLoading: googleConnected ? isSyncingGoogle : googleLoading,
    },
    {
      key: 'google_calendar',
      label: 'Google Calendar',
      icon: GoogleCalendarIcon,
      connected: googleConnected,
      lastSynced: lastSyncedFor('google'),
      real: true,
      onAction: googleConnected ? () => syncGoogle() : handleGoogleConnect,
      actionLoading: googleConnected ? isSyncingGoogle : googleLoading,
    },
    {
      key: 'notion',
      label: 'Notion',
      icon: NotionIcon,
      connected: notionConnected,
      lastSynced: lastSyncedFor('notion'),
      real: true,
      onAction: notionConnected ? () => syncNotion() : handleNotionConnect,
      actionLoading: notionConnected ? isSyncingNotion : notionLoading,
    },
    {
      key: 'google_meet',
      label: 'Google Meet',
      icon: GoogleMeetIcon,
      connected: false,
      lastSynced: null,
      real: false,
      onAction: notAvailable('Google Meet'),
      actionLoading: false,
    },
    {
      key: 'slack',
      label: 'Slack',
      icon: SlackIcon,
      connected: false,
      lastSynced: null,
      real: false,
      onAction: notAvailable('Slack'),
      actionLoading: false,
    },
    {
      key: 'microsoft365',
      label: 'Microsoft 365',
      icon: MicrosoftIcon,
      connected: false,
      lastSynced: null,
      real: false,
      onAction: notAvailable('Microsoft 365'),
      actionLoading: false,
    },
    {
      key: 'linear',
      label: 'Linear',
      icon: LinearIcon,
      connected: false,
      lastSynced: null,
      real: false,
      onAction: notAvailable('Linear'),
      actionLoading: false,
    },
    {
      key: 'dropbox',
      label: 'Dropbox',
      icon: DropboxIcon,
      connected: false,
      lastSynced: null,
      real: false,
      onAction: notAvailable('Dropbox'),
      actionLoading: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Link2 className="h-6 w-6 text-primary" /> Integrations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Connect your favorite tools to bring everything together.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4 text-sm text-danger border border-danger/20">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {comingSoon && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground border border-border">
          <span>{comingSoon} isn&apos;t connected yet — support for it is on the roadmap.</span>
          <button onClick={() => setComingSoon(null)} className="text-xs font-semibold text-primary hover:underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* Integration cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-primary/20 transition-all ${!card.real ? 'opacity-90' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="h-11 w-11 rounded-xl bg-muted/40 border border-border flex items-center justify-center overflow-hidden">
                  <Icon className="h-6 w-6" />
                </div>
                {card.connected ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                ) : (
                  <AlertCircle className="h-4.5 w-4.5 text-orange-500" />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">{card.label}</h3>
                {card.connected ? (
                  <p className="text-xs font-semibold text-success">
                    Connected{card.lastSynced ? ` · Last synced ${card.lastSynced}` : ''}
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-danger">Not Connected</p>
                )}
              </div>

              <button
                onClick={card.onAction}
                disabled={card.actionLoading}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 ${
                  card.connected
                    ? 'bg-success/10 text-success hover:bg-success/15'
                    : 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/15'
                }`}
              >
                {card.actionLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : card.connected ? (
                  <RefreshCw className="h-3.5 w-3.5" />
                ) : null}
                {card.actionLoading ? 'Working…' : card.connected ? 'Sync Now' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
