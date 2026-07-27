'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAIDigest } from '@/hooks/useAIDigest';
import { useDashboard } from '@/hooks/useDashboard';
import {
  Sparkles,
  RefreshCw,
  ClipboardList,
  CalendarClock,
  Star,
  CheckCircle2,
  Info,
  Mail,
  CheckSquare,
} from 'lucide-react';

const TABS = ['Today', 'This Week', 'Insights', 'Summaries'] as const;
type Tab = (typeof TABS)[number];

export default function AIDigestPage() {
  const router = useRouter();
  const { digest, isLoading, isError, refetch, isRefetching } = useAIDigest();
  const { data } = useDashboard();
  const [tab, setTab] = useState<Tab>('Today');

  const todayStr = new Date().toDateString();
  const eventsToday = (data?.events || []).filter((e) => e.start_time && new Date(e.start_time).toDateString() === todayStr);
  const tasksDueToday = (data?.tasks || []).filter((t) => t.due_date && new Date(t.due_date).toDateString() === todayStr);
  const messagesToday = (data?.messages || []).filter((m) => m.created_at && new Date(m.created_at).toDateString() === todayStr);
  const flaggedMessages = (data?.messages || []).filter((m) => m.flagged);

  const priorityLabel = (score: number, idx: number) => {
    if (score >= 90 || idx === 0) return 'High';
    if (score >= 70 || idx <= 2) return 'Medium';
    return 'Low';
  };

  const priorityStyle = (label: string) => {
    switch (label) {
      case 'High':
        return 'bg-danger/10 text-danger';
      case 'Medium':
        return 'bg-orange-500/10 text-orange-600';
      case 'Low':
      default:
    }
  };

  const getSourceIcon = (itemType: string, source: string) => {
    if (itemType === 'task' || source === 'notion') {
      return <CheckSquare className="h-4 w-4 text-orange-500 shrink-0" />;
    }
    if (itemType === 'event' || source === 'google_calendar') {
      return <CalendarClock className="h-4 w-4 text-blue-500 shrink-0" />;
    }
    return <Mail className="h-4 w-4 text-emerald-500 shrink-0" />;
  };

  // Real suggestions derived from today's actual schedule/tasks — no
  // fabricated content when there's nothing to base a suggestion on.
  const suggestions: string[] = digest?.ai_suggestions && digest.ai_suggestions.length > 0
    ? digest.ai_suggestions
    : (digest?.meeting_prep_notes || []).map((n) => `"${n.event_title}": ${n.prep_note}`);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Digest</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/ai-assistant')}
            className="flex items-center gap-2 px-3.5 py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Ask AI anything
          </button>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-3.5 py-2 border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab !== 'Today' ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Sparkles className="h-8 w-8 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">{tab} is coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">This view isn&apos;t available yet — check back later.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-card border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError || !digest ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl">
          <Sparkles className="h-8 w-8 text-muted-foreground/60 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">AI digest is unavailable right now.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Summary */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
                <ClipboardList className="h-4.5 w-4.5 text-primary" /> Today&apos;s Summary
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{digest.summary_text}</p>
            </div>

            {/* Today's Outlook */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <CalendarClock className="h-4.5 w-4.5 text-primary" /> Today&apos;s Outlook
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-orange-500">{eventsToday.length}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-1">Meetings</p>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-orange-500">{tasksDueToday.length}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-1">Tasks</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{messagesToday.length}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-1">Emails</p>
                </div>
              </div>
            </div>

            {/* Top Priorities */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <Star className="h-4.5 w-4.5 text-amber-500" /> Top Priorities
              </h2>
              {digest.top_priorities.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No priority items scored for today.</p>
              ) : (
                <div className="divide-y divide-border">
                  {digest.top_priorities.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        {getSourceIcon(item.item_type, item.source)}
                        <span className="text-sm text-foreground truncate">{item.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${priorityStyle(priorityLabel(item.score, idx))}`}>
                        {priorityLabel(item.score, idx)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Suggestions */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> AI Suggestions
              </h2>
              {suggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nothing to suggest yet — your schedule is clear.</p>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <p className="text-sm text-foreground flex-1">{s}</p>
                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
