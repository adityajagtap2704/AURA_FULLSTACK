'use client';
import { Clock, MapPin, Video, Calendar, ArrowRight, VideoOff } from 'lucide-react';
import { Event } from '@/types';

interface UpcomingEventsPanelProps {
  events: Event[];
  onViewAllClick: () => void;
}

const COLOR_MAP: Record<string, { text: string, border: string }> = {
  orange: { text: 'text-[#F97316]', border: 'border-[#F97316]/60 dark:border-[#F97316]/40' },
  blue: { text: 'text-[#3B82F6]', border: 'border-[#3B82F6]/60 dark:border-[#3B82F6]/40' },
  green: { text: 'text-[#10B981]', border: 'border-[#10B981]/60 dark:border-[#10B981]/40' },
  purple: { text: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]/60 dark:border-[#8B5CF6]/40' },
};

// Colorful Google Meet Logo SVG
const GoogleMeetLogo = ({ className = "h-5.5 w-5.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="13" height="14" rx="2.5" fill="#00832F" />
    <polygon points="16,11 22,6.5 22,15.5 16,11" fill="#0066DA" />
    <rect x="3" y="4" width="13" height="3" rx="1" fill="#26A69A" />
    <rect x="3" y="15" width="13" height="3" rx="1" fill="#00A756" />
    <rect x="8" y="9" width="3.5" height="2.5" rx="0.5" fill="#FFBA00" />
  </svg>
);

export default function UpcomingEventsPanel({
  events,
  onViewAllClick
}: UpcomingEventsPanelProps) {
  // Sort events by date and filter to only show future events (or today's events)
  const now = new Date();
  
  const parseSafeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const formatted = dateStr.replace(' ', 'T');
    return new Date(formatted);
  };

  const upcoming = [...events]
    .filter(event => {
      const eventTime = parseSafeDate(event.start_time);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      return eventTime >= todayStart;
    })
    .sort((a, b) => parseSafeDate(a.start_time).getTime() - parseSafeDate(b.start_time).getTime())
    .slice(0, 5); // display top 5 events

  const formatTime = (dateStr: string) => {
    const d = parseSafeDate(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDay = (dateStr: string) => {
    const d = parseSafeDate(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl flex flex-col shadow-sm">
      {/* Title */}
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          Upcoming Events
        </h3>
      </div>

      {/* Events List */}
      <div className="p-4 flex-1 space-y-4 overflow-y-auto">
        {upcoming.length > 0 ? (
          upcoming.map((event) => {
            const colorMeta = COLOR_MAP[event.color || 'orange'] || COLOR_MAP.orange;
            const hasMeetingLink = !!event.meeting_link;
            
            const isGoogleMeet =
              event.title.toLowerCase().includes('google meet') ||
              event.title.toLowerCase().includes('google meeting') ||
              event.meeting_link?.toLowerCase().includes('meet.google');

            return (
              <div
                key={event.id}
                className="group flex items-start gap-4 p-3 border border-border rounded-2xl transition-all"
              >
                {/* Left Side: Category Styled Icon Box */}
                <div className={`h-11 w-11 rounded-xl shrink-0 flex items-center justify-center border-2 ${colorMeta.border} ${colorMeta.text} bg-transparent`}>
                  {isGoogleMeet ? (
                    <GoogleMeetLogo className="h-5.5 w-5.5" />
                  ) : (
                    <Calendar className="h-5 w-5" />
                  )}
                </div>

                {/* Right Side: Event Details */}
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                    {formatDay(event.start_time)}, {formatTime(event.start_time)}
                  </p>
                  <p className={`text-[10px] truncate mt-0.5 font-semibold ${isGoogleMeet ? 'text-[#00832F]' : 'text-muted-foreground/75'} flex items-center justify-between`}>
                    <span>{hasMeetingLink ? (isGoogleMeet ? 'Google Meet' : 'Video Call') : 'Calendar Event'}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground/75 font-bold uppercase tracking-wider scale-90">
                      {event.source === 'google_calendar' ? 'Google' : 'Aura'}
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 px-4">
            <VideoOff className="h-8 w-8 text-muted-foreground/45 mx-auto mb-2" />
            <p className="text-xs font-bold text-muted-foreground">No upcoming meetings</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Schedule an event or sync from Google.</p>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="p-3.5 border-t border-border bg-muted/10 text-center rounded-b-2xl">
        <button
          onClick={onViewAllClick}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary/85 hover:underline transition-all"
        >
          View full calendar
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
