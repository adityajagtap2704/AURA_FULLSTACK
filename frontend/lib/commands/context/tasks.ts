import { Command } from '../../commandRegistry';
import {
  CheckSquare,
  Plus,
  Search,
  ListOrdered,
  CheckCircle,
  Calendar,
  LayoutGrid,
  List,
} from 'lucide-react';

export const tasksContextCommands: Command[] = [
  {
    id: 'tasks-create',
    title: 'Create Task',
    description: 'Add a new task',
    icon: Plus,
    keywords: ['create', 'new', 'task'],
    category: 'create',
    shortcut: 'C',
    availability: ['tasks'],
    action: () => {
      // Tasks are synced from external sources
      window.open('https://www.notion.so/', '_blank');
    },
  },
  {
    id: 'tasks-search',
    title: 'Search Tasks',
    description: 'Find tasks',
    icon: Search,
    keywords: ['search', 'find', 'filter'],
    category: 'search',
    shortcut: '/',
    availability: ['tasks'],
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="Search tasks"]') as HTMLInputElement;
      searchInput?.focus();
    },
  },
  {
    id: 'tasks-complete',
    title: 'Complete Task',
    description: 'Mark selected task as done',
    icon: CheckCircle,
    keywords: ['complete', 'done', 'finish'],
    category: 'actions',
    availability: ['tasks'],
    action: () => {
      console.log('Complete task - Feature coming soon');
    },
  },
  {
    id: 'tasks-prioritize',
    title: 'Prioritize Tasks',
    description: 'AI-powered task prioritization',
    icon: ListOrdered,
    keywords: ['prioritize', 'ai', 'order', 'smart'],
    category: 'ai',
    availability: ['tasks'],
    action: () => {
      console.log('Prioritize tasks with AI - Feature coming soon');
    },
  },
  {
    id: 'tasks-view-kanban',
    title: 'Kanban View',
    description: 'Switch to kanban board',
    icon: LayoutGrid,
    keywords: ['kanban', 'board', 'view'],
    category: 'actions',
    availability: ['tasks'],
    action: () => {
      // Click on Kanban tab
      const kanbanTab = document.querySelector('[role="tab"][aria-selected="false"]') as HTMLButtonElement;
      kanbanTab?.click();
    },
  },
  {
    id: 'tasks-view-list',
    title: 'List View',
    description: 'Switch to list view',
    icon: List,
    keywords: ['list', 'view', 'all'],
    category: 'actions',
    availability: ['tasks'],
    action: () => {
      console.log('Switch to list view');
    },
  },
];
