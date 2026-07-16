'use client';

import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { CheckSquare, Search, Filter, Calendar, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function TasksPage() {
  const { data, isLoading, isError, refetch, syncNotion, isSyncingNotion } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'due_date' | 'title'>('due_date');

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
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load tasks</h2>
        <button onClick={() => refetch()} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Retry</button>
      </div>
    );
  }

  // Filter tasks based on search query and status filter
  const filteredTasks = data.tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'done' && task.status === 'Done') || 
      (statusFilter === 'pending' && task.status !== 'Done');
    return matchesSearch && matchesStatus;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'due_date') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status?: string | null) => {
    if (status === 'Done') {
      return <CheckCircle className="h-4.5 w-4.5 text-success" />;
    }
    return <Clock className="h-4.5 w-4.5 text-warning" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" /> Notion Tasks
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse and organize tasks synchronized from your connected Notion databases.
          </p>
        </div>

        <button
          onClick={() => syncNotion()}
          disabled={isSyncingNotion}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/95 transition-all self-start"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncingNotion ? 'animate-spin' : ''}`} />
          Sync Notion Tasks
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute inset-y-0 left-0 pl-3 h-full w-4 text-muted-foreground/60 flex items-center" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-background/50 border border-border pl-9 pr-4 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Buttons */}
          <div className="flex bg-muted/65 border border-border p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${statusFilter === 'all' ? 'bg-card text-foreground shadow' : 'text-muted-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${statusFilter === 'pending' ? 'bg-card text-foreground shadow' : 'text-muted-foreground'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('done')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${statusFilter === 'done' ? 'bg-card text-foreground shadow' : 'text-muted-foreground'}`}
            >
              Completed
            </button>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'due_date' | 'title')}
              className="bg-card border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary transition-all"
            >
              <option value="due_date">Due Date</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/35 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="shrink-0">{getStatusIcon(task.status)}</div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(task.due_date)}
                    </span>
                    <span>•</span>
                    <span className="capitalize">Source: {task.source}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${
                  task.status === 'Done'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-warning/10 text-warning border-warning/20'
                }`}>
                  {task.status || 'Todo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/20">
          <CheckSquare className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
          <h3 className="font-bold text-foreground">No tasks found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
            Try adjusting your search criteria or triggering a Notion sync.
          </p>
        </div>
      )}
    </div>
  );
}
