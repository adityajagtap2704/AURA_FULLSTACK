'use client';
import { Event } from '@/types';
import { getEventAccent } from '@/lib/calendarColors';

const GoogleGIcon = () => (
  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.91z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

interface MonthViewProps { currentDate: Date; events: Event[]; }

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

export default function MonthView({ currentDate, events }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstIdx = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotal = new Date(year, month, 0).getDate();

  const cells: { date: Date; isCur: boolean }[] = [];
  for (let i = firstIdx - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, prevTotal - i), isCur: false });
  for (let i = 1; i <= totalDays; i++)
    cells.push({ date: new Date(year, month, i), isCur: true });
  while (cells.length < 42)
    cells.push({ date: new Date(year, month + 1, cells.length - firstIdx - totalDays + 1), isCur: false });

  const getEvents = (d: Date) => events.filter(e => {
    const s = parseSafeDate(e.start_time);
    return s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth() && s.getDate() === d.getDate();
  });

  const fmtTime = (s: string) => parseSafeDate(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/25 dark:bg-white/[0.02]">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
          <div key={d} className={`py-3 text-center border-r border-border last:border-r-0
            ${(i===0||i===6) ? 'bg-muted/40 dark:bg-white/[0.025]' : ''}`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border min-h-[580px]">
        {cells.map(({ date: d, isCur }, idx) => {
          const dayEvts = getEvents(d);
          const isToday = today.toDateString() === d.toDateString();
          const isWknd = d.getDay() === 0 || d.getDay() === 6;

          return (
            <div key={idx}
              className={`p-2 flex flex-col min-h-[95px] transition-colors duration-100
                ${!isCur ? 'bg-muted/15'
                  : isWknd ? 'bg-muted/5'
                  : 'bg-background'}
                hover:bg-muted/20
                ${isToday ? 'ring-1 ring-inset ring-primary/30' : ''}`}>

              {/* Day number */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[12px] font-bold h-6 w-6 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-[#F97316] text-white font-black shadow shadow-[#F97316]/40'
                    : isCur ? (isWknd ? 'text-muted-foreground' : 'text-foreground')
                    : 'text-muted-foreground/30'}`}>
                  {d.getDate()}
                </span>
                {dayEvts.length > 0 && <span className="md:hidden h-1.5 w-1.5 rounded-full bg-primary" />}
              </div>

            <div className="flex items-center gap-3 md:hidden" style={{ maxHeight: 80 }}>
                {dayEvts.slice(0, 3).map(ev => {
                  const a = getEventAccent(ev.id, ev.title, ev.color);
                  return (
                    <div key={ev.id}
                         title={`${ev.title} · ${fmtTime(ev.start_time)}`}
                         className="flex items-center gap-1 px-1.5 py-[3px] rounded-[5px] overflow-hidden cursor-default hover:brightness-95 transition-all border border-border"
                         style={{ 
                           background: `${a.hex}0D`,
                           borderLeft: `2.5px solid ${a.hex}` 
                         }}>
                      {ev.source === 'google_calendar' ? <GoogleGIcon /> : (
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: a.hex }} />
                      )}
                      <span className="text-[10.5px] font-bold truncate" style={{ color: a.hex }}>
                        {ev.title}
                      </span>
                      <span className="ml-auto shrink-0 pl-1 text-[9px] font-medium text-muted-foreground">
                        {fmtTime(ev.start_time)}
                      </span>
                    </div>
                  );
                })}
                {dayEvts.length > 3 && (
                  <span className="text-[9.5px] font-bold text-primary/70 pl-1 mt-0.5">+{dayEvts.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
