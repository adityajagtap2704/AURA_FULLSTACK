'use client';
import { Event } from '@/types';
import { Clock, Video, MapPin, Users } from 'lucide-react';

const parseSafeDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const formatted = dateStr.replace(' ', 'T');
  return new Date(formatted);
};

interface DayViewProps {
  currentDate: Date;
  events: Event[];
}

const COLOR_MAP: Record<string, { bg: string, text: string, timeText: string, border: string, dot: string }> = {
  orange: { bg: 'bg-[#FFE8CC]', text: 'text-orange-800', timeText: 'text-orange-700', border: 'border-l-[6px] border-[#F97316] border-y-0 border-r-0', dot: 'bg-[#F97316]' },
  blue:   { bg: 'bg-[#DBEAFE]', text: 'text-blue-800',   timeText: 'text-blue-700',   border: 'border-l-[6px] border-[#3B82F6] border-y-0 border-r-0', dot: 'bg-[#3B82F6]' },
  green:  { bg: 'bg-[#DCFCE7]', text: 'text-green-800',  timeText: 'text-green-700',  border: 'border-l-[6px] border-[#10B981] border-y-0 border-r-0', dot: 'bg-[#10B981]' },
  purple: { bg: 'bg-[#EDE9FE]', text: 'text-purple-800', timeText: 'text-purple-700', border: 'border-l-[6px] border-[#8B5CF6] border-y-0 border-r-0', dot: 'bg-[#8B5CF6]' },
  yellow: { bg: 'bg-[#FEF3C7]', text: 'text-yellow-800', timeText: 'text-yellow-700', border: 'border-l-[6px] border-[#F59E0B] border-y-0 border-r-0', dot: 'bg-[#F59E0B]' },
  red:    { bg: 'bg-[#FEE2E2]', text: 'text-red-800',    timeText: 'text-red-700',    border: 'border-l-[6px] border-[#EF4444] border-y-0 border-r-0', dot: 'bg-[#EF4444]' },
  pink:   { bg: 'bg-[#FCE7F3]', text: 'text-pink-800',   timeText: 'text-pink-700',   border: 'border-l-[6px] border-[#EC4899] border-y-0 border-r-0', dot: 'bg-[#EC4899]' },
  grey:   { bg: 'bg-[#F1F5F9]', text: 'text-gray-800',   timeText: 'text-gray-600',   border: 'border-l-[6px] border-[#6B7280] border-y-0 border-r-0', dot: 'bg-[#6B7280]' },
};


export default function DayView({
  currentDate,
  events,
}: DayViewProps) {
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

  const dayEvents = getEventsForDay(currentDate);

  const formatTime = (dateStr: string) => {
    const d = parseSafeDate(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-border pb-4 mb-6">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Schedule for {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {dayEvents.length > 0 ? (
          dayEvents.map((event) => {
            const colorMeta = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
            const hasMeetingLink = !!event.meeting_link;

            return (
              <div
                key={event.id}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-0 rounded-2xl transition-all shadow-sm ${colorMeta.bg} ${colorMeta.border}`}
              >
                {/* Left block - Time and Title */}
                <div className="flex items-start gap-4">
                  {event.source === 'google_calendar' ? (
                    <div className="h-4.5 w-4.5 rounded bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                    </div>
                  ) : (
                    <span className={`h-3 w-3 rounded-full mt-1.5 shrink-0 ${colorMeta.dot}`} />
                  )}
                  
                  <div className="space-y-1.5">
                    <h4 className={`text-sm font-bold transition-all ${colorMeta.text}`}>
                      {event.title}
                    </h4>
                    
                    {event.description && (
                      <p className={`text-xs opacity-85 line-clamp-2 max-w-lg ${colorMeta.text}`}>
                        {event.description}
                      </p>
                    )}

                    <div className={`flex flex-wrap items-center gap-4 text-[11px] ${colorMeta.timeText} pt-1`}>
                      {/* Time */}
                      <span className="flex items-center gap-1">
                        <Clock className={`h-3.5 w-3.5 shrink-0 ${colorMeta.text}`} />
                        <span>
                          {formatTime(event.start_time)}
                          {event.end_time && ` - ${formatTime(event.end_time)}`}
                        </span>
                      </span>

                      {/* Location or meeting link */}
                      {hasMeetingLink ? (
                        <a
                          href={event.meeting_link!}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`flex items-center gap-1 font-bold hover:underline ${colorMeta.text}`}
                        >
                          <Video className="h-3.5 w-3.5 shrink-0" />
                          Google Meet
                        </a>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className={`h-3.5 w-3.5 shrink-0 ${colorMeta.text}`} />
                          <span>{event.source === 'google_calendar' ? 'Google Calendar Event' : 'Local Event'}</span>
                        </span>
                      )}

                      {/* Attendees */}
                      {event.attendees && event.attendees.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className={`h-3.5 w-3.5 shrink-0 ${colorMeta.text}`} />
                          <span>{event.attendees.length} attendees</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right block - Actions and Attendee lists */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex -space-x-1 overflow-hidden">
                      {event.attendees.slice(0, 3).map((att, idx) => (
                        <div
                          key={idx}
                          title={att.email}
                          className="h-6 w-6 rounded-full bg-white/70 border border-black/5 flex items-center justify-center text-[9px] font-bold text-foreground/80 uppercase"
                        >
                          {att.displayName ? att.displayName.slice(0, 2) : att.email?.slice(0, 2)}
                        </div>
                      ))}
                      {event.attendees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-white/85 border border-black/5 flex items-center justify-center text-[9px] font-bold text-foreground/80">
                          +{event.attendees.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {/* Edit/Delete removed — calendar is read-only for synced events */}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/10">
            <Clock className="h-10 w-10 text-muted-foreground/35 mx-auto mb-3" />
            <h4 className="font-bold text-foreground">No events scheduled today</h4>
            <p className="text-xs text-muted-foreground mt-1">No events available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
