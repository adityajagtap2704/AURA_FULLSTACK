'use client';
import { Event } from '@/types';
import { Clock, Video, MapPin, Users, CalendarDays } from 'lucide-react';

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

interface AgendaViewProps { events: Event[]; onDeleteEvent?: (id: string) => Promise<void>; }

const ACCENT: Record<string, { hex: string; lightBg: string; lightText: string; darkBg: string; darkText: string }> = {
  orange: { hex:'#F97316', lightBg:'#FFF4EA', lightText:'#92350A', darkBg:'rgba(249,115,22,0.12)', darkText:'#FDBA74' },
  blue:   { hex:'#3B82F6', lightBg:'#EEF4FF', lightText:'#1D4ED8', darkBg:'rgba(59,130,246,0.12)',  darkText:'#93C5FD' },
  green:  { hex:'#10B981', lightBg:'#EDFAF4', lightText:'#065F46', darkBg:'rgba(16,185,129,0.12)',  darkText:'#6EE7B7' },
  purple: { hex:'#8B5CF6', lightBg:'#F4F0FF', lightText:'#5B21B6', darkBg:'rgba(139,92,246,0.12)',  darkText:'#C4B5FD' },
  yellow: { hex:'#F59E0B', lightBg:'#FFFBEA', lightText:'#92400E', darkBg:'rgba(245,158,11,0.12)',  darkText:'#FDE68A' },
  red:    { hex:'#EF4444', lightBg:'#FFF1F1', lightText:'#991B1B', darkBg:'rgba(239,68,68,0.12)',   darkText:'#FCA5A5' },
  pink:   { hex:'#EC4899', lightBg:'#FDF2F8', lightText:'#9D174D', darkBg:'rgba(236,72,153,0.12)',  darkText:'#F9A8D4' },
  grey:   { hex:'#6B7280', lightBg:'#F3F4F6', lightText:'#374151', darkBg:'rgba(107,114,128,0.12)', darkText:'#D1D5DB' },
};

const GoogleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.91z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function AgendaView({ events }: AgendaViewProps) {
  const grouped = events.reduce((g: Record<string, Event[]>, e) => {
    const k = parseSafeDate(e.start_time).toDateString();
    (g[k] ??= []).push(e);
    return g;
  }, {});

  const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const fmt = (d: string) => parseSafeDate(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const getDayLabel = (key: string) => {
    const d = new Date(key), today = new Date(), tom = new Date();
    tom.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return { label: d.toLocaleDateString('en-US', { weekday: 'long' }), tag: 'Today' };
    if (d.toDateString() === tom.toDateString()) return { label: d.toLocaleDateString('en-US', { weekday: 'long' }), tag: 'Tomorrow' };
    return { label: d.toLocaleDateString('en-US', { weekday: 'long' }), tag: null };
  };

  return (
    <div className="space-y-4">
      {sortedKeys.length > 0 ? sortedKeys.map(key => {
        const dayEvents = grouped[key];
        const d = new Date(key);
        const { label, tag } = getDayLabel(key);
        const fullDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        return (
          <div key={key} className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
            {/* Date header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40 dark:bg-white/[0.025]">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#B7792B]/10 dark:bg-[#C98A2E]/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-black uppercase text-[#B7792B] dark:text-[#C98A2E] leading-none">
                    {d.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-[14px] font-black text-[#B7792B] dark:text-[#C98A2E] leading-none">
                    {d.getDate()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-foreground">{label}</span>
                    {tag && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest
                                       bg-[#F97316] text-white">
                        {tag}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">{fullDate}</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground px-2.5 py-1 rounded-full bg-muted dark:bg-white/[0.06]">
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Events */}
            <div className="p-4 space-y-2.5">
              {dayEvents.map(event => {
                const a = ACCENT[event.color || 'orange'] || ACCENT.orange;
                const hasLink = !!event.meeting_link;
                const isGoogle = event.source === 'google_calendar';

                return (
                  <div key={event.id}
                    className="group flex rounded-xl overflow-hidden border border-border
                               bg-white dark:bg-[#1E1E1E]
                               hover:shadow-md dark:hover:shadow-black/40 transition-all duration-200">
                    {/* Colour stripe */}
                    <div className="w-1 shrink-0" style={{ background: a.hex }} />

                    {/* Body */}
                    <div className="flex flex-1 items-center gap-4 px-4 py-3">
                      {/* Icon */}
                      <div className="h-9 w-9 rounded-lg shrink-0 flex items-center justify-center border border-border bg-[#FAFAFA] dark:bg-[#252525]"
                           style={{ boxShadow: `0 0 0 2px ${a.hex}20` }}>
                        {isGoogle ? <GoogleIcon size={16} /> : <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.hex }} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13.5px] font-bold text-foreground">{event.title}</span>
                          {isGoogle && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                                  style={{ background: a.lightBg, color: a.lightText }}>
                              Google
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: a.lightText }}>
                            <Clock size={11} className="shrink-0" />
                            <span className="dark:hidden">{fmt(event.start_time)}{event.end_time && ` → ${fmt(event.end_time)}`}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-semibold hidden dark:flex" style={{ color: a.darkText }}>
                            <Clock size={11} className="shrink-0" />
                            {fmt(event.start_time)}{event.end_time && ` → ${fmt(event.end_time)}`}
                          </span>

                          {hasLink ? (
                            <a href={event.meeting_link!} target="_blank" rel="noreferrer"
                               onClick={e => e.stopPropagation()}
                               className="flex items-center gap-1 text-[11px] font-bold hover:underline text-[#3B82F6] dark:text-[#60A5FA]">
                              <Video size={11} /> Join
                            </a>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <MapPin size={11} />
                              {isGoogle ? 'Google Calendar' : 'Local event'}
                            </span>
                          )}

                          {event.attendees && event.attendees.length > 0 && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Users size={11} />
                              {event.attendees.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Avatars */}
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex -space-x-1.5 shrink-0">
                          {event.attendees.slice(0, 3).map((att, i) => (
                            <div key={i} title={att.email}
                                 className="h-6 w-6 rounded-full border-2 border-white dark:border-[#1E1E1E] flex items-center justify-center text-[8px] font-bold uppercase text-white shadow-sm"
                                 style={{ background: a.hex }}>
                              {(att.displayName ?? att.email ?? '??').slice(0, 2)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }) : (
        <div className="flex flex-col items-center py-20 text-center border border-dashed border-border rounded-2xl bg-card">
          <div className="h-14 w-14 rounded-2xl bg-[#B7792B]/10 flex items-center justify-center mb-4">
            <CalendarDays className="h-7 w-7 text-[#B7792B] dark:text-[#C98A2E]" />
          </div>
          <p className="font-bold text-foreground text-sm">No upcoming events</p>
          <p className="text-xs text-muted-foreground mt-1.5">Sync your Google Calendar to see events here.</p>
        </div>
      )}
    </div>
  );
}
