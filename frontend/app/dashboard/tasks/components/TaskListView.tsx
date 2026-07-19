import { Task } from '@/types';
import { Calendar, CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const MEDIUM_PALETTES = [
  { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  { bg: '#FFEDD5', text: '#EA580C', border: '#FED7AA' },
  { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
  { bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' },
  { bg: '#FCE7F3', text: '#DB2777', border: '#FBCFE8' },
  { bg: '#CCFBF1', text: '#0F766E', border: '#99F6E4' },
  { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
  { bg: '#CFFAFE', text: '#0891B2', border: '#A5F3FC' },
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
      return { backgroundColor: '#FEE2E2', color: '#EF4444', borderColor: '#FECACA' };
    case 'low':
      return { backgroundColor: '#DCFCE7', color: '#16A34A', borderColor: '#BBF7D0' };
    case 'critical':
      return { backgroundColor: '#EDE9FE', color: '#7C3AED', borderColor: '#DDD6FE' };
    case 'medium':
    default: {
      const p = getMediumPalette(taskId || '');
      return { backgroundColor: p.bg, color: p.text, borderColor: p.border };
    }
  }
}

interface TaskListViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TaskListView({ tasks, onEdit, onDelete, emptyTitle, emptyDescription }: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-card/20" style={{ border: '2px dashed rgba(0,0,0,0.08)' }}>
        <CheckCircle2 className="h-10 w-10 mb-3" style={{ color: 'rgba(0,0,0,0.2)' }} />
        <h3 className="font-bold text-foreground">{emptyTitle || 'No tasks found'}</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-xs text-center">
          {emptyDescription || 'Try adjusting your search or filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)', background: 'white' }}>
        {tasks.map((task, index) => {
          const badge = getBadgeStyle(task.priority, task.id);
          const isDone = task.status === 'Done';
          const isLast = index === tasks.length - 1;

          return (
            <div
              key={task.id}
              onClick={() => onEdit(task)}
              className="group flex items-center justify-between cursor-pointer transition-colors duration-150"
              style={{
                padding: '10px 16px',
                borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.05)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Left: icon + title + meta */}
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-4">
                {/* Status icon */}
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="h-4.5 w-4.5" style={{ color: '#22c55e', width: 18, height: 18 }} />
                  ) : (
                    <Clock style={{ color: 'rgba(0,0,0,0.25)', width: 18, height: 18 }} />
                  )}
                </div>

                {/* Title + meta row */}
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{
                      color: isDone ? 'rgba(0,0,0,0.35)' : '#1a1a1a',
                      textDecoration: 'none',
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
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        <Calendar style={{ width: 11, height: 11 }} />
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </span>
                    )}

                    {/* Source */}
                    <span className="text-[11px] capitalize" style={{ color: 'rgba(0,0,0,0.3)' }}>
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
                        ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
                        : task.status === 'In Progress'
                        ? { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }
                        : { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' }),
                    }}
                  >
                    {task.status}
                  </span>
                )}

                {/* Hover actions */}
                <div
                  className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: 'rgba(0,0,0,0.35)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Edit2 style={{ width: 13, height: 13 }} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: 'rgba(0,0,0,0.35)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fff1f2';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(0,0,0,0.35)';
                    }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
