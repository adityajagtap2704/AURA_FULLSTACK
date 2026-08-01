'use client';
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { Video, MapPin } from 'lucide-react';

interface WeekViewProps { currentDate: Date; events: Event[]; }

const ACCENT: Record<string, { hex: string; lightBg: string; lightText: string; darkText: string }> = {
  orange: { hex:'#F97316', lightBg:'#FFF4EA', lightText:'#92350A', darkText:'#FDBA74' },
  blue:   { hex:'#3B82F6', lightBg:'#EEF4FF', lightText:'#1D4ED8', darkText:'#93C5FD' },
  green:  { hex:'#10B981', lightBg:'#EDFAF4', lightText:'#065F46', darkText:'#6EE7B7' },
  purple: { hex:'#8B5CF6', lightBg:'#F4F0FF', lightText:'#5B21B6', darkText:'#C4B5FD' },
  yellow: { hex:'#F59E0B', lightBg:'#FFFBEA', lightText:'#92400E', darkText:'#FDE68A' },
  red:    { hex:'#EF4444', lightBg:'#FFF1F1', lightText:'#991B1B', darkText:'#FCA5A5' },
  pink:   { hex:'#EC4899', lightBg:'#FDF2F8', lightText:'#9D174D', darkText:'#F9A8D4' },
  grey:   { hex:'#6B7280', lightBg:'#F3F4F6', lightText:'#374151', darkText:'#D1D5DB' },
};

