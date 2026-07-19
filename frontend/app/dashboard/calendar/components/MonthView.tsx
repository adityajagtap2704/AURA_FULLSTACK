'use client';
import { Event } from '@/types';

const GoogleGIcon = () => (
  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: Event) => void;
}

const COLOR_MAP: Record<string, { dot: string, text: string }> = {
  orange: { dot: 'bg-[#F97316]', text: 'text-[#F97316]' },
  blue: { dot: 'bg-[#3B82F6]', text: 'text-[#3B82F6]' },
  green: { dot: 'bg-[#10B981]', text: 'text-[#10B981]' },
  purple: { dot: 'bg-[#8B5CF6]', text: 'text-[#8B5CF6]' },
};

export default function MonthView({
  currentDate,
  events,
  onSelectDate,
  onSelectEvent
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper values
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  
  const today = new Date();

  // Grid slots array (usually 42 elements for 6 rows of 7 days)
  const gridCells: { date: Date; isCurrentMonth: boolean }[] = [];

  // 1. Previous month leading days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    gridCells.push({
      date: new Date(year, month - 1, d),
      isCurrentMonth: false,
    });
  }

  // 2. Current month days
  for (let i = 1; i <= totalDays; i++) {
    gridCells.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // 3. Next month trailing days to pad up to a multiple of 7 (prefer 42 slots total for standard grid alignment)
  const totalSlotsNeeded = 42; 
  const remainingSlots = totalSlotsNeeded - gridCells.length;
  for (let i = 1; i <= remainingSlots; i++) {
    gridCells.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  // Helper to filter events on a specific day
  const parseSafeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const formatted = dateStr.replace(' ', 'T');
    return new Date(formatted);
  };

  // Helper to filter events on a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = parseSafeDate(event.start_time);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
  };

  const formatEventTime = (startTimeStr: string) => {
    const d = parseSafeDate(startTimeStr);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/20 text-center py-2.5">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 grid-rows-6 border-collapse divide-x divide-y divide-border min-h-[680px]">
        {gridCells.map(({ date: cellDate, isCurrentMonth }, idx) => {
          const dayEvents = getEventsForDay(cellDate);
          
          const isToday = 
            today.getDate() === cellDate.getDate() && 
            today.getMonth() === cellDate.getMonth() && 
            today.getFullYear() === cellDate.getFullYear();

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(cellDate)}
              className={`p-2 flex flex-col group min-h-[110px] transition-all cursor-pointer relative ${
                isCurrentMonth 
                  ? 'bg-card hover:bg-muted/10' 
                  : 'bg-muted/10 text-muted-foreground/50 hover:bg-muted/15'
              }`}
            >
              {/* Day Number */}
              <div className="flex justify-between items-center mb-1 select-none">
                <span
                  className={`text-sm font-bold flex items-center justify-center h-6 w-6 rounded-full transition-all ${
                    isToday
                      ? 'bg-[#F97316] text-white shadow shadow-[#F97316]/25'
                      : 'text-foreground'
                  } ${!isCurrentMonth && 'opacity-40'}`}
                >
                  {cellDate.getDate()}
                </span>
                
                {/* Event count dot on small screens */}
                {dayEvents.length > 0 && (
                  <span className="md:hidden h-1.5 w-1.5 bg-[#F97316] rounded-full" />
                )}
              </div>

              {/* Event Labels list (hidden on tiny screens, shown in columns) */}
              <div className="hidden md:flex flex-col gap-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                {dayEvents.slice(0, 3).map((event) => {
                  const colorMeta = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
                  const isGoogleMeet = 
                    event.title.toLowerCase().includes('google meet') ||
                    event.title.toLowerCase().includes('google meeting') ||
                    event.meeting_link?.toLowerCase().includes('meet.google');
                  
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent opening create modal
                        onSelectEvent(event);
                      }}
                      className="text-left p-1.5 rounded-lg hover:bg-muted/60 transition-all select-none group/event"
                      title={`${event.title} (${formatEventTime(event.start_time)})`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {event.source === 'google_calendar' ? (
                          <GoogleGIcon />
                        ) : (
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${colorMeta.dot}`} />
                        )}
                        <span className={`text-[11.5px] font-bold truncate leading-tight group-hover/event:underline ${colorMeta.text}`}>
                          {event.title}
                        </span>
                      </div>
                      
                      {/* Time and Meeting Room below */}
                      <div className="pl-3 text-[10.5px] text-muted-foreground flex flex-col font-semibold leading-normal mt-0.5">
                        <span>{formatEventTime(event.start_time)}</span>
                        {event.meeting_link ? (
                          <span className={`truncate ${isGoogleMeet ? 'text-[#00832F] font-bold' : 'text-[#3B82F6] font-bold'}`}>
                            {isGoogleMeet ? 'Google Meet' : 'Video Call'}
                          </span>
                        ) : event.description ? (
                          <span className="truncate text-muted-foreground/80 font-medium">
                            {event.description}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-[9px] font-bold text-muted-foreground pl-1 mt-0.5">
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
