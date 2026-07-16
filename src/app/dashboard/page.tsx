'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Attendee {
  email?: string;
  displayName?: string;
  responseStatus?: string;
}

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  attendees: Attendee[];
  source: string;
}

interface Message {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  flagged: boolean;
  source: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  due_date: string;
  source: string;
}

interface Document {
  id: string;
  title: string;
  url: string;
  last_modified: string;
  source: string;
}

interface SyncJob {
  id: string;
  connector: string;
  status: string;
  items_synced: number;
  started_at: string;
  completed_at: string;
}

interface DashboardData {
  events: Event[];
  messages: Message[];
  tasks: Task[];
  documents: Document[];
  syncJobs: SyncJob[];
  stats: {
    totalEvents: number;
    totalMessages: number;
    totalTasks: number;
    totalDocuments: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleSync = async (connector: 'google' | 'notion') => {
    setSyncing(true);
    setSyncMessage(`Syncing ${connector}...`);
    
    try {
      const response = await fetch(`/api/connectors/${connector}/sync`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setSyncMessage(`✅ ${connector} synced! Refreshing...`);
        setTimeout(() => {
          fetchDashboard();
          setSyncMessage('');
        }, 2000);
      } else {
        setSyncMessage(`❌ ${connector} sync failed`);
      }
    } catch (error) {
      setSyncMessage(`❌ Error: ${error}`);
    } finally {
      setSyncing(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">
              Today
            </h1>
            <p className="text-muted-foreground font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/"
              className="px-4 py-2 bg-white border border-border text-foreground rounded-xl hover:bg-muted font-bold text-sm shadow-sm transition-colors flex items-center"
            >
              ← Home
            </Link>
            <button
              onClick={() => handleSync('google')}
              disabled={syncing}
              className="px-4 py-2 bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#9C651F] hover:to-[#B7792B] text-white rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer flex items-center gap-2"
            >
              🔄 Sync Google
            </button>
            <button
              onClick={() => handleSync('notion')}
              disabled={syncing}
              className="px-4 py-2 bg-gradient-to-r from-[#C17817] to-[#D89A3E] hover:from-[#9C651F] hover:to-[#B7792B] text-white rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer flex items-center gap-2"
            >
              🔄 Sync Notion
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-4 p-4 bg-muted border border-border text-primary rounded-xl text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Events', count: data?.stats?.totalEvents || 0 },
            { label: 'Messages', count: data?.stats?.totalMessages || 0 },
            { label: 'Tasks', count: data?.stats?.totalTasks || 0 },
            { label: 'Documents', count: data?.stats?.totalDocuments || 0 }
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border p-6 rounded-2xl shadow-[0_8px_30px_rgb(232,221,210,0.15)] flex flex-col justify-between hover:border-[#B7792B]/30 transition-all duration-300">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <h3 className="text-3.5xl font-extrabold mt-3 tracking-tight text-[#B7792B]">{stat.count}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Events - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_30px_rgb(232,221,210,0.15)] p-6">
            <h2 className="text-2xl font-extrabold text-foreground mb-4 flex items-center gap-2">
              📅 Calendar Events
              <span className="text-sm text-muted-foreground font-normal">
                (Next 7 days)
              </span>
            </h2>
            
            {data?.events && data.events.length > 0 ? (
              <div className="space-y-3">
                {data.events.map((event) => (
                  <div
                    key={event.id}
                    className="border border-border rounded-xl p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground font-medium">
                          <span>🕐 {formatTime(event.start_time)}</span>
                          <span>📆 {formatDate(event.start_time)}</span>
                          {event.attendees && event.attendees.length > 0 && (
                            <span>👥 {event.attendees.length} attendees</span>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                        {event.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm font-medium">
                No events found. Click &quot;Sync Google&quot; to fetch your calendar events.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Tasks & Messages */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tasks */}
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_30px_rgb(232,221,210,0.15)] p-6">
            <h2 className="text-2xl font-extrabold text-foreground mb-4">
              ✅ Tasks
            </h2>
            
            {data?.tasks && data.tasks.length > 0 ? (
              <div className="space-y-3">
                {data.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-border rounded-xl p-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <h3 className="font-bold text-foreground text-sm">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-2.5 text-xs">
                      {task.status && (
                        <span className="bg-[#F3E3C9] text-[#B7792B] border border-[#E5DDD0] px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {task.status}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="text-muted-foreground font-medium">
                          Due: {formatDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm font-medium">
                No tasks. Sync Notion to see your tasks here.
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_30px_rgb(232,221,210,0.15)] p-6">
            <h2 className="text-2xl font-extrabold text-foreground mb-4">
              ✉️ Messages
            </h2>
            
            {data?.messages && data.messages.length > 0 ? (
              <div className="space-y-3">
                {data.messages.slice(0, 5).map((message) => (
                  <div
                    key={message.id}
                    className="border border-border rounded-xl p-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      {message.flagged && <span className="text-[#B7792B] text-xs">⭐</span>}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider">
                          {message.sender}
                        </div>
                        <h3 className="font-bold text-foreground text-sm truncate mt-0.5">
                          {message.subject || '(No subject)'}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {message.snippet}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm font-medium">
                No messages found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Status */}
      {data?.syncJobs && data.syncJobs.length > 0 && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_30px_rgb(232,221,210,0.15)] p-6">
            <h2 className="text-xl font-extrabold text-foreground mb-4">
              🔄 Recent Syncs
            </h2>
            <div className="space-y-1">
              {data.syncJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex justify-between items-center text-sm border-b border-border py-3 last:border-0"
                >
                  <div className="flex gap-3 items-center">
                    <span className="font-bold text-foreground capitalize">
                      {job.connector}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      job.status === 'completed' 
                        ? 'bg-[#22C55E]/10 text-[#22C55E]'
                        : job.status === 'failed'
                        ? 'bg-[#EF4444]/10 text-[#EF4444]'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}>
                      {job.status}
                    </span>
                    {job.status === 'completed' && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {job.items_synced} items
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">
                    {new Date(job.started_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
