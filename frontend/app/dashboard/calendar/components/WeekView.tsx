'use client';
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { Video, MapPin } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

/* ── Shared premium colour palette (light + dark) ── */
const COLOR_MAP: Record<string, {
  bg: string; text: string; timeText: string;
  borderL: string; glow: string;
}> = {
  orange: {
    bg:       'bg-gradient-to-b from-[#FFF3E6] to-[#FFE8CC] dark:from-[#2A1600] dark:to-[#1E1000]',
    text:     'text-[#7C2D00] dark:text-[#FDBA74]',
    timeText: 'text-[#C2410C] dark:text-[#FB923C]/80',
    borderL:  'border-l-[3px] border-l-[#F97316]',
    glow:     'shadow-[0_2px_8px_rgba(249,115,22,0.18)] dark:shadow-[0_2px_8px_rgba(249,115,22,0.25)]',
  },
  blue: {
    bg:       'bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE] dark:from-[#060D1C] dark:to-[#0A1628]',
    text:     'text-[#1E3A8A] dark:text-[#93C5FD]',
    timeText: 'text-[#2563EB] dark:text-[#60A5FA]/80',
    borderL:  'border-l-[3px] border-l-[#3B82F6]',
    glow:     'shadow-[0_2px_8px_rgba(59,130,246,0.18)] dark:shadow-[0_2px_8px_rgba(59,130,246,0.25)]',
  },
  green: {
    bg:       'bg-gradient-to-b from-[#ECFDF5] to-[#DCFCE7] dark:from-[#041410] dark:to-[#071A10]',
    text:     'text-[#064E3B] dark:text-[#6EE7B7]',
    timeText: 'text-[#047857] dark:text-[#34D399]/80',
    borderL:  'border-l-[3px] border-l-[#10B981]',
    glow:     'shadow-[0_2px_8px_rgba(16,185,129,0.18)] dark:shadow-[0_2px_8px_rgba(16,185,129,0.25)]',
  },
  purple: {
    bg:       'bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-[#0E0A1C] dark:to-[#120D22]',
    text:     'text-[#3B0764] dark:text-[#C4B5FD]',
    timeText: 'text-[#6D28D9] dark:text-[#A78BFA]/80',
    borderL:  'border-l-[3px] border-l-[#8B5CF6]',
    glow:     'shadow-[0_2px_8px_rgba(139,92,246,0.18)] dark:shadow-[0_2px_8px_rgba(139,92,246,0.25)]',
  },
  yellow: {
    bg:       'bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] dark:from-[#1A1200] dark:to-[#1F1600]',
    text:     'text-[#78350F] dark:text-[#FDE68A]',
    timeText: 'text-[#B45309] dark:text-[#FCD34D]/80',
    borderL:  'border-l-[3px] border-l-[#F59E0B]',
    glow:     'shadow-[0_2px_8px_rgba(245,158,11,0.18)] dark:shadow-[0_2px_8px_rgba(245,158,11,0.25)]',
  },
  red: {
    bg:       'bg-gradient-to-b from-[#FFF1F1] to-[#FEE2E2] dark:from-[#1A0606] dark:to-[#200808]',
    text:     'text-[#7F1D1D] dark:text-[#FCA5A5]',
    timeText: 'text-[#B91C1C] dark:text-[#F87171]/80',
    borderL:  'border-l-[3px] border-l-[#EF4444]',
    glow:     'shadow-[0_2px_8px_rgba(239,68,68,0.18)] dark:shadow-[0_2px_8px_rgba(239,68,68,0.25)]',
  },
  pink: {
    bg:       'bg-gradient-to-b from-[#FDF2F8] to-[#FCE7F3] dark:from-[#180610] dark:to-[#1E0815]',
    text:     'text-[#701A75] dark:text-[#F9A8D4]',
    timeText: 'text-[#BE185D] dark:text-[#F472B6]/80',
    borderL:  'border-l-[3px] border-l-[#EC4899]',
    glow:     'shadow-[0_2px_8px_rgba(236,72,153,0.18)] dark:shadow-[0_2px_8px_rgba(236,72,153,0.25)]',
  },
  grey: {
    bg:       'bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0F1115] dark:to-[#131518]',
    text:     'text-[#1F2937] dark:text-[#E5E7EB]',
    timeText: 'text-[#4B5563] dark:text-[#9CA3AF]/80',
    borderL:  'border-l-[3px] border-l-[#6B7280]',
    glow:     'shadow-[0_2px_8px_rgba(107,114,128,0.12)] dark:shadow-[0_2px_8px_rgba(107,114,128,0.18)]',
  },
};

