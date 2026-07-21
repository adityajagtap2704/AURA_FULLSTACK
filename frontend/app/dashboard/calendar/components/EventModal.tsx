'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, FileText, Bell, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, Attendee } from '@/types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null; // If provided, we are in Edit Mode
  selectedDate?: Date | null; // If provided, default date for new event
  onSave: (eventData: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const CATEGORY_COLORS = [
  { value: 'orange', label: 'Orange', bg: 'bg-[#F97316]', text: 'text-[#F97316]', border: 'border-[#F97316]' },
  { value: 'blue', label: 'Blue', bg: 'bg-[#3B82F6]', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]' },
  { value: 'green', label: 'Green', bg: 'bg-[#10B981]', text: 'text-[#10B981]', border: 'border-[#10B981]' },
  { value: 'purple', label: 'Purple', bg: 'bg-[#8B5CF6]', text: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]' },
  { value: 'red', label: 'Red', bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', border: 'border-[#EF4444]' },
  { value: 'pink', label: 'Pink', bg: 'bg-[#EC4899]', text: 'text-[#EC4899]', border: 'border-[#EC4899]' },
  { value: 'grey', label: 'Grey', bg: 'bg-[#6B7280]', text: 'text-[#6B7280]', border: 'border-[#6B7280]' },
];

const HOURS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const parseTime = (timeStr: string) => {
  const [hStr, mStr] = timeStr.split(':');
  const h24 = parseInt(hStr || '9');
  const m = mStr || '00';
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const formattedMin = String(parseInt(m)).padStart(2, '0');

  return { hour: String(h12), minute: formattedMin, ampm };
};

const formatTo24h = (h12: string, min: string, ampm: string) => {
  let h24 = parseInt(h12);
  if (ampm === 'PM' && h24 < 12) h24 += 12;
  if (ampm === 'AM' && h24 === 12) h24 = 0;
  return `${String(h24).padStart(2, '0')}:${min}`;
};

const formatTimeDisplay = (timeStr: string) => {
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${mStr} ${ampm}`;
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return 'Select date';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function EventModal({
  isOpen,
  onClose,
  event,
  selectedDate,
  onSave,
  onDelete
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Date and Time picker states
  const [date, setDate] = useState(''); // e.g. "2026-07-19"
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  
  // Custom picker visibility
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  
  // Custom Date Picker Month/Year state
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const [color, setColor] = useState('orange');
  const [reminder, setReminder] = useState('none');
  const [meetingLink, setMeetingLink] = useState('');
  const [attendeesText, setAttendeesText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initial load
  const parseSafeDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const formatted = dateStr.replace(' ', 'T');
    return new Date(formatted);
  };

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      
      // parseSafeDate returns a JS Date whose .getHours()/.getFullYear() etc. are already LOCAL.
      // Do NOT re-apply offset – that's the double-shift bug.
      const eventDate = event.start_time ? parseSafeDate(event.start_time) : new Date();

      // Build YYYY-MM-DD using LOCAL year/month/day (not UTC)
      const yy = eventDate.getFullYear();
      const mm = String(eventDate.getMonth() + 1).padStart(2, '0');
      const dd = String(eventDate.getDate()).padStart(2, '0');
      const dateStr = `${yy}-${mm}-${dd}`;
      setDate(dateStr);

      setPickerMonth(eventDate.getMonth());
      setPickerYear(eventDate.getFullYear());

      const formatTime = (d: Date) => {
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      };

      setStartTime(formatTime(eventDate));
      if (event.end_time) {
        setEndTime(formatTime(parseSafeDate(event.end_time)));
      } else {
        setEndTime('10:00');
      }

      setColor(event.color || 'orange');
      setReminder(event.reminder || 'none');
      setMeetingLink(event.meeting_link || '');

      const attendeesList = event.attendees || [];
      setAttendeesText(attendeesList.map((a: Attendee) => a.email).filter(Boolean).join(', '));
    } else {
      setTitle('');
      setDescription('');

      const defaultDate = selectedDate ? new Date(selectedDate) : new Date();
      const yy = defaultDate.getFullYear();
      const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
      const dd = String(defaultDate.getDate()).padStart(2, '0');
      const dateStr = `${yy}-${mm}-${dd}`;
      setDate(dateStr);

      setPickerMonth(defaultDate.getMonth());
      setPickerYear(defaultDate.getFullYear());

      setStartTime('09:00');
      setEndTime('10:00');
      setColor('orange');
      setReminder('none');
      setMeetingLink('');
      setAttendeesText('');
    }
    setError('');
    setIsDatePickerOpen(false);
    setIsStartTimePickerOpen(false);
    setIsEndTimePickerOpen(false);
  }, [event, selectedDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const endDateTime = new Date(`${date}T${endTime}:00`);
      
      const parsedAttendees = attendeesText
        .split(',')
        .map(email => email.trim())
        .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        .map(email => ({ email, responseStatus: 'needsAction' }));

      const payload = {
        title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        description: description || null,
        color,
        reminder,
        meeting_link: meetingLink || null,
        attendees: parsedAttendees,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !onDelete) return;
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        setIsSubmitting(true);
        await onDelete(event.id);
        onClose();
      } catch (err: any) {
        setError('Failed to delete event');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Date Picker Grid calculation helpers
  const datePickerGrid = useMemo(() => {
    const firstDayIndex = new Date(pickerYear, pickerMonth, 1).getDay();
    const totalDays = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(pickerYear, pickerMonth, 0).getDate();
    
    const cells: { dateStr: string; day: number; isCurrentMonth: boolean; isPast: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Prev month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const cellDate = new Date(pickerYear, pickerMonth - 1, d);
      cells.push({
        dateStr: `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: false,
        isPast: cellDate < today
      });
    }

    // 2. Current month days
    for (let i = 1; i <= totalDays; i++) {
      const cellDate = new Date(pickerYear, pickerMonth, i);
      cells.push({
        dateStr: `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        day: i,
        isCurrentMonth: true,
        isPast: cellDate < today
      });
    }

    // 3. Next month leading days to complete grid
    const totalSlots = 42;
    const remaining = totalSlots - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const cellDate = new Date(pickerYear, pickerMonth + 1, i);
      cells.push({
        dateStr: `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        day: i,
        isCurrentMonth: false,
        isPast: cellDate < today
      });
    }

    return cells;
  }, [pickerMonth, pickerYear]);

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(prev => prev - 1);
    } else {
      setPickerMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(prev => prev + 1);
    } else {
      setPickerMonth(prev => prev + 1);
    }
  };

  const monthLabel = new Date(pickerYear, pickerMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Start & End Time parsed states
  const startTimeParsed = useMemo(() => parseTime(startTime), [startTime]);
  const endTimeParsed = useMemo(() => parseTime(endTime), [endTime]);

  const handleStartTimeChange = (h: string, m: string, ampm: string) => {
    const val = formatTo24h(h, m, ampm);
    setStartTime(val);
  };

  const handleEndTimeChange = (h: string, m: string, ampm: string) => {
    const val = formatTo24h(h, m, ampm);
    setEndTime(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-primary" />
                {event ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto overflow-x-visible relative">
              {error && (
                <div className="p-3 text-xs bg-danger/10 text-danger rounded-xl border border-danger/25">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Design Critique"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2.5 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Date and Times custom premium selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-20">
                
                {/* Date Picker */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" /> Date
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsDatePickerOpen(!isDatePickerOpen);
                      setIsStartTimePickerOpen(false);
                      setIsEndTimePickerOpen(false);
                    }}
                    className="w-full flex items-center justify-between rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-xs text-foreground text-left focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all select-none hover:bg-muted/60"
                  >
                    <span className="truncate font-semibold">{formatDateDisplay(date)}</span>
                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60 rotate-270 shrink-0" />
                  </button>

                  {isDatePickerOpen && (
                    <>
                      {/* Invisible backdrop click-catcher */}
                      <div className="fixed inset-0 z-10" onClick={() => setIsDatePickerOpen(false)} />
                      
                      {/* Calendar Dropdown popover */}
                      <div className="absolute left-0 mt-1.5 z-20 w-[265px] bg-card border border-border rounded-2xl shadow-xl p-4 select-none">
                        <div className="flex items-center justify-between mb-3">
                          <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-all">
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-xs font-bold text-foreground">{monthLabel}</span>
                          <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Days Grid header */}
                        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-muted-foreground mb-1">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
                        </div>

                        {/* Calendar Days (previous dates disabled here as requested) */}
                        <div className="grid grid-cols-7 text-center gap-1 text-xs">
                          {datePickerGrid.map((cell) => {
                            const isSelected = date === cell.dateStr;
                            
                            return (
                              <button
                                key={cell.dateStr}
                                type="button"
                                disabled={cell.isPast}
                                onClick={() => {
                                  setDate(cell.dateStr);
                                  setIsDatePickerOpen(false);
                                }}
                                className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-[#F97316] text-white font-bold shadow shadow-[#F97316]/20'
                                    : cell.isPast
                                      ? 'text-muted-foreground/35 cursor-not-allowed line-through'
                                      : cell.isCurrentMonth
                                        ? 'text-foreground hover:bg-muted font-medium'
                                        : 'text-muted-foreground/50 hover:bg-muted/40 font-normal'
                                }`}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Start Time Picker (Custom 3-column scrollpicker: Hr, Min, AM/PM) */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" /> Start Time
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsStartTimePickerOpen(!isStartTimePickerOpen);
                      setIsDatePickerOpen(false);
                      setIsEndTimePickerOpen(false);
                    }}
                    className="w-full flex items-center justify-between rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-xs text-foreground text-left focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all select-none hover:bg-muted/60"
                  >
                    <span className="truncate font-semibold">{formatTimeDisplay(startTime)}</span>
                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60 rotate-270 shrink-0" />
                  </button>

                  {isStartTimePickerOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsStartTimePickerOpen(false)} />
                      <div className="absolute left-0 mt-1.5 z-20 w-[190px] bg-card border border-border rounded-2xl shadow-xl p-3 select-none flex gap-2">
                        
                        {/* Hour Column */}
                        <div className="flex-1 max-h-48 overflow-y-auto scrollbar-thin flex flex-col gap-0.5">
                          {HOURS.map((h) => {
                            const isSel = startTimeParsed.hour === h;
                            return (
                              <button
                                type="button"
                                key={h}
                                onClick={() => handleStartTimeChange(h, startTimeParsed.minute, startTimeParsed.ampm)}
                                className={`py-1 text-center text-xs font-semibold rounded-lg transition-colors ${
                                  isSel ? 'bg-[#F97316] text-white font-bold shadow-sm shadow-[#F97316]/20' : 'text-foreground hover:bg-muted'
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </div>

                        {/* Minute Column */}
                        <div className="flex-1 max-h-48 overflow-y-auto scrollbar-thin flex flex-col gap-0.5">
                          {MINUTES.map((m) => {
                            const isSel = startTimeParsed.minute === m;
                            return (
                              <button
                                type="button"
                                key={m}
                                onClick={() => handleStartTimeChange(startTimeParsed.hour, m, startTimeParsed.ampm)}
                                className={`py-1 text-center text-xs font-semibold rounded-lg transition-colors ${
                                  isSel ? 'bg-[#F97316] text-white font-bold shadow-sm shadow-[#F97316]/20' : 'text-foreground hover:bg-muted'
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>

                        {/* AM/PM Column */}
                        <div className="flex flex-col gap-1.5 justify-center">
                          {['AM', 'PM'].map((a) => {
                            const isSel = startTimeParsed.ampm === a;
                            return (
                              <button
                                type="button"
                                key={a}
                                onClick={() => handleStartTimeChange(startTimeParsed.hour, startTimeParsed.minute, a)}
                                className={`px-2 py-1 text-center text-[10px] font-bold rounded-lg border transition-colors ${
                                  isSel ? 'bg-[#F97316] text-white border-transparent' : 'text-foreground hover:bg-muted border-border'
                                }`}
                              >
                                {a}
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    </>
                  )}
                </div>

                {/* End Time Picker (Custom 3-column scrollpicker: Hr, Min, AM/PM) */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-primary" /> End Time
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsEndTimePickerOpen(!isEndTimePickerOpen);
                      setIsDatePickerOpen(false);
                      setIsStartTimePickerOpen(false);
                    }}
                    className="w-full flex items-center justify-between rounded-xl bg-muted/40 border border-border px-3.5 py-2.5 text-xs text-foreground text-left focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all select-none hover:bg-muted/60"
                  >
                    <span className="truncate font-semibold">{formatTimeDisplay(endTime)}</span>
                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60 rotate-270 shrink-0" />
                  </button>

                  {isEndTimePickerOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsEndTimePickerOpen(false)} />
                      <div className="absolute right-0 mt-1.5 z-20 w-[190px] bg-card border border-border rounded-2xl shadow-xl p-3 select-none flex gap-2">
                        
                        {/* Hour Column */}
                        <div className="flex-1 max-h-48 overflow-y-auto scrollbar-thin flex flex-col gap-0.5">
                          {HOURS.map((h) => {
                            const isSel = endTimeParsed.hour === h;
                            return (
                              <button
                                type="button"
                                key={h}
                                onClick={() => handleEndTimeChange(h, endTimeParsed.minute, endTimeParsed.ampm)}
                                className={`py-1 text-center text-xs font-semibold rounded-lg transition-colors ${
                                  isSel ? 'bg-[#F97316] text-white font-bold shadow-sm shadow-[#F97316]/20' : 'text-foreground hover:bg-muted'
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </div>

                        {/* Minute Column */}
                        <div className="flex-1 max-h-48 overflow-y-auto scrollbar-thin flex flex-col gap-0.5">
                          {MINUTES.map((m) => {
                            const isSel = endTimeParsed.minute === m;
                            return (
                              <button
                                type="button"
                                key={m}
                                onClick={() => handleEndTimeChange(endTimeParsed.hour, m, endTimeParsed.ampm)}
                                className={`py-1 text-center text-xs font-semibold rounded-lg transition-colors ${
                                  isSel ? 'bg-[#F97316] text-white font-bold shadow-sm shadow-[#F97316]/20' : 'text-foreground hover:bg-muted'
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>

                        {/* AM/PM Column */}
                        <div className="flex flex-col gap-1.5 justify-center">
                          {['AM', 'PM'].map((a) => {
                            const isSel = endTimeParsed.ampm === a;
                            return (
                              <button
                                type="button"
                                key={a}
                                onClick={() => handleEndTimeChange(endTimeParsed.hour, endTimeParsed.minute, a)}
                                className={`px-2 py-1 text-center text-[10px] font-bold rounded-lg border transition-colors ${
                                  isSel ? 'bg-[#F97316] text-white border-transparent' : 'text-foreground hover:bg-muted border-border'
                                }`}
                              >
                                {a}
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Category Color Picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORY_COLORS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setColor(item.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        color === item.value
                          ? `${item.border} ${item.text} bg-muted/50 ring-1 ring-offset-1 ring-primary/20`
                          : 'border-border text-muted-foreground hover:bg-muted/30'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${item.bg}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Description
                </label>
                <textarea
                  placeholder="Describe the agenda or details of this event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2.5 text-xs outline-none resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Meeting Link */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Video className="h-3 w-3" /> Meeting Link (Zoom / Meet / Teams)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2.5 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Reminder option */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Bell className="h-3 w-3" /> Reminders
                </label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-3 py-2.5 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                >
                  <option value="none">No Reminder</option>
                  <option value="5_min">5 minutes before</option>
                  <option value="15_min">15 minutes before</option>
                  <option value="30_min">30 minutes before</option>
                  <option value="1_hour">1 hour before</option>
                </select>
              </div>

              {/* Event Source info (if editing) */}
              {event && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-muted/20 select-none">
                  <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wide">Sync Source</span>
                  <div className="flex items-center gap-1.5">
                    {event.source === 'google_calendar' ? (
                      <>
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.63-.35-1.3-.35-1.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                        <span className="text-xs font-bold text-foreground">Google Calendar (Synced)</span>
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-[#F97316]" />
                        <span className="text-xs font-bold text-foreground">AURA Calendar (Local)</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Attendees list */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> Invite Attendees
                </label>
                <input
                  type="text"
                  placeholder="e.g. collab@company.com, developer@company.com"
                  value={attendeesText}
                  onChange={(e) => setAttendeesText(e.target.value)}
                  className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2.5 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <span className="text-[10px] text-muted-foreground">Separate multiple email addresses with commas.</span>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
              {event ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-2 bg-danger/10 text-danger hover:bg-danger hover:text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-border text-muted-foreground hover:bg-muted text-xs font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#F97316] text-white text-xs font-semibold rounded-xl hover:bg-[#F97316]/95 shadow shadow-primary/10 transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
