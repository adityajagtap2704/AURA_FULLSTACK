'use client';

import Image from 'next/image';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/providers/AuthProvider';
import { GmailIcon, GoogleCalendarIcon, GoogleMeetIcon, NotionIcon } from '@/components/icons/ServiceIcons';
import { getDisplayName } from '@/lib/userDisplay';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Mail,
  FileText,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Link2,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    syncGoogle,
    isSyncingGoogle,
    syncNotion,
    connectorStatus,
    isLoadingConnectorStatus
  } = useDashboard();

  if (isLoading || isLoadingConnectorStatus) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-card border border-border rounded-xl animate-pulse" />
          <div className="h-96 bg-card border border-border rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data || !connectorStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          There was an error communicating with the backend APIs. Please verify your connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/95 transition-all"
        >
          <RefreshCw className="h-4 w-4" /> Retry Connection
        </button>
      </div>
    );
  }

  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatRelativeTime = (dateString?: string | null) => {
    if (!dateString) return '';
    const diffMin = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
  };

  // "in 2h 15m" style countdown for events later today, matching the
  // mockup's schedule timeline — only shown for events still upcoming.
  const formatCountdown = (dateString: string) => {
    const diffMs = new Date(dateString).getTime() - Date.now();
    if (diffMs <= 0) return null;
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 60) return `in ${diffMin} min`;
    const hrs = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return mins > 0 ? `in ${hrs} hr ${mins} min` : `in ${hrs} hr`;
  };

  const { google: googleConnected, notion: notionConnected } = connectorStatus;

  // Real Google display name when the user signed in via Google OAuth
  // (Supabase stores it in user_metadata); falls back to the email prefix
  // for accounts that only ever used email/password.
  const userName = getDisplayName(user);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const todayStr = new Date().toDateString();
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Stats — computed entirely from real synced rows. No priority/read/
  // important/shared fields exist in the schema, so sub-labels only surface
  // counts that are genuinely tracked.
  const tasksDueToday = data.tasks.filter((t) => t.due_date && new Date(t.due_date).toDateString() === todayStr);
  const tasksDueTodayPending = tasksDueToday.filter((t) => t.status !== 'Done').length;

  const eventsToday = data.events
    .filter((e) => new Date(e.start_time).toDateString() === todayStr)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const upcomingEventsToday = eventsToday.filter((e) => new Date(e.start_time).getTime() > Date.now()).length;

  const flaggedMessagesCount = data.messages.filter((m) => m.flagged).length;

  const documentsUpdatedToday = data.documents.filter(
    (d) => d.last_modified && new Date(d.last_modified).toDateString() === todayStr
  ).length;

 const statCards = [
  {
    label: 'Tasks Due Today',
    count: tasksDueToday.length,
    sub: `${tasksDueTodayPending} pending`,
    icon: CheckSquare,
    ring: 'text-orange-500 bg-orange-500/15 border-orange-500/30',
    card: 'bg-orange-500/5 border-orange-500/10',
  },
  {
    label: 'Events Today',
    count: eventsToday.length,
    sub: `${upcomingEventsToday} upcoming`,
    icon: CalendarIcon,
    ring: 'text-blue-500 bg-blue-500/15 border-blue-500/30',
    card: 'bg-blue-500/5 border-blue-500/10',
  },
  {
    label: 'Messages',
    count: data.messages.length,
    sub: `${flaggedMessagesCount} flagged`,
    icon: Mail,
    ring: 'text-emerald-500 bg-emerald-500/15 border-emerald-500/30',
    card: 'bg-emerald-500/5 border-emerald-500/10',
  },
  {
    label: 'Documents',
    count: data.documents.length,
    sub: `${documentsUpdatedToday} updated today`,
    icon: FileText,
    ring: 'text-violet-500 bg-violet-500/15 border-violet-500/30',
    card: 'bg-violet-500/5 border-violet-500/10',
  },
];

  // Timeline dot colors cycle the same palette as the stat cards, purely
  // decorative — not tied to any real category field.
  const dotColors = ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-violet-500'];

  // Recent Items — a real merged activity feed across every synced type.
  type RecentItem = { key: string; type: 'task' | 'event' | 'message' | 'document'; title: string; meta: string; timestamp: string | null; href: string };
  const recentItems: RecentItem[] = [
    ...data.tasks.map((t): RecentItem => ({ key: `task-${t.id}`, type: 'task', title: t.title, meta: t.status || 'Todo', timestamp: t.created_at, href: '/dashboard/tasks' })),
    ...data.events.map((e): RecentItem => ({ key: `event-${e.id}`, type: 'event', title: e.title, meta: formatDate(e.start_time), timestamp: e.created_at, href: '/dashboard/calendar' })),
    ...data.messages.map((m): RecentItem => ({ key: `message-${m.id}`, type: 'message', title: m.subject || '(No subject)', meta: m.sender, timestamp: m.created_at, href: '/dashboard/gmail' })),
    ...data.documents.map((d): RecentItem => ({ key: `document-${d.id}`, type: 'document', title: d.title, meta: 'Notion', timestamp: d.last_modified || d.created_at, href: '/dashboard/documents' })),
  ]
    .filter((item) => item.timestamp)
    .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
    .slice(0, 5);

  const recentItemMeta = {
  task: {
    label: 'Task',
    icon: CheckSquare,
    badge: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
    card: 'bg-orange-500/5 hover:bg-orange-500/10'
  },
  event: {
    label: 'Calendar',
    icon: CalendarIcon,
    badge: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
    card: 'bg-blue-500/5 hover:bg-blue-500/10'
  },
  message: {
    label: 'Message',
    icon: Mail,
    badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    card: 'bg-emerald-500/5 hover:bg-emerald-500/10'
  },
  document: {
    label: 'Document',
    icon: FileText,
    badge: 'bg-violet-500/15 text-violet-500 border-violet-500/30',
    card: 'bg-violet-500/5 hover:bg-violet-500/10'
  },
};

  // Google Meet has no real connector/backend in this app — shown as a
  // static tile at your request, but never labeled "Connected" since that
  // would misrepresent state nothing here actually tracks.
  const integrations = [
    { label: 'Gmail', icon: GmailIcon, connected: googleConnected, real: true },
    { label: 'Google Calendar', icon: GoogleCalendarIcon, connected: googleConnected, real: true },
    { label: 'Notion', icon: NotionIcon, connected: notionConnected, real: true },
    { label: 'Google Meet', icon: GoogleMeetIcon, connected: false, real: false },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-primary/20"
      >
        {/* Free-license photo (Pexels — "Cozy Workspace with Coffee Mug on
            Desk" by Letícia Alvares), not the mockup's exact source image. */}
        <img src="/images/workspace.png"alt="Minimal workspace"width={1600}height={675}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30 dark:from-background dark:via-background/90 dark:to-background/50" />

        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {greeting}, {userName}!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Let&apos;s make today productive and meaningful.</p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-2 px-3.5 py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {googleConnected ? (
              <button
                onClick={() => syncGoogle()}
                disabled={isSyncingGoogle}
                className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
                Sync Google
              </button>
            ) : (
              <Link
                href="/dashboard/integrations"
                className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10"
              >
                <Link2 className="h-3.5 w-3.5" />
                Connect Google
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${stat.card} rounded-2xl border p-5 flex items-center gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
            >
              <div
  className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center border ${stat.ring}`}
>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
  <span className="text-xs font-medium text-muted-foreground">
    {stat.label}
  </span>

  <h3 className="text-4xl font-bold leading-none mt-1">
    {stat.count}
  </h3>

  <p className={`mt-2 text-xs font-semibold ${stat.ring.split(' ')[0]}`}>
    {stat.sub}
  </p>
</div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Today's Schedule + My Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule — timeline */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" /> Today&apos;s Schedule
            </h2>
            <span className="text-xs text-muted-foreground">{todayLabel}</span>
          </div>

          {eventsToday.length > 0 ? (
            <div className="relative pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-5">
                {eventsToday.map((event, i) => {
                  const countdown = formatCountdown(event.start_time);
                  return (
                    <div key={event.id} className="relative flex items-start gap-4">
                      <span className={`absolute -left-4 top-1 h-3 w-3 rounded-full ring-4 ring-card ${dotColors[i % dotColors.length]}`} />
                      <div className="w-16 shrink-0 pt-0.5 text-xs font-semibold text-foreground">
                        {formatTime(event.start_time)}
                      </div>
                      <div className="flex-1 min-w-0 flex items-start justify-between gap-3 border-l border-border pl-4">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">{event.title}</h4>
                          <p className="text-xs text-muted-foreground capitalize">{event.source.replace('_', ' ')}</p>
                        </div>
                        {countdown && (
                          <span className="text-[10px] font-semibold text-primary shrink-0 pt-0.5">{countdown}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-xl">
              <CalendarIcon className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nothing scheduled today.</p>
              {googleConnected ? (
                <button onClick={() => syncGoogle()} className="mt-3 text-xs font-semibold text-primary hover:underline">
                  Sync Google Calendar
                </button>
              ) : (
                <Link href="/dashboard/integrations" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
                  Connect Google Calendar
                </Link>
              )}
            </div>
          )}

          <Link href="/dashboard/calendar" className="mt-5 flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline">
            View full calendar <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
          {/* ===================== Messages Card ===================== */}
  <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        Messages
      </h2>

      <Link
        href="/dashboard/gmail"
        className="text-xs font-semibold text-primary hover:underline"
      >
        View all
      </Link>
    </div>

    {data.messages.length > 0 ? (
      <div className="space-y-3">
        {data.messages.slice(0, 5).map((message) => (
          <Link
            key={message.id}
            href="/dashboard/gmail"
            className="block rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {message.subject || "(No Subject)"}
                </p>

                <p className="text-xs text-muted-foreground truncate mt-1">
                  {message.sender}
                </p>
              </div>

              {message.flagged && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600">
                  FLAGGED
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-10 border border-dashed border-border rounded-xl">
        <Mail className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />

        <p className="text-sm text-muted-foreground">
          No messages found.
        </p>

        <Link
          href="/dashboard/gmail"
          className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
        >
          Open Gmail
        </Link>
      </div>
    )}
  </div>
  {/* ===================== End Messages Card ===================== */}


        {/* My Tasks */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">My Tasks</h2>
            <Link href="/dashboard/tasks" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>

          {data.tasks.length > 0 ? (
            <div className="space-y-1">
              {data.tasks.slice(0, 5).map((task) => {
                const isDone = task.status === 'Done';
                return (
                  <Link
                    key={task.id}
                    href="/dashboard/tasks"
                    className="flex items-center gap-3 py-2.5 px-1 rounded-lg hover:bg-muted/40 transition-colors group"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0" />
                    ) : (
                      <span className="h-4.5 w-4.5 rounded-full border-2 border-border shrink-0 group-hover:border-primary/50 transition-colors" />
                    )}
                    <span className={`text-sm flex-1 truncate ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                  </Link>
                );
              })}
              <Link
                href="/dashboard/tasks"
                className="flex items-center gap-2 py-2.5 px-1 mt-1 text-xs font-semibold text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> View task board
              </Link>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-xl">
              <CheckSquare className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active tasks found.</p>
              {notionConnected ? (
                <button onClick={() => syncNotion()} className="mt-3 text-xs font-semibold text-primary hover:underline">
                  Sync Notion Tasks
                </button>
              ) : (
                <Link href="/dashboard/integrations" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
                  Connect Notion Workspace
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Items + Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items — merged real activity feed */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Recent Items</h2>
            <span className="text-xs font-semibold text-primary">View all</span>
          </div>

          {recentItems.length > 0 ? (
            <div className="space-y-1">
              {recentItems.map((item) => {
                const meta = recentItemMeta[item.type];
                const Icon = meta.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`${meta.card} flex items-center justify-between gap-3 p-2.5 rounded-xl transition-colors`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg border ${meta.badge} shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.meta} &bull; {formatRelativeTime(item.timestamp)}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No recent activity yet — connect a tool to get started.</p>
          )}
        </div>

        {/* Your Integrations */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">Your Integrations</h2>
            <Link href="/dashboard/integrations" className="text-xs font-semibold text-primary hover:underline">
              Manage
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              const statusLabel = !integration.real ? 'Not integrated' : integration.connected ? 'Connected' : 'Not connected';
              return (
                <div
                  key={integration.label}
                  className={`flex flex-col items-center gap-2 p-4 border border-border rounded-xl relative ${!integration.real ? 'opacity-60' : ''}`}
                >
                  {integration.connected && (
                    <CheckCircle2 className="h-4 w-4 text-success absolute top-2 right-2" />
                  )}
                  <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{integration.label}</span>
                  <span className={`text-[9px] font-bold uppercase ${integration.connected ? 'text-success' : 'text-muted-foreground'}`}>
                    {statusLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboard/integrations"
            className="mt-4 flex items-center justify-center gap-2 py-2.5 border border-dashed border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Connect more tools
          </Link>
        </div>
      </div>
    </div>
  );
}