const GoogleIcon = () => (
  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function WeekView({ currentDate, events }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const startHour = 6;
  const endHour = 22;
  const totalHours = endHour - startHour + 1;
  const hourHeight = 64;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (8 - startHour) * hourHeight;
  }, []);

  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    date.setDate(d.getDate() - d.getDay());
    return date;
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const parseSafeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    try {
      const parts = dateStr.replace(' ', 'T').split('T');
      let timePart = (parts[1] || '00:00:00').split(/[Z+]/)[0];
      const lastMinus = timePart.lastIndexOf('-');
      if (lastMinus > timePart.lastIndexOf(':')) timePart = timePart.substring(0, lastMinus);
      return new Date(`${parts[0]}T${timePart}`);
    } catch { return new Date(dateStr); }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const getEventsForDay = (date: Date) =>
    events.filter(e => {
      const s = parseSafeDate(e.start_time);
      return s.getFullYear() === date.getFullYear() &&
             s.getMonth() === date.getMonth() &&
             s.getDate() === date.getDate();
    });

  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i);

  const tzString = (() => {
    const off = -new Date().getTimezoneOffset();
    return `GMT${off >= 0 ? '+' : '-'}${Math.floor(Math.abs(off) / 60)}`;
  })();

  const today = new Date();

  const getTimelinePos = () => {
    const h = currentTime.getHours(), m = currentTime.getMinutes();
    if (h < startHour || h > endHour) return null;
    return ((h - startHour) + m / 60) * hourHeight;
  };
  const timelinePos = getTimelinePos();

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden select-none h-[580px] min-w-[760px] md:min-w-full
                    border border-border dark:border-border bg-card dark:bg-card shadow-sm">

      <style dangerouslySetInnerHTML={{ __html: `
        .week-scroll::-webkit-scrollbar { width: 5px; }
        .week-scroll::-webkit-scrollbar-track { background: transparent; }
        .week-scroll::-webkit-scrollbar-thumb { background: rgba(156,163,175,0.4); border-radius: 9999px; }
        .week-scroll::-webkit-scrollbar-thumb:hover { background: rgba(156,163,175,0.65); }
      `}} />

      {/* ── Day headers ── */}
      <div className="flex shrink-0 border-b border-border bg-muted/30 dark:bg-white/[0.025] z-10">
        <div className="w-[72px] shrink-0 border-r border-border flex items-center justify-center">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{tzString}</span>
        </div>
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, idx) => {
            const isToday = today.toDateString() === day.toDateString();
            return (
              <div key={idx} className={`py-2.5 flex flex-col items-center border-r border-border last:border-r-0
                ${isToday ? 'bg-[#F97316]/[0.06] dark:bg-[#F97316]/[0.08]' : ''}`}>
                <span className={`text-[9.5px] font-extrabold uppercase tracking-widest
                  ${isToday ? 'text-[#F97316]' : 'text-muted-foreground'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`mt-1 text-[15px] font-extrabold flex items-center justify-center h-7 w-7 rounded-full
                  ${isToday
                    ? 'bg-[#F97316] text-white shadow-sm shadow-[#F97316]/40'
                    : 'text-foreground'}`}>
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Time grid ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative week-scroll bg-card dark:bg-background">
        <div className="flex w-full relative" style={{ height: `${totalHours * hourHeight + 24}px` }}>

          {/* Time labels */}
          <div className="w-[72px] shrink-0 border-r border-border relative bg-card dark:bg-background">
            {hours.map((hour, idx) => {
              const label = hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
              return (
                <div key={hour} className="absolute right-3 text-[9.5px] font-bold text-muted-foreground/60 select-none"
                  style={{ top: `${idx === 0 ? 6 : idx * hourHeight - 8}px` }}>
                  {label}
                </div>
              );
            })}
          </div>

          {/* Grid body */}
          <div className="flex-1 relative">
            {/* Horizontal lines */}
            <div className="absolute inset-0 pointer-events-none">
              {hours.map((_, i) => (
                <div key={i} className="border-b border-border/50 dark:border-border/30 w-full absolute"
                  style={{ top: `${i * hourHeight}px`, height: `${hourHeight}px` }} />
              ))}
            </div>

            {/* Column highlights + event cells */}
            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, dayIdx) => {
                const isToday = today.toDateString() === day.toDateString();
                const dayEvents = getEventsForDay(day);

                const mapped = dayEvents.map(event => {
                  const start = parseSafeDate(event.start_time);
                  const end = event.end_time ? parseSafeDate(event.end_time) : new Date(start.getTime() + 3600000);
                  const startHrs = start.getHours() + start.getMinutes() / 60;
                  const durHrs = (end.getTime() - start.getTime()) / 3600000;
                  const top = Math.max(0, (startHrs - startHour) * hourHeight);
                  const height = Math.max(28, Math.min((totalHours * hourHeight) - top, durHrs * hourHeight));
                  return { ...event, top, height, startHrs, endHrs: startHrs + durHrs, start, end };
                }).filter(e => e.startHrs < endHour + 1 && e.endHrs > startHour);

                // Overlap columns
                const groups: typeof mapped[] = [];
                mapped.forEach(ev => {
                  let placed = false;
                  for (const g of groups) {
                    if (g.some(x => ev.startHrs < x.endHrs && ev.endHrs > x.startHrs)) {
                      g.push(ev); placed = true; break;
                    }
                  }
                  if (!placed) groups.push([ev]);
                });
                const cards: any[] = [];
                groups.forEach(g => {
                  const n = g.length;
                  g.forEach((ev, i) => cards.push({ ...ev, left: `${i * 100 / n}%`, width: `${100 / n - 2}%` }));
                });

                return (
                  <div key={dayIdx} className={`relative border-r border-border/40 last:border-r-0 h-full
                    ${isToday ? 'bg-[#F97316]/[0.03] dark:bg-[#F97316]/[0.04]' : ''}`}>
                    {cards.map(card => {
                      const c = COLOR_MAP[card.color || 'orange'] || COLOR_MAP.orange;
                      const hasMeet = !!card.meeting_link;
                      return (
                        <div
                          key={card.id}
                          style={{ top: `${card.top + 2}px`, height: `${card.height - 4}px`, left: card.left, width: card.width }}
                          className={`absolute rounded-xl px-2 py-1.5 flex flex-col justify-between
                                      transition-all duration-150 cursor-default overflow-hidden
                                      hover:-translate-y-px hover:scale-[1.01]
                                      border border-transparent border-y-0 border-r-0
                                      ${c.bg} ${c.borderL} ${c.glow}`}
                          title={`${card.title} · ${formatTime(card.start)} – ${formatTime(card.end)}`}
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className={`text-[10px] font-extrabold truncate leading-tight flex items-center gap-1 ${c.text}`}>
                              {card.source === 'google_calendar' && (
                                <span className="h-3.5 w-3.5 rounded bg-white/80 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm">
                                  <GoogleIcon />
                                </span>
                              )}
                              <span className="truncate">{card.title}</span>
                            </span>
                            <span className={`text-[9px] font-semibold leading-none ${c.timeText}`}>
                              {formatTime(card.start)} – {formatTime(card.end)}
                            </span>
                          </div>

                          {card.height >= 52 && (
                            <div className={`flex items-center gap-1 mt-0.5 overflow-hidden text-[9px] ${c.timeText}`}>
                              {hasMeet ? (
                                <><Video className="h-2.5 w-2.5 shrink-0" /><span className="font-bold truncate">Meet</span></>
                              ) : (
                                <><MapPin className="h-2.5 w-2.5 shrink-0 opacity-60" />
                                <span className="truncate opacity-75">{card.source === 'google_calendar' ? 'Calendar' : 'Local'}</span></>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Current time line */}
            {timelinePos !== null && (
              <div className="absolute left-0 right-0 pointer-events-none z-20 flex items-center"
                style={{ top: `${timelinePos}px` }}>
                <div className="h-2.5 w-2.5 rounded-full bg-[#F97316] shadow-sm ring-2 ring-white dark:ring-background absolute -left-[5px]" />
                <div className="w-full h-[1.5px] bg-gradient-to-r from-[#F97316] to-[#F97316]/30" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
