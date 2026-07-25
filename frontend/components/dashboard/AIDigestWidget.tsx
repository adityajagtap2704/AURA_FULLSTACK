'use client';

import { useAIDigest } from '@/hooks/useAIDigest';
import { motion } from 'framer-motion';
import { Sparkles, Award, Calendar, CheckSquare, Mail, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export function AIDigestWidget() {
  const { digest, isLoading, isError, refetch, isRefetching } = useAIDigest();
  const [showPrep, setShowPrep] = useState(true);

  if (isLoading) {
    return (
      <div className="h-44 bg-card/60 border border-border/80 rounded-2xl animate-pulse p-6 space-y-4">
        <div className="h-6 bg-primary/10 rounded-lg w-1/4" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (isError || !digest) {
    return null; // Gracefully degrade if endpoint is unavailable
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4 text-orange-500" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Mail className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:border-primary/40 group/widget"
    >
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/15 text-primary border border-primary/30 shadow-inner">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground tracking-tight">AI Daily Overview & Prioritization</h2>
              {digest.metadata?.guardrail_passed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
                  <ShieldCheck className="h-3 w-3" /> Zero-Hallucination Guardrail Active
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">NLP Summarizer • Rule-Based Scorer Engine</p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/80 bg-background/60 hover:bg-muted rounded-lg transition-all disabled:opacity-50"
          title="Refresh AI Digest"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Executive Summary Box */}
      <div className="p-3.5 rounded-xl bg-background/70 border border-border/70 text-sm text-foreground/90 font-medium leading-relaxed mb-5 shadow-inner">
        &ldquo;{digest.summary_text}&rdquo;
      </div>

      {/* Grid: Top Priorities + Meeting Prep Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Priorities Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground tracking-wide uppercase">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Top Priorities ({digest.top_priorities.length})
          </div>

          {digest.top_priorities.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No priority items scored for today.</p>
          ) : (
            <div className="space-y-2">
              {digest.top_priorities.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/70 hover:border-primary/30 transition-all hover:translate-x-0.5 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex items-center justify-center h-6 w-6 rounded-md bg-muted text-xs font-bold text-muted-foreground shrink-0">
                      #{idx + 1}
                    </span>
                    {getItemIcon(item.item_type)}
                    <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 rounded-md">
                      Score: {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meeting Prep Notes Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-foreground tracking-wide uppercase">
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-blue-500" />
              Meeting Prep Notes ({digest.meeting_prep_notes.length})
            </div>
            {digest.meeting_prep_notes.length > 0 && (
              <button
                onClick={() => setShowPrep(!showPrep)}
                className="text-[11px] font-medium text-primary hover:underline lowercase"
              >
                {showPrep ? 'hide' : 'show'}
              </button>
            )}
          </div>

          {digest.meeting_prep_notes.length === 0 ? (
            <div className="p-3 rounded-xl bg-card/40 border border-border/40 text-xs text-muted-foreground italic">
              No meetings scheduled requiring prep notes today.
            </div>
          ) : (
            showPrep && (
              <div className="space-y-2">
                {digest.meeting_prep_notes.map((note) => (
                  <div key={note.event_id} className="p-3 rounded-xl bg-card border border-border/70 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                      <span className="truncate">{note.event_title}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{note.start_time ? new Date(note.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/40">
                      {note.prep_note}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}
