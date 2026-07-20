'use client';

import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import { CheckSquare, Search, Loader2, LayoutGrid, List, CheckCircle, User } from 'lucide-react';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { motion, AnimatePresence } from 'framer-motion';

type FilterTab = 'All' | 'My Tasks' | 'Kanban' | 'Completed';

const TAB_CONFIG: { id: FilterTab; icon: typeof List }[] = [
  { id: 'All', icon: List },
  { id: 'My Tasks', icon: User },
  { id: 'Kanban', icon: LayoutGrid },
  { id: 'Completed', icon: CheckCircle },
];

export default function TasksPage() {
  const { tasks, isLoading, isError } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('Kanban');

  // Compute filtered task sets for each tab (search applied to all)
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchQuery]);

  const tabTasks = useMemo(() => {
    return {
      All: searchFiltered,
      'My Tasks': searchFiltered.filter((t) => t.source === 'local'),
      Kanban: searchFiltered,
      Completed: searchFiltered.filter((t) => t.status === 'Done'),
    };
  }, [searchFiltered]);

  // Dynamic counts per tab
  const tabCounts = useMemo(() => ({
    All: searchFiltered.length,
    'My Tasks': searchFiltered.filter((t) => t.source === 'local').length,
    Kanban: searchFiltered.length,
    Completed: searchFiltered.filter((t) => t.status === 'Done').length,
  }), [searchFiltered]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Loading your tasks...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="bg-danger/15 p-4 rounded-full mb-4">
          <CheckSquare className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Failed to load tasks</h2>
        <p className="text-muted-foreground mb-6">There was an error connecting to the server.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">
          Reload Page
        </button>
      </div>
    );
  }


  const currentTasks = tabTasks[activeTab];

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <CheckSquare className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
          Tasks
          <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h1>
      </div>

      {/* Search + New Task */}
      <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full">
        <div className="relative w-full sm:w-[75%] lg:w-[80%] shrink-0">
          <Search className="absolute inset-y-0 left-0 pl-4 h-full w-4.5 text-muted-foreground/60 flex items-center" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card/80 backdrop-blur-md border border-border/80 rounded-xl pl-11 pr-16 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted/80 border border-border/80 rounded-md px-2 py-1 shadow-sm">⌘ / Ctrl + K</span>
          </div>
        </div>
        {/* New Task removed — tasks are read-only and synced from external sources */}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-start shrink-0" role="tablist" aria-label="Task filters">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full">
          {TAB_CONFIG.map(({ id, icon: Icon }) => {
            const isActive = activeTab === id;
            const count = tabCounts[id];
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${id}`}
                onClick={() => setActiveTab(id)}
                className={`relative px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 whitespace-nowrap border flex items-center gap-2 ${
                  isActive
                    ? 'bg-card text-primary border-primary/20 shadow-sm'
                    : 'bg-card/40 text-muted-foreground border-border/50 hover:text-foreground hover:bg-card/80 hover:border-border'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTaskTab"
                    className="absolute inset-0 bg-primary/8 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  {id}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-primary/15 text-primary' : 'bg-muted/80 text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative" id={`tabpanel-${activeTab}`} role="tabpanel">
        <AnimatePresence mode="wait">
          {/* ALL tab — full list view */}
          {activeTab === 'All' && (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <TaskListView
                tasks={currentTasks}
                emptyTitle="No tasks yet"
                emptyDescription="Tasks are read-only and synced from external sources."
              />
            </motion.div>
          )}

          {/* MY TASKS tab — locally created tasks only */}
          {activeTab === 'My Tasks' && (
            <motion.div
              key="mytasks"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <TaskListView
                tasks={currentTasks}
                emptyTitle="No personal tasks"
                emptyDescription="Local tasks are disabled; this view shows synced Notion tasks in All."
              />
            </motion.div>
          )}

          {/* KANBAN tab — drag-and-drop board */}
          {activeTab === 'Kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <KanbanBoard
                tasks={currentTasks}
              />
            </motion.div>
          )}


          {/* COMPLETED tab — done tasks list */}
          {activeTab === 'Completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <TaskListView
                tasks={currentTasks}
                emptyTitle="No completed tasks"
                emptyDescription="Completed tasks appear here once synced sources mark them done."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
