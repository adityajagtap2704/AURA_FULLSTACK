import { Task } from '@/types';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

// 8 vibrant pastel palettes for Medium — each task gets a consistent one based on ID hash
const MEDIUM_PALETTES: { bg: string; text: string; border: string }[] = [
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

export function TaskCard({ task }: TaskCardProps) {
  const getBadgeStyle = (priority?: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return {
          backgroundColor: 'rgba(239,68,68,0.15)',
          color: '#ef4444',
          borderColor: 'rgba(239,68,68,0.3)',
        };
      case 'low':
        return {
          backgroundColor: 'rgba(34,197,94,0.15)',
          color: '#22c55e',
          borderColor: 'rgba(34,197,94,0.3)',
        };
      case 'critical':
        return {
          backgroundColor: 'rgba(139,92,246,0.15)',
          color: '#8b5cf6',
          borderColor: 'rgba(139,92,246,0.3)',
        };
      case 'medium':
      default: {
        const p = getMediumPalette(task.id);
        return {
          backgroundColor: p.bg,
          color: p.text,
          borderColor: p.border,
        };
      }
    }
  };

  const badgeStyle = getBadgeStyle(task.priority);

  return (
    <div
      className="group relative bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-foreground pr-8 leading-snug">
          {task.status === 'Done' && (
            <CheckCircle2 className="inline-block h-4 w-4 text-green-500 mr-2 -mt-0.5" />
          )}
          {task.title}
        </h4>

        {/* Quick Actions — appear on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center gap-1 bg-card/95 backdrop-blur-sm rounded-lg p-1 shadow-md border border-border">
          {/* Quick edit/delete actions removed — tasks are read-only when synced */}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {/* Priority Badge — pill-shaped, 30px height, semi-bold, subtle shadow */}
        <span
          style={{
            backgroundColor: badgeStyle.backgroundColor,
            color: badgeStyle.color,
            borderColor: badgeStyle.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '9999px',
            padding: '3px 12px',
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: '22px',
            display: 'inline-block',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            transition: 'opacity 0.15s ease',
          }}
        >
          {task.priority || 'Medium'}
        </span>

        {task.due_date && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {task.status === 'Done' ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : new Date(task.due_date) < new Date() ? (
              <Clock className="h-3.5 w-3.5 text-red-400" />
            ) : (
              <Calendar className="h-3.5 w-3.5" />
            )}
            <span className={new Date(task.due_date) < new Date() && task.status !== 'Done' ? 'text-red-400 font-medium' : ''}>
              {format(new Date(task.due_date), 'MMM d')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
