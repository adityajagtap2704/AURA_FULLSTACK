'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Mail,
  FileText,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
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
    isSyncingNotion
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
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

  if (isError || !data) {
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

  // Format Helper functions
  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const userEmail = user?.email || 'user@aura.space';
  const userName = userEmail.split('@')[0];

  // AI digest items compiled from real backend data
  const upcomingMeetingsCount = data.events.length;
  const pendingTasksCount = data.tasks.filter(t => t.status !== 'Done').length;
  const unreadEmailsCount = data.messages.length;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
            Good day, {userName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here is a snapshot of your workspace today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-3.5 py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <button
            onClick={() => syncGoogle()}
            disabled={isSyncingGoogle}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all shadow shadow-primary/10 disabled:opacity-50"
          >
            {isSyncingGoogle ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Sync Google
          </button>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Calendar Events', count: data.stats.totalEvents, color: 'text-primary bg-primary/10 border-primary/20', icon: CalendarIcon },
          { label: 'Pending Tasks', count: data.stats.totalTasks, color: 'text-primary bg-primary/10 border-primary/20', icon: CheckSquare },
          { label: 'Starred Emails', count: data.stats.totalMessages, color: 'text-primary bg-primary/10 border-primary/20', icon: Mail },
          { label: 'Recent Documents', count: data.stats.totalDocuments, color: 'text-primary bg-primary/10 border-primary/20', icon: FileText }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-all flex items-center justify-between group shadow-sm"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                <h3 className="text-3xl font-extrabold mt-2 tracking-tight group-hover:text-primary transition-colors">{stat.count}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} border`}>
                <Icon className="h-5 w-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Digest, Calendar, Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column (Calendar & Tasks) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Digest Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-500/5 via-violet-500/3 to-transparent border border-violet-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-violet-600">
              <Sparkles className="h-5 w-5 fill-violet-500 text-violet-600" />
              <h2 className="text-lg font-bold tracking-tight">AI Digest</h2>
            </div>
            
            <p className="text-foreground text-sm mt-3 leading-relaxed">
              You have <span className="font-semibold text-violet-700">{upcomingMeetingsCount} upcoming meetings</span> and <span className="font-semibold text-violet-700">{pendingTasksCount} open tasks</span> today. 
              {unreadEmailsCount > 0 && <> We found <span className="font-semibold text-violet-700">{unreadEmailsCount} recent flagged messages</span> that may require attention.</>}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-card/60 backdrop-blur border border-border p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Focus Target</span>
                <p className="text-sm font-semibold mt-1">Complete due tasks</p>
              </div>
              <div className="bg-card/60 backdrop-blur border border-border p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Meeting Preparation</span>
                <p className="text-sm font-semibold mt-1">Review calendar agendas</p>
              </div>
              <div className="bg-card/60 backdrop-blur border border-border p-4 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Inbox Priority</span>
                <p className="text-sm font-semibold mt-1">Respond to flagged items</p>
              </div>
            </div>
          </motion.div>

          {/* Today's Schedule Events */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" /> Upcoming Events (Next 7 Days)
              </h2>
              <Link href="/dashboard/calendar" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View Calendar <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {data.events.length > 0 ? (
              <div className="space-y-3">
                {data.events.slice(0, 4).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-4 border border-border rounded-xl hover:bg-muted/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>🕐 {formatTime(event.start_time)}</span>
                        <span>📆 {formatDate(event.start_time)}</span>
                        {event.attendees && event.attendees.length > 0 && (
                          <span>👥 {event.attendees.length} participants</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded capitalize">
                      {event.source.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-xl">
                <CalendarIcon className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming meetings scheduled.</p>
                <button
                  onClick={() => syncGoogle()}
                  className="mt-3 text-xs font-semibold text-primary hover:underline"
                >
                  Sync Google Calendar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Tasks & Recent Actions) */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" /> Actionable Tasks
              </h2>
              <Link href="/dashboard/tasks" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                All Tasks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {data.tasks.length > 0 ? (
              <div className="space-y-3">
                {data.tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-border rounded-xl hover:bg-muted/40 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-foreground truncate">{task.title}</h4>
                      {task.due_date && (
                        <p className="text-[10px] text-muted-foreground mt-1">Due: {formatDate(task.due_date)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase">
                        {task.status || 'Todo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-xl">
                <CheckSquare className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No active tasks found.</p>
                <button
                  onClick={() => syncNotion()}
                  className="mt-3 text-xs font-semibold text-primary hover:underline"
                >
                  Sync Notion Tasks
                </button>
              </div>
            )}
          </div>

          {/* Sync Health Panel */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-accent" /> Recent Sync Health
            </h2>

            {data.syncJobs.length > 0 ? (
              <div className="space-y-3">
                {data.syncJobs.map((job) => {
                  const isCompleted = job.status === 'completed';
                  const isFailed = job.status === 'failed';
                  return (
                    <div key={job.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {isFailed && <XCircle className="h-4 w-4 text-danger" />}
                        {!isCompleted && !isFailed && <RefreshCw className="h-4 w-4 text-warning animate-spin" />}
                        <span className="font-semibold capitalize text-foreground">{job.connector}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isCompleted ? 'bg-success/10 text-success' : isFailed ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                        }`}>
                          {job.status}
                        </span>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          {job.completed_at ? formatDate(job.completed_at) : formatDate(job.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">No recent sync history.</p>
            )}
          </div>
        </div>
      </div>

      {/* Flagged Emails & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged Emails */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Flagged Messages
            </h2>
            <Link href="/dashboard/gmail" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Inbox <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {data.messages.length > 0 ? (
            <div className="space-y-3">
              {data.messages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="p-3 border border-border rounded-xl hover:bg-muted/40 transition-colors flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground truncate max-w-[200px]">{msg.sender}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(msg.created_at)}</span>
                  </div>
                  <h4 className="font-bold text-foreground truncate">{msg.subject || '(No Subject)'}</h4>
                  <p className="text-muted-foreground truncate leading-relaxed">{msg.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No recent messages retrieved.</p>
          )}
        </div>

        {/* Documents */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Recent Documents
            </h2>
            <Link href="/dashboard/documents" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              All Files <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {data.documents.length > 0 ? (
            <div className="space-y-3">
              {data.documents.slice(0, 4).map((doc) => (
                <div key={doc.id} className="p-3 border border-border rounded-xl hover:bg-muted/40 transition-colors flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-foreground">{doc.title}</h4>
                    <p className="text-[10px] text-muted-foreground">Modified: {formatDate(doc.last_modified)}</p>
                  </div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-muted hover:bg-border text-muted-foreground hover:text-foreground transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-[9px] bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase">
                      {doc.source}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No documents found. Try syncing Notion.</p>
          )}
        </div>
      </div>
    </div>
  );
}
