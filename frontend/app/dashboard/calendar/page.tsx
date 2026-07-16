'use client';

import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Calendar as CalendarIcon, RefreshCw, AlertCircle, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const { data, isLoading, isError, refetch, syncGoogle, isSyncingGoogle } = useDashboard();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('agenda');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-card border border-border rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-danger mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load calendar events</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Group events by day for Agenda View
  const groupedEvents = data.events.reduce((groups: Record<string, typeof data.events>, event) => {
    const dateStr = new Date(event.start_time).toDateString();
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(event);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" /> Google Calendar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Display schedules and meetings synchronized from Google Calendar.
          </p>
        </div>

        <button
          onClick={() => syncGoogle()}
          disabled={isSyncingGoogle}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all self-start shadow shadow-primary/10"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
          Sync Google Calendar
        </button>
      </div>

      {/* View Selector Controls */}
      <div className="glass border border-border p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold px-2">Next 7 Days</span>
          <button className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode Buttons */}
        <div className="flex bg-muted/65 border border-border p-0.5 rounded-lg text-xs">
          {(['month', 'week', 'day', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all ${viewMode === mode ? 'bg-card text-foreground shadow' : 'text-muted-foreground'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Main Grid / Listings */}
      {viewMode === 'agenda' ? (
        <div className="space-y-6">
          {Object.keys(groupedEvents).length > 0 ? (
            Object.entries(groupedEvents).map(([dateStr, events]) => (
              <div key={dateStr} className="space-y-3">
                <h3 className="text-sm font-bold text-primary tracking-wide border-b border-border pb-1">
                  {formatDate(events[0].start_time)}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/35 transition-all shadow-sm"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {formatTime(event.start_time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </span>
                          {event.attendees && event.attendees.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-primary" />
                              {event.attendees.length} attendees
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Attendee pills */}
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center max-w-xs justify-end">
                          {event.attendees.slice(0, 3).map((att, idx) => (
                            <span
                              key={idx}
                              title={`${att.displayName || att.email} (${att.responseStatus || 'no response'})`}
                              className="text-[9px] font-semibold bg-muted border border-border px-2 py-0.5 rounded truncate max-w-[100px]"
                            >
                              {att.displayName || att.email?.split('@')[0]}
                            </span>
                          ))}
                          {event.attendees.length > 3 && (
                            <span className="text-[9px] font-bold text-muted-foreground px-1">
                              +{event.attendees.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/20">
              <CalendarIcon className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
              <h3 className="font-bold text-foreground">No events scheduled</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                No calendar meetings found in the database. Trigger a Google Sync to fetch them.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Render a calendar skeleton for month/week/day views since the database query returns list format */
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <CalendarIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Detailed {viewMode} Grid View</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            The {viewMode} grid view shows synchronized events from Google Calendar. 
            For best readability, we recommend the <strong>Agenda</strong> view.
          </p>
          <button
            onClick={() => setViewMode('agenda')}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all"
          >
            Switch to Agenda View
          </button>
        </div>
      )}
    </div>
  );
}
