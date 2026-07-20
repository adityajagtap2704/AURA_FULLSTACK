import { Task } from '@/types';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const MEDIUM_PALETTES = [
  { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  { bg: 'rgba(249,115,22,0.15)', text: '#f97316', border: 'rgba(249,115,22,0.3)' },
  { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  { bg: 'rgba(236,72,153,0.15)', text: '#ec4899', border: 'rgba(236,72,153,0.3)' },
  { bg: 'rgba(20,184,166,0.15)', text: '#14b8a6', border: 'rgba(20,184,166,0.3)' },
  { bg: 'rgba(99,102,241,0.15)', text: '#6366f1', border: 'rgba(99,102,241,0.3)' },
  { bg: 'rgba(6,182,212,0.15)', text: '#06b6d4', border: 'rgba(6,182,212,0.3)' },
];

function getMediumPalette(taskId: string) {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = taskId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return MEDIUM_PALETTES[Math.abs(hash) % MEDIUM_PALETTES.length];
}

function getBadgeStyle(priority?: string | null, taskId?: string) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return { backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' };
    case 'low':
      return { backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)' };
    case 'critical':
      return { backgroundColor: 'rgba(139,92,246,0.15)', color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.3)' };
    case 'medium':
    default: {
      const p = getMediumPalette(taskId || '');
      return { backgroundColor: p.bg, color: p.text, borderColor: p.border };
    }
  }
}

interface TaskListViewProps {
  tasks: Task[];

  emptyTitle?: string;
  emptyDescription?: string;
}

export function TaskListView({ tasks, emptyTitle, emptyDescription }: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-card/20 border border-dashed border-border">
        <CheckCircle2 className="h-10 w-10 mb-3 text-muted-foreground/40" />
        <h3 className="font-bold text-foreground">{emptyTitle || 'No tasks found'}</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs text-center">
          {emptyDescription || 'Try adjusting your search or filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="rounded-xl overflow-hidden border border-border bg-card">
        {tasks.map((task, index) => {
          const badge = getBadgeStyle(task.priority, task.id);
          const isDone = task.status === 'Done';
          const isLast = index === tasks.length - 1;

          return (
            <div
              key={task.id}
              className="flex items-center justify-between transition-colors duration-150"
              style={{
                padding: '10px 16px',
                borderBottom: isLast ? 'none' : '1px solid var(--border)',
                background: 'transparent',
              }}
            >
              {/* Left: icon + title + meta */}
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                {/* Status icon */}
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-success" style={{ width: 18, height: 18 }} />
                  ) : (
                    <Clock className="text-muted-foreground/50" style={{ width: 18, height: 18 }} />
                  )}
                </div>

                {/* Title + meta row */}
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      color: isDone ? 'text-muted-foreground' : 'text-foreground',
                      textDecoration: isDone ? 'line-through' : 'none',
                      margin: 0,
                      padding: 0,
                      lineHeight: '1.4',
                    }}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2.5 mt-1">
                    {/* Priority badge */}
                    <span
                      style={{
                        backgroundColor: badge.backgroundColor,
                        color: badge.color,
                        borderColor: badge.borderColor,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderRadius: '9999px',
                        padding: '1px 8px',
                        fontSize: '10px',
                        fontWeight: 600,
                        display: 'inline-block',
                        lineHeight: '16px',
                      }}
                    >
                      {task.priority || 'Medium'}
                    </span>

                    {/* Due date */}
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar style={{ width: 11, height: 11 }} />
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </span>
                    )}

                    {/* Source */}
                    <span className="text-[11px] capitalize text-muted-foreground">
                      {task.source}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: status pill + actions */}
              <div className="shrink-0 flex items-center gap-2">
                {task.status && (
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      ...(isDone
                        ? { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }
                        : task.status === 'In Progress'
                        ? { background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }
                        : { background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }),
                    }}
                  >
                    {task.status}
                  </span>
                )}

                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-semibold">
                  Read-only
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
