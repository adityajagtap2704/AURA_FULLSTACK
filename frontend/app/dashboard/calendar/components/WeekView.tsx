'use client';

import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { Clock, Video, MapPin } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
}

const COLOR_MAP: Record<string, { bg: string, text: string, timeText: string, border: string }> = {
  orange: { bg: 'bg-[#FFF7ED]', text: 'text-[#9A3412]', timeText: 'text-[#C2410C]', border: 'border-l-[4px] border-[#F97316]' }, // Personal
  blue:   { bg: 'bg-[#EFF6FF]', text: 'text-[#1E40AF]', timeText: 'text-[#3B82F6]', border: 'border-l-[4px] border-[#3B82F6]' }, // Meetings
  green:  { bg: 'bg-[#F0FDF4]', text: 'text-[#166534]', timeText: 'text-[#15803D]', border: 'border-l-[4px] border-[#10B981]' }, // Reminders
  purple: { bg: 'bg-[#F5F3FF]', text: 'text-[#5B21B6]', timeText: 'text-[#6D28D9]', border: 'border-l-[4px] border-[#8B5CF6]' }, // Tasks
  yellow: { bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', timeText: 'text-[#B45309]', border: 'border-l-[4px] border-[#F59E0B]' }, 
  red:    { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', timeText: 'text-[#B91C1C]', border: 'border-l-[4px] border-[#EF4444]' }, // Holidays
  pink:   { bg: 'bg-[#FDF2F8]', text: 'text-[#9D174D]', timeText: 'text-[#BE185D]', border: 'border-l-[4px] border-[#EC4899]' }, 
  grey:   { bg: 'bg-[#F9FAFB]', text: 'text-[#374151]', timeText: 'text-[#4B5563]', border: 'border-l-[4px] border-[#6B7280]' }, 
};

export default function WeekView({ currentDate, events }: WeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const startHour = 6; // 6:00 AM
  const endHour = 22;  // 10:00 PM
  const totalHours = endHour - startHour + 1;
  const hourHeight = 60; // height of each hour slot in pixels

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to 8 AM (index 2) on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 120;
    }
  }, []);

  // Get start of the week (Sunday)
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);

  // Generate 7 days of the week
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push(d);
  }

  const parseSafeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    try {
      const parts = dateStr.replace(' ', 'T').split('T');
      const datePart = parts[0];
      let timePart = parts[1] || '00:00:00';
      timePart = timePart.split(/[Z+]/)[0];
      const lastMinus = timePart.lastIndexOf('-');
      if (lastMinus > timePart.lastIndexOf(':')) {
        timePart = timePart.substring(0, lastMinus);
      }
      return new Date(`${datePart}T${timePart}`);
    } catch {
      return new Date(dateStr);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = parseSafeDate(event.start_time);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
  };

  // Generate hours list for left column
  const hours: number[] = [];
  for (let i = startHour; i <= endHour; i++) {
    hours.push(i);
  }

  // Calculate local timezone suffix
  const tzString = (() => {
    try {
      const tzOffsetMin = -new Date().getTimezoneOffset();
      const tzOffsetHrs = Math.floor(Math.abs(tzOffsetMin) / 60);
      const tzSign = tzOffsetMin >= 0 ? '+' : '-';
      return `GMT${tzSign}${tzOffsetHrs}`;
    } catch {
      return 'UTC';
    }
  })();

  const today = new Date();

  // Position indicator line details
  const getTimelinePosition = () => {
    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    if (currentHour < startHour || currentHour > endHour) return null;
    
    const elapsedHours = (currentHour - startHour) + (currentMin / 60);
    return elapsedHours * hourHeight;
  };

  const currentTimelinePos = getTimelinePosition();

  return (
    <div className="flex flex-col border border-[#EAECEF] rounded-2xl bg-[#FAFAF8] p-4 shadow-sm overflow-hidden select-none h-[550px] min-w-[760px] md:min-w-full">
      
      {/* Self-contained custom scrollbar styling matching specs (thin rounded thumb) */}
      <style jsx global>{`
        .calendar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .calendar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .calendar-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1; /* slate-300 */
          border-radius: 9999px;
          transition: background-color 0.2s ease;
        }
        .calendar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8; /* slate-400 */
        }
        .calendar-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Main Calendar Grid Block */}
      <div className="flex flex-col bg-white border border-[#EAECEF] rounded-[16px] overflow-hidden flex-1 shadow-xs">
        
        {/* 1. Header Row */}
        <div className="flex bg-white border-b border-[#EAECEF] shrink-0 z-10">
          {/* Top-left Timezone block */}
          <div className="w-[70px] sm:w-[80px] shrink-0 border-r border-[#EAECEF] flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase select-none">
            {tzString}
          </div>

          {/* 7 Days columns headers */}
          <div className="flex-1 grid grid-cols-7">
            {weekDays.map((day, idx) => {
              const isToday =
                today.getDate() === day.getDate() &&
                today.getMonth() === day.getMonth() &&
                today.getFullYear() === day.getFullYear();

              return (
                <div 
                  key={idx} 
                  className={`py-2 text-center flex flex-col items-center justify-center border-r border-[#EAECEF] last:border-r-0 ${
                    isToday ? 'bg-[#FFF7ED]/40' : ''
                  }`}
                >
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isToday ? 'text-[#C97A3D]' : 'text-gray-400'
                  }`}>
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span
                    className={`text-[14px] font-extrabold mt-1 flex items-center justify-center h-7 w-7 rounded-full ${
                      isToday
                        ? 'bg-[#C97A3D] text-white shadow-sm shadow-[#C97A3D]/25'
                        : 'text-gray-700'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Scrollable Time Grid Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto relative calendar-scrollbar bg-white"
        >
          <div className="flex w-full relative" style={{ height: `${totalHours * hourHeight + 20}px` }}>
            
            {/* A. Left Time labels */}
            <div className="w-[70px] sm:w-[80px] shrink-0 border-r border-[#EAECEF] relative bg-white select-none">
              {hours.map((hour, idx) => {
                const displayTime = hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                return (
                  <div 
                    key={hour} 
                    className="absolute left-0 right-2.5 text-right text-[10px] font-bold text-gray-400/80"
                    style={{ top: `${idx === 0 ? 4 : idx * hourHeight - 7}px` }}
                  >
                    {displayTime}
                  </div>
                );
              })}
            </div>

            {/* B. Grid Columns Container */}
            <div className="flex-1 relative h-full">
              
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                {hours.map((_, idx) => (
                  <div 
                    key={idx} 
                    className="border-b border-[#EAECEF]/80 w-full"
                    style={{ height: `${hourHeight}px` }}
                  />
                ))}
              </div>

              {/* Vertical column partitions */}
              <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                {weekDays.map((day, idx) => {
                  const isToday =
                    today.getDate() === day.getDate() &&
                    today.getMonth() === day.getMonth() &&
                    today.getFullYear() === day.getFullYear();
                  return (
                    <div 
                      key={idx} 
                      className={`border-r border-[#EAECEF]/60 last:border-r-0 h-full ${
                        isToday ? 'bg-[#FFF7ED]' : ''
                      }`}
                    />
                  );
                })}
              </div>

              {/* Events placement layer */}
              <div className="absolute inset-0 grid grid-cols-7 pointer-events-auto h-full">
                {weekDays.map((day, dayIdx) => {
                  const dayEvents = getEventsForDay(day);

                  // Map events to dimensions
                  const mappedEvents = dayEvents.map(event => {
                    const start = parseSafeDate(event.start_time);
                    const end = event.end_time ? parseSafeDate(event.end_time) : new Date(start.getTime() + 60 * 60 * 1000);
                    
                    const startHrs = start.getHours() + (start.getMinutes() / 60);
                    // Calculate duration in hours based on absolute timestamps to avoid daily wrap-around errors
                    const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    const endHrs = startHrs + durationHrs;

                    // Calculate absolute position inside the grid height
                    const top = Math.max(0, Math.min(totalHours * hourHeight, (startHrs - startHour) * hourHeight));
                    // Standard height capped around 50px-70px for 1-hour events, clamped to not exceed grid boundaries
                    const maxHeight = Math.max(0, (totalHours * hourHeight) - top);
                    const height = Math.max(28, Math.min(maxHeight, durationHrs * hourHeight));

                    return {
                      ...event,
                      top,
                      height,
                      startHrs,
                      endHrs,
                      start,
                      end
                    };
                  }).filter(e => e.startHrs < endHour + 1 && e.endHrs > startHour);

                  // Handle overlaps using column groupings
                  const overlapGroups: typeof mappedEvents[] = [];
                  mappedEvents.forEach(event => {
                    let placed = false;
                    for (const group of overlapGroups) {
                      const overlaps = group.some(item => 
                        event.startHrs < item.endHrs && event.endHrs > item.startHrs
                      );
                      if (overlaps) {
                        group.push(event);
                        placed = true;
                        break;
                      }
                    }
                    if (!placed) {
                      overlapGroups.push([event]);
                    }
                  });

                  const finalCards: any[] = [];
                  overlapGroups.forEach(group => {
                    const count = group.length;
                    group.forEach((event, idx) => {
                      const widthPercent = 100 / count;
                      const leftPercent = idx * widthPercent;
                      finalCards.push({
                        ...event,
                        left: `${leftPercent}%`,
                        width: `${widthPercent - 2}%`
                      });
                    });
                  });

                  return (
                    <div key={dayIdx} className="relative h-full w-full">
                      {finalCards.map((card) => {
                        const colorMeta = COLOR_MAP[card.color || 'orange'] || COLOR_MAP.orange;
                        const hasMeeting = !!card.meeting_link;

                        return (
                          <div
                            key={card.id}
                            style={{
                              top: `${card.top + 2}px`,
                              height: `${card.height - 4}px`,
                              left: card.left,
                              width: card.width,
                            }}
                            className={`absolute rounded-[16px] p-2 flex flex-col justify-between shadow-[0_2px_4px_rgba(0,0,0,0.02)] border-y-0 border-r-0 transition-all hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] select-none overflow-hidden ${colorMeta.bg} ${colorMeta.text} ${colorMeta.border}`}
                            title={`${card.title} (${formatTime(card.start)} - ${formatTime(card.end)})`}
                          >
                            {/* Inner card layout */}
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                              <h4 className="text-[10px] font-extrabold truncate leading-tight flex items-center gap-1 shrink-0">
                                {card.source === 'google_calendar' && (
                                  <span className="h-3.5 w-3.5 rounded bg-white flex items-center justify-center shrink-0 shadow-xs border border-black/5">
                                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
                                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                                    </svg>
                                  </span>
                                )}
                                <span className="truncate">{card.title}</span>
                              </h4>
                              
                              <span className={`text-[9px] font-semibold leading-none shrink-0 ${colorMeta.timeText}`}>
                                {formatTime(card.start)} - {formatTime(card.end)}
                              </span>
                            </div>

                            {/* Meeting/Location details (spacious layout support) */}
                            {card.height >= 48 && (
                              <div className="flex items-center gap-1 mt-0.5 overflow-hidden shrink-0">
                                {hasMeeting ? (
                                  <div className="flex items-center gap-1 text-[9px] truncate">
                                    <Video className="h-2.5 w-2.5 shrink-0" />
                                    <span className="font-extrabold truncate">Google Meet</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-[9px] opacity-70 truncate">
                                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                                    <span className="truncate font-semibold">
                                      {card.source === 'google_calendar' ? 'Calendar' : 'Local'}
                                    </span>
                                  </div>
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

              {/* Current Timeline Position Line Indicator */}
              {currentTimelinePos !== null && (
                <div 
                  className="absolute left-0 right-0 pointer-events-none flex items-center z-20"
                  style={{ top: `${currentTimelinePos}px` }}
                >
                  {/* Circle indicator on Left axis */}
                  <div className="absolute -left-[5px] h-2.5 w-2.5 bg-[#C97A3D] rounded-full shadow-sm ring-2 ring-white" />
                  {/* Horizontal line indicator */}
                  <div className="w-full h-[1.5px] bg-[#C97A3D]/70" />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
