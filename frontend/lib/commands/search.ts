import { Command } from '../commandRegistry';
import {
  Search,
  Mail,
  Calendar,
  CheckSquare,
  FileText,
  Globe,
} from 'lucide-react';

export const searchCommands: Command[] = [
  {
    id: 'search-all',
    title: 'Search Everything',
    description: 'Search across all your data',
    icon: Search,
    keywords: ['search', 'find', 'all', 'everywhere'],
    category: 'search',
    shortcut: 'Ctrl/Cmd + K',
    availability: ['global'],
    action: () => {
      // Focus existing global search
      const searchInput = document.getElementById('global-search') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
  },
  {
    id: 'search-gmail',
    title: 'Search Gmail',
    description: 'Find messages in your inbox',
    icon: Mail,
    keywords: ['search', 'gmail', 'email', 'messages'],
    category: 'search',
    availability: ['global', 'gmail'],
    href: '/dashboard/gmail',
    queryParam: 'search',
    action: () => {},
  },
  {
    id: 'search-calendar',
    title: 'Search Calendar',
    description: 'Find events in your calendar',
    icon: Calendar,
    keywords: ['search', 'calendar', 'events', 'meetings'],
    category: 'search',
    availability: ['global', 'calendar'],
    href: '/dashboard/calendar',
    queryParam: 'search',
    action: () => {},
  },
  {
    id: 'search-tasks',
    title: 'Search Tasks',
    description: 'Find tasks and todos',
    icon: CheckSquare,
    keywords: ['search', 'tasks', 'todo'],
    category: 'search',
    availability: ['global', 'tasks'],
    href: '/dashboard/tasks',
    queryParam: 'search',
    action: () => {},
  },
  {
    id: 'search-documents',
    title: 'Search Documents',
    description: 'Find documents and notes',
    icon: FileText,
    keywords: ['search', 'documents', 'notes', 'files'],
    category: 'search',
    availability: ['global', 'documents'],
    href: '/dashboard/documents',
    queryParam: 'search',
    action: () => {},
  },
];
