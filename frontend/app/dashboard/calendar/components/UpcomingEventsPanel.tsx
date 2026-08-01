'use client';
import { Clock, Video, Calendar, ArrowRight, CalendarOff } from 'lucide-react';
import { Event } from '@/types';
import { getEventAccent } from '@/lib/calendarColors';

interface UpcomingEventsPanelProps { events: Event[]; onViewAllClick: () => void; }

const GoogleMeetLogo = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="13" height="14" rx="2.5" fill="#00832F"/>
    <polygon points="16,11 22,6.5 22,15.5 16,11" fill="#0066DA"/>
    <rect x="3" y="4" width="13" height="3" rx="1" fill="#26A69A"/>
    <rect x="3" y="15" width="13" height="3" rx="1" fill="#00A756"/>
    <rect x="8" y="9" width="3.5" height="2.5" rx="0.5" fill="#FFBA00"/>
  </svg>
);

const parseSafeDate = (s: string) => {
  if (!s) return new Date();
  try {
    const p = s.replace(' ', 'T').split('T');
    let t = (p[1] || '00:00:00').split(/[Z+]/)[0];
    const lm = t.lastIndexOf('-');
    if (lm > t.lastIndexOf(':')) t = t.substring(0, lm);
    return new Date(`${p[0]}T${t}`);
  } catch { return new Date(s); }
};

export default function UpcomingEventsPanel({ events, onViewAllClick }: UpcomingEventsPanelProps) {
  const now = new Date();
  const upcoming = [...events]
    .filter(e => {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      return parseSafeDate(e.start_time) >= start;
    })
    .sort((a, b) => parseSafeDate(a.start_time).getTime() - parseSafeDate(b.start_time).getTime())
    .slice(0, 5);

  const fmtTime = (s: string) => parseSafeDate(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const fmtDay = (s: string) => {
    const d = parseSafeDate(s), t = new Date(), tom = new Date();
    tom.setDate(t.getDate() + 1);
    if (d.toDateString() === t.toDateString()) return 'Today';
    if (d.toDateString() === tom.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8DDD2] dark:border-border bg-white dark:bg-card shadow-sm flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8DDD2] dark:border-border bg-[#FAF7F4] dark:bg-white/[0.02]">
        <h3 className="text-[13px] font-black text-[#111827] dark:text-foreground tracking-tight">Upcoming Events</h3>
        {upcoming.length > 0 && (
          <span className="h-5 min-w-[1.25rem] px-1.5 rounded-full flex items-center justify-center text-[10px] font-black bg-[#F97316] text-white">
            {upcoming.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 divide-y divide-[#E8DDD2]/60 dark:divide-border/50 overflow-y-auto">
        {upcoming.length > 0 ? upcoming.map(event => {
          const a = getEventAccent(event.id, event.title, event.color);
          const isGMeet = event.title.toLowerCase().includes('google meet') ||
                          event.meeting_link?.toLowerCase().includes('meet.google');
          const hasLink = !!event.meeting_link;
          const day = fmtDay(event.start_time);
          const isToday = day === 'Today';

          return (
            <div key={event.id}
                 className="flex items-center gap-3 px-4 py-3 hover:bg-[#FAF7F4] dark:hover:bg-white/[0.025]
                            transition-colors cursor-default group">
              {/* Icon */}
              <div
                className="h-9 w-9 rounded-xl shrink-0 flex items-center justify-center
                           bg-white dark:bg-[#1E1E1E] border border-[#E8DDD2] dark:border-border
                           transition-transform group-hover:scale-105"
                style={{ boxShadow: `0 0 0 2px ${a.hex}1A` }}
              >
                {isGMeet
                  ? <GoogleMeetLogo />
                  : <Calendar className="h-4 w-4" style={{ color: a.hex }} />}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-bold text-[#111827] dark:text-foreground truncate leading-snug
                               group-hover:text-[#B7792B] dark:group-hover:text-[#C98A2E] transition-colors">
                  {event.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 shrink-0 text-[#6B7280]/50 dark:text-muted-foreground/45" />
                  <span className="text-[10.5px] text-[#6B7280] dark:text-muted-foreground">
                    <span className={`font-semibold ${isToday ? 'text-[#F97316]' : ''}`}>{day}</span>
                    {' · '}{fmtTime(event.start_time)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: a.lightBg, color: a.lightText }}
                  >
                    {event.source === 'google_calendar' ? 'Google' : 'Aura'}
                  </span>
                  <span className="text-[10px] text-[#6B7280]/55 dark:text-muted-foreground/50">
                    {hasLink ? (isGMeet ? '· Meet' : '· Video') : '· Calendar event'}
                  </span>
                </div>
              </div>

              {/* Join btn */}
              {hasLink && (
                <a
                  href={event.meeting_link!} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center
                             bg-[#3B82F6]/10 dark:bg-[#3B82F6]/15 text-[#3B82F6]
                             hover:bg-[#3B82F6]/20 transition-colors"
                  title="Join"
                >
                  <Video className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          );
        }) : (
          <div className="flex flex-col items-center py-10 px-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-[#F3F4F6] dark:bg-muted flex items-center justify-center mb-3">
              <CalendarOff className="h-5 w-5 text-[#6B7280]/40 dark:text-muted-foreground/35" />
            </div>
            <p className="text-xs font-bold text-[#111827]/70 dark:text-foreground/70">No upcoming events</p>
            <p className="text-[10.5px] text-[#6B7280]/55 dark:text-muted-foreground/50 mt-1">Sync Google Calendar to see events.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#E8DDD2] dark:border-border bg-[#FAF7F4]/50 dark:bg-white/[0.015]">
        <button
          onClick={onViewAllClick}
          className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold
                     text-[#B7792B] hover:text-[#92350A] dark:text-[#C98A2E] dark:hover:text-[#D9A84F]
                     transition-colors group/btn"
        >
          View full calendar
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
