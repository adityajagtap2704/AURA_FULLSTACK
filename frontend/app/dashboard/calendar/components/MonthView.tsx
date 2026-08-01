'use client';
import { Event } from '@/types';

const GoogleGIcon = () => (
  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
}

/* ── Per-colour event pill tokens ── */
const COLOR_MAP: Record<string, {
  dot: string;
  pill: string;        /* event row bg */
  pillText: string;    /* event row text */
  pillBorder: string;  /* left accent */
}> = {
  orange: { dot: 'bg-[#F97316]', pill: 'bg-[#FFF3E6] dark:bg-[#F97316]/14', pillText: 'text-[#7C2D00] dark:text-[#FDBA74]', pillBorder: 'border-l-[2.5px] border-[#F97316]' },
  blue:   { dot: 'bg-[#3B82F6]', pill: 'bg-[#EFF6FF] dark:bg-[#3B82F6]/14', pillText: 'text-[#1E3A8A] dark:text-[#93C5FD]', pillBorder: 'border-l-[2.5px] border-[#3B82F6]' },
  green:  { dot: 'bg-[#10B981]', pill: 'bg-[#ECFDF5] dark:bg-[#10B981]/14', pillText: 'text-[#064E3B] dark:text-[#6EE7B7]', pillBorder: 'border-l-[2.5px] border-[#10B981]' },
  purple: { dot: 'bg-[#8B5CF6]', pill: 'bg-[#F5F3FF] dark:bg-[#8B5CF6]/14', pillText: 'text-[#3B0764] dark:text-[#C4B5FD]', pillBorder: 'border-l-[2.5px] border-[#8B5CF6]' },
  yellow: { dot: 'bg-[#F59E0B]', pill: 'bg-[#FFFBEB] dark:bg-[#F59E0B]/14', pillText: 'text-[#78350F] dark:text-[#FDE68A]', pillBorder: 'border-l-[2.5px] border-[#F59E0B]' },
  red:    { dot: 'bg-[#EF4444]', pill: 'bg-[#FFF1F1] dark:bg-[#EF4444]/14', pillText: 'text-[#7F1D1D] dark:text-[#FCA5A5]', pillBorder: 'border-l-[2.5px] border-[#EF4444]' },
  pink:   { dot: 'bg-[#EC4899]', pill: 'bg-[#FDF2F8] dark:bg-[#EC4899]/14', pillText: 'text-[#701A75] dark:text-[#F9A8D4]', pillBorder: 'border-l-[2.5px] border-[#EC4899]' },
  grey:   { dot: 'bg-[#6B7280]', pill: 'bg-[#F8FAFC] dark:bg-[#6B7280]/14', pillText: 'text-[#1F2937] dark:text-[#E5E7EB]', pillBorder: 'border-l-[2.5px] border-[#6B7280]' },
};

const parseSafeDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  try {
    const parts = dateStr.replace(' ', 'T').split('T');
    let timePart = (parts[1] || '00:00:00').split(/[Z+]/)[0];
    const lm = timePart.lastIndexOf('-');
    if (lm > timePart.lastIndexOf(':')) timePart = timePart.substring(0, lm);
    return new Date(`${parts[0]}T${timePart}`);
  } catch { return new Date(dateStr); }
};

export default function MonthView({ currentDate, events }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotal = new Date(year, month, 0).getDate();

  const gridCells: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayIndex - 1; i >= 0; i--)
    gridCells.push({ date: new Date(year, month - 1, prevMonthTotal - i), isCurrentMonth: false });
  for (let i = 1; i <= totalDays; i++)
    gridCells.push({ date: new Date(year, month, i), isCurrentMonth: true });
  while (gridCells.length < 42)
    gridCells.push({ date: new Date(year, month + 1, gridCells.length - firstDayIndex - totalDays + 1), isCurrentMonth: false });

  const getEventsForDay = (date: Date) =>
    events.filter(e => {
      const s = parseSafeDate(e.start_time);
      return s.getFullYear() === date.getFullYear() &&
             s.getMonth() === date.getMonth() &&
             s.getDate() === date.getDate();
    });

  const formatEventTime = (str: string) =>
    parseSafeDate(str).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/25 dark:bg-white/[0.025]">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="py-2.5 text-center">
            <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">{d}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border/60 dark:divide-border/40 min-h-[640px]">
        {gridCells.map(({ date: cellDate, isCurrentMonth }, idx) => {
          const dayEvents = getEventsForDay(cellDate);
          const isToday = today.toDateString() === cellDate.toDateString();
          const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;

          return (
            <div
              key={idx}
              className={`p-1.5 flex flex-col min-h-[100px] transition-colors duration-100
                ${isCurrentMonth
                  ? isWeekend
                    ? 'bg-card dark:bg-card hover:bg-muted/20 dark:hover:bg-white/[0.025]'
                    : 'bg-card dark:bg-card hover:bg-muted/15 dark:hover:bg-white/[0.02]'
                  : 'bg-muted/25 dark:bg-white/[0.015] hover:bg-muted/30 dark:hover:bg-white/[0.025]'}
                ${isToday ? 'ring-1 ring-inset ring-[#F97316]/30 dark:ring-[#F97316]/20' : ''}`}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1 px-0.5 select-none">
                <span
                  className={`text-[12px] font-bold flex items-center justify-center h-6 w-6 rounded-full transition-colors
                    ${isToday
                      ? 'bg-[#F97316] text-white shadow shadow-[#F97316]/35 font-extrabold'
                      : isCurrentMonth
                        ? isWeekend ? 'text-muted-foreground' : 'text-foreground'
                        : 'text-muted-foreground/35'}`}
                >
                  {cellDate.getDate()}
                </span>
                {/* Mobile dot indicator */}
                {dayEvents.length > 0 && (
                  <span className="md:hidden h-1.5 w-1.5 rounded-full bg-[#F97316] mr-0.5 opacity-70" />
                )}
              </div>

              {/* Event pills */}
              <div className="hidden md:flex flex-col gap-0.5 overflow-hidden max-h-[80px]">
                {dayEvents.slice(0, 3).map(event => {
                  const c = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
                  const isGoogleMeet =
                    event.title.toLowerCase().includes('google meet') ||
                    event.meeting_link?.toLowerCase().includes('meet.google');

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-left overflow-hidden
                                  cursor-default transition-all hover:brightness-95
                                  ${c.pill} ${c.pillBorder}`}
                      title={`${event.title} · ${formatEventTime(event.start_time)}`}
                    >
                      {event.source === 'google_calendar'
                        ? <GoogleGIcon />
                        : <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
                      }
                      <span className={`text-[10.5px] font-bold truncate leading-snug ${c.pillText}`}>
                        {event.title}
                      </span>
                      <span className="text-[9.5px] text-muted-foreground/60 ml-auto shrink-0 font-medium pl-1">
                        {formatEventTime(event.start_time)}
                      </span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-[9.5px] font-bold text-muted-foreground/60 pl-1.5 mt-0.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
