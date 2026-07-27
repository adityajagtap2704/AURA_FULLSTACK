'use client';

import { useAIDigest } from '@/hooks/useAIDigest';
import { Sparkles, Award, Calendar, CheckSquare, Mail, RefreshCw, ShieldCheck } from 'lucide-react';

export function AIDigestWidget() {
  const { digest, isLoading, isError, refetch, isRefetching } = useAIDigest();

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-3.5 w-3.5 text-orange-500" />;
      case 'event':
        return <Calendar className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return <Mail className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  const getItemIconBg = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-orange-500/10';
      case 'event':
        return 'bg-blue-500/10';
      default:
        return 'bg-emerald-500/10';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5 hover:border-primary/40 hover:scale-[1.003] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> AI Daily Digest
        </h2>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          title="Refresh AI Digest"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      ) : isError || !digest ? (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <Sparkles className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">AI digest is unavailable right now.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {digest.summary_text}
          </p>

          <div className="space-y-3 flex-1">
            {digest.top_priorities.slice(0, 4).map((item, idx) => (
              <div key={item.id || idx} className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex items-center justify-center h-7 w-7 rounded-full shrink-0 ${getItemIconBg(item.item_type)}`}>
                  {getItemIcon(item.item_type)}
                </div>
                <p className="text-xs text-foreground leading-snug pt-1">
                  <span className="font-semibold">{item.title}</span>
                  {item.reason ? <span className="text-muted-foreground"> — {item.reason}</span> : null}
                </p>
              </div>
            ))}

            {digest.meeting_prep_notes[0] && (
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex items-center justify-center h-7 w-7 rounded-full bg-blue-500/10 shrink-0">
                  <Award className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <p className="text-xs text-foreground leading-snug pt-1">
                  <span className="font-semibold">{digest.meeting_prep_notes[0].event_title}</span>
                  <span className="text-muted-foreground"> — {digest.meeting_prep_notes[0].prep_note}</span>
                </p>
              </div>
            )}

            {digest.top_priorities.length === 0 && digest.meeting_prep_notes.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Nothing scored for today yet.</p>
            )}
          </div>

          {digest.metadata?.guardrail_passed && (
            <div className="mt-4 pt-3 border-t border-border/70 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500">
              <ShieldCheck className="h-3 w-3" /> Zero-Hallucination Guardrail Active
            </div>
          )}
        </>
      )}
    </div>
  );
}
