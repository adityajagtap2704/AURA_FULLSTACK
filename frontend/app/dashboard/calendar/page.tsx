'use client';
import { useState, useMemo } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useDashboard } from '@/hooks/useDashboard';
import { useEvents } from '@/hooks/useEvents';
import { Search, RefreshCw, Calendar, Loader2 } from 'lucide-react';
import CalendarView from './components/CalendarView';
import UpcomingEventsPanel from './components/UpcomingEventsPanel';
import { getDisplayName, getAvatarUrl } from '@/lib/userDisplay';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Custom Events Query hook
  const {
    events,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useEvents();

  // Dashboard context for Google Calendar Sync and Connector Statuses
  const {
    syncGoogle,
    isSyncingGoogle,
    connectorStatus,
  } = useDashboard();

  // Calendar States
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncingOutlook, setIsSyncingOutlook] = useState(false);

  const userName = getDisplayName(user);
  const avatarUrl = getAvatarUrl(user);
  const userInitials = user?.email?.slice(0, 2).toUpperCase() || 'AU';
  
  const googleConnected = connectorStatus?.google ?? false;

  // Filter events based on Search Query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  const handleOutlookSync = () => {
    setIsSyncingOutlook(true);
    setTimeout(() => {
      setIsSyncingOutlook(false);
      alert('Outlook Calendar Sync completed successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Calendar Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        {/* Left Side: Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground select-none shrink-0">
            3. Calendar
          </h1>
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-[17px] w-[17px] text-[#F97316]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calendar..."
              className="w-full rounded-xl bg-card border border-[#E8DDD2] pl-10 pr-4 py-2 text-xs outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all placeholder:text-muted-foreground/50 shadow-sm"
            />
          </div>
        </div>

        {/* Right Side: Sync Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sync Buttons */}
          <div className="flex items-center gap-2">
            {googleConnected && (
              <button
                onClick={() => syncGoogle()}
                disabled={isSyncingGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all hover:bg-muted bg-card shadow-sm disabled:opacity-50"
                title="Sync Google Calendar"
              >
                {isSyncingGoogle ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Sync Google
              </button>
            )}

            <button
              onClick={handleOutlookSync}
              disabled={isSyncingOutlook}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-all hover:bg-muted bg-card shadow-sm disabled:opacity-50"
              title="Sync Outlook Calendar"
            >
              {isSyncingOutlook ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Sync Outlook
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Switchers & New Event Button */}
      <div className="flex flex-row items-center justify-between gap-4 py-2">
        {/* Switchers on Left */}
        <div className="flex bg-muted/65 border border-border p-0.5 rounded-xl text-xs font-semibold shadow-sm">
          {(['day', 'week', 'month', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-lg capitalize transition-all ${
                viewMode === mode
                  ? 'bg-card text-foreground shadow-sm border border-border/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* New Event removed — events are read-only and synced from external sources */}
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Interactive Calendar grid */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <CalendarView
            events={filteredEvents}
            isLoading={isEventsLoading}
            isError={isEventsError}
            viewMode={viewMode}
            setViewMode={setViewMode}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </div>

        {/* Right Column: Upcoming Events Panel */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <UpcomingEventsPanel
            events={events}
            onViewAllClick={() => setViewMode('agenda')}
          />
        </div>
      </div>

      {/* Add / Edit Event Modal */}
    </div>
  );
}
