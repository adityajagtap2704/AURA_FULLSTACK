'use client';
import { Clock, MapPin, Video, Calendar, ArrowRight, VideoOff } from 'lucide-react';
import { Event } from '@/types';

interface UpcomingEventsPanelProps {
  events: Event[];
  onViewAllClick: () => void;
}

/* ── Per-colour tokens for the sidebar panel ── */
const COLOR_MAP: Record<string, { accentHex: string; pill: string; iconRing: string; titleHover: string }> = {
  orange: { accentHex: '#F97316', pill: 'bg-[#F97316]/12 text-[#C2410C] dark:bg-[#F97316]/20 dark:text-[#FDBA74]', iconRing: 'border-[#F97316]/40 dark:border-[#F97316]/30 text-[#F97316]', titleHover: 'group-hover:text-[#EA580C] dark:group-hover:text-[#FB923C]' },
  blue:   { accentHex: '#3B82F6', pill: 'bg-[#3B82F6]/12 text-[#1D4ED8] dark:bg-[#3B82F6]/20 dark:text-[#BFDBFE]', iconRing: 'border-[#3B82F6]/40 dark:border-[#3B82F6]/30 text-[#3B82F6]', titleHover: 'group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA]' },
  green:  { accentHex: '#10B981', pill: 'bg-[#10B981]/12 text-[#065F46] dark:bg-[#10B981]/20 dark:text-[#A7F3D0]', iconRing: 'border-[#10B981]/40 dark:border-[#10B981]/30 text-[#10B981]', titleHover: 'group-hover:text-[#059669] dark:group-hover:text-[#34D399]' },
  purple: { accentHex: '#8B5CF6', pill: 'bg-[#8B5CF6]/12 text-[#5B21B6] dark:bg-[#8B5CF6]/20 dark:text-[#DDD6FE]', iconRing: 'border-[#8B5CF6]/40 dark:border-[#8B5CF6]/30 text-[#8B5CF6]', titleHover: 'group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA]' },
  yellow: { accentHex: '#F59E0B', pill: 'bg-[#F59E0B]/12 text-[#92400E] dark:bg-[#F59E0B]/20 dark:text-[#FEF3C7]', iconRing: 'border-[#F59E0B]/40 dark:border-[#F59E0B]/30 text-[#F59E0B]', titleHover: 'group-hover:text-[#D97706] dark:group-hover:text-[#FBBF24]' },
  red:    { accentHex: '#EF4444', pill: 'bg-[#EF4444]/12 text-[#991B1B] dark:bg-[#EF4444]/20 dark:text-[#FECACA]', iconRing: 'border-[#EF4444]/40 dark:border-[#EF4444]/30 text-[#EF4444]', titleHover: 'group-hover:text-[#DC2626] dark:group-hover:text-[#F87171]' },
  pink:   { accentHex: '#EC4899', pill: 'bg-[#EC4899]/12 text-[#9D174D] dark:bg-[#EC4899]/20 dark:text-[#FBCFE8]', iconRing: 'border-[#EC4899]/40 dark:border-[#EC4899]/30 text-[#EC4899]', titleHover: 'group-hover:text-[#DB2777] dark:group-hover:text-[#F472B6]' },
  grey:   { accentHex: '#6B7280', pill: 'bg-[#6B7280]/10 text-[#374151] dark:bg-[#6B7280]/20 dark:text-[#D1D5DB]',  iconRing: 'border-[#6B7280]/35 dark:border-[#6B7280]/30 text-[#6B7280]', titleHover: 'group-hover:text-[#4B5563] dark:group-hover:text-[#9CA3AF]' },
};

const GoogleMeetLogo = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="13" height="14" rx="2.5" fill="#00832F" />
    <polygon points="16,11 22,6.5 22,15.5 16,11" fill="#0066DA" />
    <rect x="3" y="4" width="13" height="3" rx="1" fill="#26A69A" />
    <rect x="3" y="15" width="13" height="3" rx="1" fill="#00A756" />
    <rect x="8" y="9" width="3.5" height="2.5" rx="0.5" fill="#FFBA00" />
  </svg>
);

const parseSafeDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  try {
    const parts = dateStr.replace(' ', 'T').split('T');
    const datePart = parts[0];
    let timePart = parts[1] || '00:00:00';
    timePart = timePart.split(/[Z+]/)[0];
    const lastMinus = timePart.lastIndexOf('-');
    if (lastMinus > timePart.lastIndexOf(':')) timePart = timePart.substring(0, lastMinus);
    return new Date(`${datePart}T${timePart}`);
  } catch {
    return new Date(dateStr);
  }
};

export default function UpcomingEventsPanel({ events, onViewAllClick }: UpcomingEventsPanelProps) {
  const now = new Date();

  const upcoming = [...events]
    .filter(event => {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      return parseSafeDate(event.start_time) >= todayStart;
    })
    .sort((a, b) => parseSafeDate(a.start_time).getTime() - parseSafeDate(b.start_time).getTime())
    .slice(0, 5);

  const formatTime = (dateStr: string) =>
    parseSafeDate(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const formatDay = (dateStr: string) => {
    const d = parseSafeDate(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-card border border-border rounded-2xl flex flex-col shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-border bg-muted/30 dark:bg-white/[0.02] flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-foreground tracking-tight">
          Upcoming Events
        </h3>
        {upcoming.length > 0 && (
          <span className="text-[10px] font-bold bg-[#F97316]/15 text-[#C2410C] dark:bg-[#F97316]/20 dark:text-[#FDBA74] px-2 py-0.5 rounded-full">
            {upcoming.length}
          </span>
        )}
      </div>

      {/* ── List ── */}
      <div className="flex-1 divide-y divide-border/60 dark:divide-border/40 overflow-y-auto">
        {upcoming.length > 0 ? (
          upcoming.map((event) => {
            const c = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
            const isGoogleMeet =
              event.title.toLowerCase().includes('google meet') ||
              event.meeting_link?.toLowerCase().includes('meet.google');
            const hasMeetingLink = !!event.meeting_link;
            const dayLabel = formatDay(event.start_time);
            const isToday = dayLabel === 'Today';

            return (
              <div
                key={event.id}
                className="group flex items-center gap-3.5 px-4 py-3.5 hover:bg-muted/40 dark:hover:bg-white/[0.03] transition-colors cursor-default"
              >
                {/* Coloured icon box */}
                <div
                  className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center
                               border-2 bg-transparent transition-transform group-hover:scale-105 ${c.iconRing}`}
                >
                  {isGoogleMeet ? <GoogleMeetLogo /> : <Calendar className="h-4 w-4" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <p className={`text-[12.5px] font-bold text-foreground truncate leading-snug transition-colors ${c.titleHover}`}>
                    {event.title}
                  </p>

                  {/* Time */}
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3 shrink-0 opacity-60" />
                    <span>
                      <span className={`font-semibold ${isToday ? 'text-[#F97316] dark:text-[#FB923C]' : ''}`}>
                        {dayLabel}
                      </span>
                      {' · '}{formatTime(event.start_time)}
                    </span>
                  </p>

                  {/* Source / type row */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${c.pill}`}>
                      {event.source === 'google_calendar' ? 'Google' : 'Aura'}
                    </span>
                    <span className="text-[10px] text-muted-foreground/65 font-medium">
                      {hasMeetingLink
                        ? isGoogleMeet ? '· Google Meet' : '· Video call'
                        : '· Calendar event'}
                    </span>
                  </div>
                </div>

                {/* Right: meeting icon shortcut */}
                {hasMeetingLink && (
                  <a
                    href={event.meeting_link!}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Join meeting"
                    className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center
                               bg-[#F97316]/10 dark:bg-[#F97316]/15 text-[#F97316]
                               hover:bg-[#F97316]/20 dark:hover:bg-[#F97316]/25 transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 px-4">
            <div className="h-12 w-12 rounded-2xl bg-muted dark:bg-white/[0.05] flex items-center justify-center mx-auto mb-3">
              <VideoOff className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs font-bold text-foreground/70">No upcoming events</p>
            <p className="text-[10.5px] text-muted-foreground/55 mt-1 leading-relaxed">
              Schedule an event or sync from Google.
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-border bg-muted/20 dark:bg-white/[0.02]">
        <button
          onClick={onViewAllClick}
          className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold
                     text-[#F97316] hover:text-[#EA580C] dark:text-[#FB923C] dark:hover:text-[#FDBA74]
                     transition-colors group/btn"
        >
          View full calendar
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
