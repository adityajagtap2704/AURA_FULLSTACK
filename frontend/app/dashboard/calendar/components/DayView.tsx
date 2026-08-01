'use client';
import { Event } from '@/types';
import { Clock, Video, MapPin, Users } from 'lucide-react';

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

interface DayViewProps {
  currentDate: Date;
  events: Event[];
}

/* ── Same premium palette as AgendaView ── */
const COLOR_MAP: Record<string, {
  bg: string; card: string;
  title: string; meta: string;
  badge: string; accent: string;
  dot: string; accentHex: string;
}> = {
  orange: {
    bg:       'bg-gradient-to-r from-[#FFF3E6] to-[#FFF9F3] dark:from-[#1C1208] dark:to-[#1A1410]',
    card:     'border-l-[4px] border-l-[#F97316] border border-[#F97316]/20 dark:border-[#F97316]/25 dark:border-l-[#F97316]',
    title:    'text-[#7C2D00] dark:text-[#FDBA74]',
    meta:     'text-[#9A4A1A] dark:text-[#FB923C]/80',
    badge:    'bg-[#F97316]/12 text-[#C2410C] dark:bg-[#F97316]/20 dark:text-[#FED7AA]',
    accent:   'text-[#EA580C] dark:text-[#FB923C]',
    dot:      'bg-[#F97316]', accentHex: '#F97316',
  },
  blue: {
    bg:       'bg-gradient-to-r from-[#EFF6FF] to-[#F5F9FF] dark:from-[#060D1C] dark:to-[#080F1A]',
    card:     'border-l-[4px] border-l-[#3B82F6] border border-[#3B82F6]/20 dark:border-[#3B82F6]/25 dark:border-l-[#3B82F6]',
    title:    'text-[#1E3A8A] dark:text-[#93C5FD]',
    meta:     'text-[#1D4ED8]/80 dark:text-[#60A5FA]/80',
    badge:    'bg-[#3B82F6]/12 text-[#1D4ED8] dark:bg-[#3B82F6]/20 dark:text-[#BFDBFE]',
    accent:   'text-[#2563EB] dark:text-[#60A5FA]',
    dot:      'bg-[#3B82F6]', accentHex: '#3B82F6',
  },
  green: {
    bg:       'bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF8] dark:from-[#041410] dark:to-[#061310]',
    card:     'border-l-[4px] border-l-[#10B981] border border-[#10B981]/20 dark:border-[#10B981]/25 dark:border-l-[#10B981]',
    title:    'text-[#064E3B] dark:text-[#6EE7B7]',
    meta:     'text-[#047857]/80 dark:text-[#34D399]/75',
    badge:    'bg-[#10B981]/12 text-[#065F46] dark:bg-[#10B981]/20 dark:text-[#A7F3D0]',
    accent:   'text-[#059669] dark:text-[#34D399]',
    dot:      'bg-[#10B981]', accentHex: '#10B981',
  },
  purple: {
    bg:       'bg-gradient-to-r from-[#F5F3FF] to-[#F8F6FF] dark:from-[#0E0A1C] dark:to-[#0C0A18]',
    card:     'border-l-[4px] border-l-[#8B5CF6] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/25 dark:border-l-[#8B5CF6]',
    title:    'text-[#3B0764] dark:text-[#C4B5FD]',
    meta:     'text-[#6D28D9]/80 dark:text-[#A78BFA]/80',
    badge:    'bg-[#8B5CF6]/12 text-[#5B21B6] dark:bg-[#8B5CF6]/20 dark:text-[#DDD6FE]',
    accent:   'text-[#7C3AED] dark:text-[#A78BFA]',
    dot:      'bg-[#8B5CF6]', accentHex: '#8B5CF6',
  },
  yellow: {
    bg:       'bg-gradient-to-r from-[#FFFBEB] to-[#FFFDF5] dark:from-[#1A1200] dark:to-[#181100]',
    card:     'border-l-[4px] border-l-[#F59E0B] border border-[#F59E0B]/20 dark:border-[#F59E0B]/25 dark:border-l-[#F59E0B]',
    title:    'text-[#78350F] dark:text-[#FDE68A]',
    meta:     'text-[#B45309]/80 dark:text-[#FCD34D]/75',
    badge:    'bg-[#F59E0B]/12 text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FEF3C7]',
    accent:   'text-[#D97706] dark:text-[#FBBF24]',
    dot:      'bg-[#F59E0B]', accentHex: '#F59E0B',
  },
  red: {
    bg:       'bg-gradient-to-r from-[#FFF1F1] to-[#FFF5F5] dark:from-[#1A0606] dark:to-[#180505]',
    card:     'border-l-[4px] border-l-[#EF4444] border border-[#EF4444]/20 dark:border-[#EF4444]/25 dark:border-l-[#EF4444]',
    title:    'text-[#7F1D1D] dark:text-[#FCA5A5]',
    meta:     'text-[#B91C1C]/80 dark:text-[#F87171]/75',
    badge:    'bg-[#EF4444]/12 text-[#991B1B] dark:bg-[#EF4444]/20 dark:text-[#FECACA]',
    accent:   'text-[#DC2626] dark:text-[#F87171]',
    dot:      'bg-[#EF4444]', accentHex: '#EF4444',
  },
  pink: {
    bg:       'bg-gradient-to-r from-[#FDF2F8] to-[#FEF5FA] dark:from-[#180610] dark:to-[#16050E]',
    card:     'border-l-[4px] border-l-[#EC4899] border border-[#EC4899]/20 dark:border-[#EC4899]/25 dark:border-l-[#EC4899]',
    title:    'text-[#701A75] dark:text-[#F9A8D4]',
    meta:     'text-[#BE185D]/80 dark:text-[#F472B6]/75',
    badge:    'bg-[#EC4899]/12 text-[#9D174D] dark:bg-[#EC4899]/20 dark:text-[#FBCFE8]',
    accent:   'text-[#DB2777] dark:text-[#F472B6]',
    dot:      'bg-[#EC4899]', accentHex: '#EC4899',
  },
  grey: {
    bg:       'bg-gradient-to-r from-[#F8FAFC] to-[#F9FAFB] dark:from-[#0F1115] dark:to-[#0E1012]',
    card:     'border-l-[4px] border-l-[#6B7280] border border-[#6B7280]/20 dark:border-[#6B7280]/25 dark:border-l-[#6B7280]',
    title:    'text-[#1F2937] dark:text-[#E5E7EB]',
    meta:     'text-[#4B5563]/80 dark:text-[#9CA3AF]/75',
    badge:    'bg-[#6B7280]/10 text-[#374151] dark:bg-[#6B7280]/20 dark:text-[#D1D5DB]',
    accent:   'text-[#4B5563] dark:text-[#9CA3AF]',
    dot:      'bg-[#6B7280]', accentHex: '#6B7280',
  },
};

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function DayView({ currentDate, events }: DayViewProps) {
  const dayEvents = events
    .filter(event => {
      const s = parseSafeDate(event.start_time);
      return s.getFullYear() === currentDate.getFullYear() &&
             s.getMonth() === currentDate.getMonth() &&
             s.getDate() === currentDate.getDate();
    })
    .sort((a, b) => parseSafeDate(a.start_time).getTime() - parseSafeDate(b.start_time).getTime());

  const formatTime = (dateStr: string) =>
    parseSafeDate(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const isToday = new Date().toDateString() === currentDate.toDateString();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-muted/30 dark:bg-white/[0.025] border-b border-border">
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-extrabold text-foreground tracking-tight uppercase">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isToday && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#F97316]/15 text-[#C2410C] dark:bg-[#F97316]/20 dark:text-[#FDBA74] uppercase">
              Today
            </span>
          )}
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted dark:bg-white/[0.06] px-2.5 py-1 rounded-full">
            {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Events */}
      <div className="p-4 space-y-3">
        {dayEvents.length > 0 ? (
          dayEvents.map(event => {
            const c = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
            const hasMeetingLink = !!event.meeting_link;
            const isGoogle = event.source === 'google_calendar';

            return (
              <div
                key={event.id}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between
                            gap-3 px-5 py-4 rounded-xl transition-all duration-200
                            hover:shadow-md dark:hover:shadow-black/30
                            ${c.bg} ${c.card}`}
              >
                {/* Left: icon + content */}
                <div className="flex items-start gap-4 min-w-0">
                  {/* Source icon */}
                  <div
                    className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center
                               bg-white/80 dark:bg-white/[0.07] border border-black/[0.06]
                               dark:border-white/10 shadow-sm"
                    style={{ boxShadow: `0 0 0 2px ${c.accentHex}22` }}
                  >
                    {isGoogle ? <GoogleIcon /> : <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Title + badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-[14px] font-bold leading-snug tracking-tight ${c.title}`}>
                        {event.title}
                      </h4>
                      {isGoogle && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}`}>
                          Google
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className={`text-xs mt-0.5 line-clamp-1 opacity-80 ${c.meta}`}>{event.description}</p>
                    )}

                    {/* Meta row */}
                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11.5px] font-medium ${c.meta}`}>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="font-semibold">
                          {formatTime(event.start_time)}
                          {event.end_time && (
                            <span className="font-normal opacity-75"> → {formatTime(event.end_time)}</span>
                          )}
                        </span>
                      </span>

                      {hasMeetingLink ? (
                        <a
                          href={event.meeting_link!}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className={`flex items-center gap-1.5 font-semibold hover:underline underline-offset-2 ${c.accent}`}
                        >
                          <Video className="h-3.5 w-3.5 shrink-0" />
                          Join meeting
                        </a>
                      ) : (
                        <span className="flex items-center gap-1.5 opacity-75">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {isGoogle ? 'Google Calendar' : 'Local event'}
                        </span>
                      )}

                      {event.attendees && event.attendees.length > 0 && (
                        <span className="flex items-center gap-1.5 opacity-75">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: attendee avatars */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex -space-x-1.5 shrink-0 self-end md:self-center">
                    {event.attendees.slice(0, 4).map((att, idx) => (
                      <div
                        key={idx}
                        title={att.email}
                        className="h-7 w-7 rounded-full bg-white/80 dark:bg-white/10 border-2 border-white/70 dark:border-white/20 flex items-center justify-center text-[9px] font-bold uppercase shadow-sm"
                        style={{ color: c.accentHex }}
                      >
                        {(att.displayName ?? att.email ?? '??').slice(0, 2)}
                      </div>
                    ))}
                    {event.attendees.length > 4 && (
                      <div className="h-7 w-7 rounded-full bg-white/70 dark:bg-white/10 border-2 border-white/70 dark:border-white/20 flex items-center justify-center text-[9px] font-bold text-muted-foreground shadow-sm">
                        +{event.attendees.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl bg-muted/10">
            <div className="h-12 w-12 rounded-2xl bg-[#F97316]/10 dark:bg-[#F97316]/15 flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-[#F97316]" />
            </div>
            <h4 className="font-bold text-foreground text-sm">Nothing scheduled</h4>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto">
              No events for this day. Sync your Google Calendar to import events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
