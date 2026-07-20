import { Task } from '@/types';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

// 8 vibrant pastel palettes for Medium — each task gets a consistent one based on ID hash
const MEDIUM_PALETTES: { bg: string; text: string; border: string }[] = [
  { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' }, // Amber
  { bg: '#FFEDD5', text: '#EA580C', border: '#FED7AA' }, // Orange
  { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' }, // Sky Blue
  { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' }, // Purple
  { bg: '#FCE7F3', text: '#DB2777', border: '#FBCFE8' }, // Pink
  { bg: '#CCFBF1', text: '#0F766E', border: '#99F6E4' }, // Teal
  { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' }, // Indigo
  { bg: '#CFFAFE', text: '#0891B2', border: '#A5F3FC' }, // Cyan
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
          backgroundColor: '#FEE2E2',
          color: '#EF4444',
          borderColor: '#FECACA',
        };
      case 'low':
        return {
          backgroundColor: '#DCFCE7',
          color: '#16A34A',
          borderColor: '#BBF7D0',
        };
      case 'critical':
        return {
          backgroundColor: '#EDE9FE',
          color: '#7C3AED',
          borderColor: '#DDD6FE',
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
