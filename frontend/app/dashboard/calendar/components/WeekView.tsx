'use client';
import { Event } from '@/types';
import { Clock, Video, MapPin } from 'lucide-react';

const GoogleGIcon = () => (
  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

const COLOR_MAP: Record<string, { bg: string, text: string, timeText: string, border: string }> = {
  orange: { bg: 'bg-[#FFE8CC]', text: 'text-orange-800', timeText: 'text-orange-700', border: 'border-l-[4px] border-[#F97316] border-y-0 border-r-0' },
  blue:   { bg: 'bg-[#DBEAFE]', text: 'text-blue-800',   timeText: 'text-blue-700',   border: 'border-l-[4px] border-[#3B82F6] border-y-0 border-r-0' },
  green:  { bg: 'bg-[#DCFCE7]', text: 'text-green-800',  timeText: 'text-green-700',  border: 'border-l-[4px] border-[#10B981] border-y-0 border-r-0' },
  purple: { bg: 'bg-[#EDE9FE]', text: 'text-purple-800', timeText: 'text-purple-700', border: 'border-l-[4px] border-[#8B5CF6] border-y-0 border-r-0' },
  yellow: { bg: 'bg-[#FEF3C7]', text: 'text-yellow-800', timeText: 'text-yellow-700', border: 'border-l-[4px] border-[#F59E0B] border-y-0 border-r-0' },
  red:    { bg: 'bg-[#FEE2E2]', text: 'text-red-800',    timeText: 'text-red-700',    border: 'border-l-[4px] border-[#EF4444] border-y-0 border-r-0' },
  pink:   { bg: 'bg-[#FCE7F3]', text: 'text-pink-800',   timeText: 'text-pink-700',   border: 'border-l-[4px] border-[#EC4899] border-y-0 border-r-0' },
  grey:   { bg: 'bg-[#F1F5F9]', text: 'text-gray-800',   timeText: 'text-gray-600',   border: 'border-l-[4px] border-[#6B7280] border-y-0 border-r-0' },
};


export default function WeekView({
  currentDate,
  events,
}: WeekViewProps) {
  // Get start of the week (Sunday)
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);

  // Generate 7 days of the week
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push(d);
  }

  const parseSafeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    if (dateStr.endsWith('Z') || dateStr.includes('+') || /-\d{2}:\d{2}$/.test(dateStr)) {
      return new Date(dateStr);
    }
    const formatted = dateStr.replace(' ', 'T');
    return new Date(formatted.includes('T') ? formatted + 'Z' : formatted);
  };

  const formatTime = (dateStr: string) => {
    const d = parseSafeDate(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = parseSafeDate(event.start_time);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    }).sort((a, b) => parseSafeDate(a.start_time).getTime() - parseSafeDate(b.start_time).getTime());
  };

  const today = new Date();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 bg-transparent">
      {weekDays.map((day, idx) => {
        const dayEvents = getEventsForDay(day);
        const isToday =
          today.getDate() === day.getDate() &&
          today.getMonth() === day.getMonth() &&
          today.getFullYear() === day.getFullYear();

        return (
          <div
            key={idx}
            className={`flex flex-col rounded-2xl border bg-card shadow-sm p-4 min-h-[350px] transition-all hover:shadow-md ${
              isToday ? 'border-[#F97316]/50 ring-1 ring-[#F97316]/10' : 'border-border'
            }`}
          >
            {/* Header */}
            <div className="text-center pb-3 border-b border-border group">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p
                className={`text-lg font-bold mt-1 inline-flex items-center justify-center h-8 w-8 rounded-full transition-all ${
                  isToday
                    ? 'bg-[#F97316] text-white shadow shadow-[#F97316]/25'
                    : 'text-foreground group-hover:bg-muted'
                }`}
              >
                {day.getDate()}
              </p>
            </div>

            {/* Events column content */}
            <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[400px]">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => {
                  const colorMeta = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
                  const hasMeeting = !!event.meeting_link;

                  return (
                    <div
                      key={event.id}
                      className={`p-3 border-0 rounded-xl shadow-sm transition-all text-left flex flex-col gap-1.5 ${colorMeta.bg} ${colorMeta.border}`}
                    >
                      <h4 className={`text-[11px] font-bold line-clamp-1 group-hover:opacity-90 flex items-center gap-1.5 leading-none ${colorMeta.text}`}>
                        {event.source === 'google_calendar' && (
                          <span className="h-3.5 w-3.5 rounded bg-white flex items-center justify-center shrink-0 shadow-sm border border-black/5">
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                          </span>
                        )}
                        <span className="truncate">{event.title}</span>
                      </h4>
                      <div className={`space-y-1 text-[9px] ${colorMeta.timeText}`}>
                        <div className="flex items-center gap-1.5">
                          <Clock className={`h-3 w-3 shrink-0 ${colorMeta.text}`} />
                          <span>{formatTime(event.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasMeeting ? (
                            <>
                              <Video className={`h-3 w-3 shrink-0 ${colorMeta.text}`} />
                              <span className={`font-bold truncate ${colorMeta.text}`}>Google Meet</span>
                            </>
                          ) : (
                            <>
                              <MapPin className={`h-3 w-3 shrink-0 ${colorMeta.text}`} />
                              <span className="truncate">
                                {event.source === 'google_calendar' ? 'Google Calendar' : 'Local Event'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-35">
                  <span className="text-[10px] font-bold text-muted-foreground">No events</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
