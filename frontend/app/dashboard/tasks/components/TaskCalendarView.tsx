import { useMemo } from 'react';
import { Task } from '@/types';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isToday, isSameDay, startOfWeek, endOfWeek, addDays,
} from 'date-fns';
import { CheckCircle2, Calendar as CalIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const MEDIUM_PALETTES = [
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#FFEDD5', text: '#EA580C' },
  { bg: '#DBEAFE', text: '#2563EB' },
  { bg: '#EDE9FE', text: '#7C3AED' },
  { bg: '#FCE7F3', text: '#DB2777' },
  { bg: '#CCFBF1', text: '#0F766E' },
  { bg: '#E0E7FF', text: '#4F46E5' },
  { bg: '#CFFAFE', text: '#0891B2' },
];

function getMediumPalette(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return MEDIUM_PALETTES[Math.abs(hash) % MEDIUM_PALETTES.length];
}

function getPillStyle(task: Task): { bg: string; text: string } {
  if (task.status === 'Done') return { bg: '#DCFCE7', text: '#16A34A' };
  switch (task.priority?.toLowerCase()) {
    case 'high': return { bg: '#FEE2E2', text: '#EF4444' };
    case 'low': return { bg: '#DCFCE7', text: '#16A34A' };
    case 'critical': return { bg: '#EDE9FE', text: '#7C3AED' };
    default: return getMediumPalette(task.id);
  }
}

interface TaskCalendarViewProps {
  tasks: Task[];
}

export function TaskCalendarView({ tasks }: TaskCalendarViewProps) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Full calendar grid — start from Sunday of first week, end at Saturday of last week
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!t.due_date) return;
      const key = format(new Date(t.due_date), 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const noDateTasks = tasks.filter((t) => !t.due_date);
  const totalWithDates = tasks.filter((t) => t.due_date).length;

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full overflow-hidden gap-3">
      {/* Compact Month Header */}
      <div className="flex items-center justify-between shrink-0 px-0.5">
        <div className="flex items-center gap-2">
          <CalIcon className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground tracking-tight">{format(now, 'MMMM yyyy')}</h2>
          <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {totalWithDates} tasks
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FEE2E2] inline-block" />High</span>
          <span className="flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-[#DCFCE7] inline-block" />Done</span>
          <span className="flex items-center gap-1 ml-2"><span className="w-2 h-2 rounded-full bg-[#DBEAFE] inline-block" />Medium</span>
        </div>
      </div>

      {/* Calendar Grid — compact fixed height */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-xl border border-border/60 shadow-sm bg-card/30" style={{ maxHeight: '55vh' }}>
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-border/50 shrink-0">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-1 py-1 text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-card/60">
              {d}
            </div>
          ))}
        </div>

        {/* Day Grid — fixed height rows to fill space */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr min-h-0">
          {allDays.map((day, idx) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[key] || [];
            const today = isToday(day);
            const isCurrentMonth = day.getMonth() === now.getMonth();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const isLastRow = idx >= allDays.length - 7;
            const isLastCol = (idx + 1) % 7 === 0;

            return (
              <div
                key={key}
                className={`relative flex flex-col gap-px p-0.5 transition-colors min-h-0 overflow-hidden
                  ${!isLastRow ? 'border-b border-border/30' : ''}
                  ${!isLastCol ? 'border-r border-border/30' : ''}
                  ${today ? 'bg-primary/5' : isWeekend ? 'bg-muted/20' : 'bg-transparent'}
                  hover:bg-accent/20
                `}
              >
                {/* Day number */}
                <div className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-semibold shrink-0 leading-none
                  ${today
                    ? 'bg-primary text-white'
                    : isCurrentMonth
                    ? 'text-foreground/80'
                    : 'text-muted-foreground/40'
                  }`}
                >
                  {format(day, 'd')}
                </div>

                {/* Task pills */}
                <div className="flex flex-col gap-px min-h-0 overflow-hidden flex-1">
                  {dayTasks.slice(0, 2).map((t) => {
                    const { bg, text } = getPillStyle(t);
                    return (
                      <div
                        key={t.id}
                        style={{ backgroundColor: bg, color: text }}
                        className="w-full text-left rounded px-1 py-px leading-snug transition-opacity shrink-0"
                        title={t.title}
                      >
                        <span
                          className="text-[8px] font-semibold block truncate"
                          style={{ textDecoration: 'none' }}
                        >
                          {t.title}
                        </span>
                      </button>
                    );
                  })}
                  {dayTasks.length > 2 && (
                    <span className="text-[8px] font-bold text-muted-foreground px-0.5 leading-none mt-px shrink-0">
                      +{dayTasks.length - 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* No Due Date section — compact horizontal chips */}
      {noDateTasks.length > 0 && (
        <div className="shrink-0 px-0.5">
          <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
            No due date · {noDateTasks.length}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {noDateTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border rounded-full text-[11px] font-medium text-foreground transition-all"
              >
                {t.status === 'Done' && <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />}
                <span className={t.status === 'Done' ? 'line-through text-muted-foreground' : ''}>{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