const GoogleIcon = () => (
  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.91z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
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

export default function WeekView({ currentDate, events }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(new Date());
  const startHour = 6, endHour = 22, totalHours = endHour - startHour + 1, hourH = 64;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (8 - startHour) * hourH;
  }, []);

  const sunDate = new Date(currentDate);
  sunDate.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunDate); d.setDate(sunDate.getDate() + i); return d;
  });

  const getEventsForDay = (d: Date) => events.filter(e => {
    const s = parseSafeDate(e.start_time);
    return s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth() && s.getDate() === d.getDate();
  });

  const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i);
  const today = new Date();

  const tzStr = (() => {
    const off = -new Date().getTimezoneOffset();
    return `GMT${off >= 0 ? '+' : '-'}${Math.floor(Math.abs(off) / 60)}`;
  })();

  const timelinePos = (() => {
    const h = now.getHours(), m = now.getMinutes();
    if (h < startHour || h > endHour) return null;
    return ((h - startHour) + m / 60) * hourH;
  })();

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm
                    select-none h-[580px] min-w-[720px] md:min-w-full">
      <style dangerouslySetInnerHTML={{ __html:`
        .wk-scroll::-webkit-scrollbar{width:4px}
        .wk-scroll::-webkit-scrollbar-track{background:transparent}
        .wk-scroll::-webkit-scrollbar-thumb{background:rgba(183,121,43,0.25);border-radius:9999px}
        .wk-scroll::-webkit-scrollbar-thumb:hover{background:rgba(183,121,43,0.45)}
      `}} />

      {/* Day headers */}
      <div className="flex shrink-0 border-b border-border bg-muted/30 dark:bg-white/[0.02]">
        <div className="w-[68px] shrink-0 border-r border-border flex items-center justify-center">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{tzStr}</span>
        </div>
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, i) => {
            const isToday = today.toDateString() === day.toDateString();
            return (
              <div key={i} className={`py-2.5 flex flex-col items-center border-r border-border last:border-r-0
                ${isToday ? 'bg-[#F97316]/[0.07] dark:bg-[#F97316]/[0.08]' : ''}`}>
                <span className={`text-[9px] font-black uppercase tracking-widest
                  ${isToday ? 'text-[#F97316]' : 'text-muted-foreground'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`mt-1 h-7 w-7 flex items-center justify-center rounded-full text-[14px] font-black
                  ${isToday ? 'bg-[#F97316] text-white shadow shadow-[#F97316]/40' : 'text-foreground'}`}>
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative wk-scroll bg-white dark:bg-background">
        <div className="flex relative" style={{ height: `${totalHours * hourH + 20}px` }}>

          {/* Hour labels */}
          <div className="w-[68px] shrink-0 border-r border-border relative bg-white dark:bg-background">
            {hours.map((h, i) => (
              <div key={h} className="absolute right-3 text-[9px] font-bold text-muted-foreground/60 select-none"
                   style={{ top: `${i === 0 ? 6 : i * hourH - 8}px` }}>
                {h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`}
              </div>
            ))}
          </div>

          {/* Grid body */}
          <div className="flex-1 relative">
            {/* Horizontal lines */}
            {hours.map((_, i) => (
              <div key={i} className="absolute w-full border-b border-border/40 dark:border-border/25"
                   style={{ top: `${i * hourH}px` }} />
            ))}

            {/* Columns */}
            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, di) => {
                const isToday = today.toDateString() === day.toDateString();
                const dayEvts = getEventsForDay(day);

                const mapped = dayEvts.map(e => {
                  const s = parseSafeDate(e.start_time);
                  const en = e.end_time ? parseSafeDate(e.end_time) : new Date(s.getTime() + 3600000);
                  const sh = s.getHours() + s.getMinutes() / 60;
                  const dur = (en.getTime() - s.getTime()) / 3600000;
                  const top = Math.max(0, (sh - startHour) * hourH);
                  const height = Math.max(28, Math.min((totalHours * hourH) - top, dur * hourH));
                  return { ...e, top, height, startH: sh, endH: sh + dur, sDate: s, eDate: en };
                }).filter(e => e.startH < endHour + 1 && e.endH > startHour);

                const groups: typeof mapped[] = [];
                mapped.forEach(ev => {
                  let placed = false;
                  for (const g of groups) {
                    if (g.some(x => ev.startH < x.endH && ev.endH > x.startH)) { g.push(ev); placed = true; break; }
                  }
                  if (!placed) groups.push([ev]);
                });
                const cards: any[] = [];
                groups.forEach(g => g.forEach((ev, i) => cards.push({ ...ev, left: `${i * 100 / g.length}%`, width: `${100 / g.length - 2}%` })));

                return (
                  <div key={di} className={`relative border-r border-border/40 last:border-r-0 h-full
                    ${isToday ? 'bg-[#F97316]/[0.025] dark:bg-[#F97316]/[0.03]' : ''}`}>
                    {cards.map(card => {
                      const a = ACCENT[card.color || 'orange'] || ACCENT.orange;
                      const hasMeet = !!card.meeting_link;
                      return (
                        <div key={card.id}
                             style={{ top: `${card.top + 2}px`, height: `${card.height - 4}px`, left: card.left, width: card.width, background: a.lightBg, borderLeft: `3px solid ${a.hex}`, boxShadow: `0 1px 4px ${a.hex}20` }}
                             className="absolute rounded-lg px-2 py-1.5 flex flex-col justify-between
                                        cursor-default overflow-hidden transition-all duration-150
                                        hover:-translate-y-px hover:shadow-md dark:bg-opacity-0">
                          {/* Dark mode overlay */}
                          <div className="absolute inset-0 rounded-lg hidden dark:block"
                               style={{ background: `rgba(30,30,30,0.95)`, borderLeft: `3px solid ${a.hex}` }} />
                          <div className="relative z-10 flex flex-col gap-0.5">
                            <span className="text-[10px] font-extrabold truncate leading-tight flex items-center gap-1"
                                  style={{ color: a.lightText }}>
                              <span className="dark:hidden flex items-center gap-1" style={{ color: a.lightText }}>
                                {card.source === 'google_calendar' && (
                                  <span className="h-3.5 w-3.5 bg-white/80 rounded flex items-center justify-center shrink-0 shadow-sm">
                                    <GoogleIcon />
                                  </span>
                                )}
                                <span className="truncate">{card.title}</span>
                              </span>
                              <span className="hidden dark:flex items-center gap-1" style={{ color: a.darkText }}>
                                {card.source === 'google_calendar' && (
                                  <span className="h-3.5 w-3.5 bg-white/10 rounded flex items-center justify-center shrink-0">
                                    <GoogleIcon />
                                  </span>
                                )}
                                <span className="truncate">{card.title}</span>
                              </span>
                            </span>
                            <span className="text-[9px] font-semibold dark:hidden" style={{ color: a.lightText, opacity: 0.75 }}>
                              {fmtTime(card.sDate)}
                            </span>
                            <span className="text-[9px] font-semibold hidden dark:block" style={{ color: a.darkText, opacity: 0.75 }}>
                              {fmtTime(card.sDate)}
                            </span>
                          </div>
                          {card.height >= 52 && (
                            <div className="relative z-10 flex items-center gap-1 text-[9px] overflow-hidden dark:hidden"
                                 style={{ color: a.lightText, opacity: 0.7 }}>
                              {hasMeet ? <><Video className="h-2.5 w-2.5 shrink-0" /><span className="font-bold truncate">Meet</span></>
                                : <><MapPin className="h-2.5 w-2.5 shrink-0" /><span className="truncate">{card.source === 'google_calendar' ? 'Calendar' : 'Local'}</span></>}
                            </div>
                          )}
                          {card.height >= 52 && (
                            <div className="relative z-10 items-center gap-1 text-[9px] overflow-hidden hidden dark:flex"
                                 style={{ color: a.darkText, opacity: 0.7 }}>
                              {hasMeet ? <><Video className="h-2.5 w-2.5 shrink-0" /><span className="font-bold truncate">Meet</span></>
                                : <><MapPin className="h-2.5 w-2.5 shrink-0" /><span className="truncate">{card.source === 'google_calendar' ? 'Calendar' : 'Local'}</span></>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Time line */}
            {timelinePos !== null && (
              <div className="absolute left-0 right-0 pointer-events-none z-20 flex items-center"
                   style={{ top: `${timelinePos}px` }}>
                <div className="h-2.5 w-2.5 rounded-full bg-[#F97316] ring-2 ring-white dark:ring-background shadow absolute -left-[5px]" />
                <div className="w-full h-[1.5px] bg-gradient-to-r from-[#F97316] to-[#F97316]/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
