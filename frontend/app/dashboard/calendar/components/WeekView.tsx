'use client';
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { Video, MapPin } from 'lucide-react';
import { getEventAccent } from '@/lib/calendarColors';

interface WeekViewProps { currentDate: Date; events: Event[]; }

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
  const SH = 6, EH = 22, TOTAL = EH - SH + 1, HH = 64;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (8 - SH) * HH;
  }, []);

  const sun = new Date(currentDate);
  sun.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sun); d.setDate(sun.getDate() + i); return d;
  });

  const getDayEvts = (d: Date) => events.filter(e => {
    const s = parseSafeDate(e.start_time);
    return s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth() && s.getDate() === d.getDate();
  });

  const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const hours = Array.from({ length: TOTAL }, (_, i) => SH + i);
  const today = new Date();

  const tzStr = (() => {
    const off = -new Date().getTimezoneOffset();
    return `GMT${off >= 0 ? '+' : '-'}${Math.floor(Math.abs(off) / 60)}`;
  })();

  const timelinePos = (() => {
    const h = now.getHours(), m = now.getMinutes();
    if (h < SH || h > EH) return null;
    return ((h - SH) + m / 60) * HH;
  })();

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden select-none h-[580px] min-w-[720px] md:min-w-full
                    border border-border bg-card shadow-sm">
      <style dangerouslySetInnerHTML={{ __html:`
        .wk-s::-webkit-scrollbar{width:4px}
        .wk-s::-webkit-scrollbar-track{background:transparent}
        .wk-s::-webkit-scrollbar-thumb{background:rgba(183,121,43,0.3);border-radius:9999px}
        .wk-s::-webkit-scrollbar-thumb:hover{background:rgba(183,121,43,0.5)}
      `}} />

      {/* ── Day headers ── */}
      <div className="flex shrink-0 border-b border-border bg-muted/25">
        <div className="w-[68px] shrink-0 border-r border-border flex items-center justify-center">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{tzStr}</span>
        </div>
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, i) => {
            const isT = today.toDateString() === day.toDateString();
            return (
              <div key={i} className={`py-2.5 flex flex-col items-center border-r border-border last:border-r-0
                ${isT ? 'bg-[#F97316]/[0.06] dark:bg-[#F97316]/[0.07]' : ''}`}>
                <span className={`text-[9px] font-black uppercase tracking-widest
                  ${isT ? 'text-[#F97316]' : 'text-muted-foreground'}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={`mt-1 h-7 w-7 flex items-center justify-center rounded-full text-[14px] font-black
                  ${isT ? 'bg-[#F97316] text-white shadow shadow-[#F97316]/35' : 'text-foreground'}`}>
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable grid ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative wk-s bg-background">
        <div className="flex relative" style={{ height: `${TOTAL * HH + 20}px` }}>

          {/* Time labels */}
          <div className="w-[68px] shrink-0 border-r border-border relative bg-background">
            {hours.map((h, i) => (
              <div key={h} className="absolute right-3 text-[9px] font-bold text-muted-foreground/55 select-none"
                   style={{ top: `${i === 0 ? 6 : i * HH - 8}px` }}>
                {h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`}
              </div>
            ))}
          </div>

          {/* Grid body */}
          <div className="flex-1 relative">
            {/* Horizontal hour lines */}
            {hours.map((_, i) => (
              <div key={i}
                   className="absolute w-full border-b border-border/25"
                   style={{ top: `${i * HH}px` }} />
            ))}

            {/* Day columns */}
            <div className="absolute inset-0 grid grid-cols-7">
              {weekDays.map((day, di) => {
                const isT = today.toDateString() === day.toDateString();
                const dayEvts = getDayEvts(day);

                const mapped = dayEvts.map(e => {
                  const s = parseSafeDate(e.start_time);
                  const en = e.end_time ? parseSafeDate(e.end_time) : new Date(s.getTime() + 3600000);
                  const sh = s.getHours() + s.getMinutes() / 60;
                  const dur = (en.getTime() - s.getTime()) / 3600000;
                  const top = Math.max(0, (sh - SH) * HH);
                  const height = Math.max(28, Math.min((TOTAL * HH) - top, dur * HH));
                  return { ...e, top, height, sh, eh: sh + dur, sDate: s, eDate: en };
                }).filter(e => e.sh < EH + 1 && e.eh > SH);

                const groups: typeof mapped[] = [];
                mapped.forEach(ev => {
                  let placed = false;
                  for (const g of groups) {
                    if (g.some(x => ev.sh < x.eh && ev.eh > x.sh)) { g.push(ev); placed = true; break; }
                  }
                  if (!placed) groups.push([ev]);
                });
                const cards: any[] = [];
                groups.forEach(g => g.forEach((ev, i) => cards.push({ ...ev, left: `${i*100/g.length}%`, width: `${100/g.length - 2}%` })));

                return (
                  <div key={di}
                       className={`relative border-r border-border/30 last:border-r-0 h-full
                         ${isT ? 'bg-[#F97316]/[0.025] dark:bg-[#F97316]/[0.03]' : ''}`}>
                    {cards.map(card => {
                      const a = getEventAccent(card.id, card.title, card.color);
                      const hasMeet = !!card.meeting_link;

                      return (
                        <div
                          key={card.id}
                          className="absolute rounded-lg px-2 py-1.5 flex flex-col justify-between
                                     cursor-default overflow-hidden transition-all duration-150
                                     hover:-translate-y-px hover:shadow-md"
                          style={{
                            top: `${card.top + 2}px`,
                            height: `${card.height - 4}px`,
                            left: card.left,
                            width: card.width,
                            backgroundColor: `${a.hex}0D`,
                            borderLeft: `3px solid ${a.hex}`,
                            boxShadow: `0 1px 4px ${a.hex}20`,
                          }}
                        >

                          <div className="relative z-10 flex flex-col gap-0.5 min-w-0">
                            {/* Title */}
                            <span className="text-[10px] font-extrabold truncate leading-tight flex items-center gap-1 min-w-0" style={{ color: a.hex }}>
                              {card.source === 'google_calendar' && (
                                <span className="h-3.5 w-3.5 bg-background/80 rounded flex items-center justify-center shrink-0">
                                  <GoogleIcon />
                                </span>
                              )}
                              <span className="truncate">{card.title}</span>
                            </span>
                            {/* Time */}
                            <span className="text-[9px] font-semibold text-muted-foreground">
                              {fmtTime(card.sDate)}
                            </span>
                          </div>

                          {card.height >= 52 && (
                            <div className="relative z-10 flex items-center gap-1 text-[9px] overflow-hidden text-muted-foreground/60">
                              {hasMeet
                                ? <><Video className="h-2.5 w-2.5 shrink-0" /><span className="font-bold truncate">Meet</span></>
                                : <><MapPin className="h-2.5 w-2.5 shrink-0" /><span className="truncate">Calendar</span></>}
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
                <div className="h-2.5 w-2.5 rounded-full bg-[#F97316] ring-2 ring-card shadow absolute -left-[5px]" />
                <div className="w-full h-[1.5px] bg-gradient-to-r from-[#F97316] to-[#F97316]/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
