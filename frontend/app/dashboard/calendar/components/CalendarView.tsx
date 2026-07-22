'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Event } from '@/types';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import AgendaView from './AgendaView';

interface CalendarViewProps {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  viewMode: 'month' | 'week' | 'day' | 'agenda';
  setViewMode: (mode: 'month' | 'week' | 'day' | 'agenda') => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function CalendarView({
  events,
  isLoading,
  isError,
  viewMode,
  setViewMode,
  currentDate,
  setCurrentDate
}: CalendarViewProps) {
  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === 'month') {
      nextDate.setMonth(currentDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      nextDate.setDate(currentDate.getDate() - 7);
    } else if (viewMode === 'day') {
      nextDate.setDate(currentDate.getDate() - 1);
    } else {
      nextDate.setDate(currentDate.getDate() - 30); // agenda moves by month
    }
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === 'month') {
      nextDate.setMonth(currentDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      nextDate.setDate(currentDate.getDate() + 7);
    } else if (viewMode === 'day') {
      nextDate.setDate(currentDate.getDate() + 1);
    } else {
      nextDate.setDate(currentDate.getDate() + 30);
    }
    setCurrentDate(nextDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatHeaderTitle = () => {
    if (viewMode === 'month' || viewMode === 'agenda') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const getStartOfWeek = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.setDate(diff));
      };
      const start = getStartOfWeek(currentDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getFullYear()}`;
      }
      return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short' })} ${start.getFullYear()}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton controls */}
        <div className="h-14 bg-card border border-border rounded-2xl animate-pulse" />
        {/* Skeleton grid */}
        <div className="h-[450px] bg-card border border-border rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-2xl bg-card">
        <AlertCircle className="h-10 w-10 text-danger mb-3" />
        <h4 className="font-bold text-foreground">Failed to load calendar events</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">Could not fetch events from the Supabase database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Navigation controls */}
      <div className="flex flex-row items-center justify-between select-none">
        {/* Today and pagination buttons */}
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-r border-border"
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 border border-border rounded-xl bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-sm"
          >
            Today
          </button>
        </div>

        {/* Current Date Title */}
        <h2 className="text-base font-bold text-foreground tracking-wide">
          {formatHeaderTitle()}
        </h2>

        {/* Spacer to align center */}
        <div className="w-[120px] hidden sm:block" />
      </div>

      {/* Interactive Active View rendered with Framer Motion transitions */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${currentDate.toISOString()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'month' && (
              <MonthView
                currentDate={currentDate}
                events={events}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                currentDate={currentDate}
                events={events}
              />
            )}
            {viewMode === 'day' && (
              <DayView
                currentDate={currentDate}
                events={events}
              />
            )}
            {viewMode === 'agenda' && (
              <AgendaView
                events={events}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
