import { Command } from '../../commandRegistry';
import {
  Calendar,
  Plus,
  Search,
  Sun,
  CheckSquare,
  Video,
  Clock,
} from 'lucide-react';

export const calendarContextCommands: Command[] = [
  {
    id: 'calendar-create-event',
    title: 'Create Event',
    description: 'Schedule a new event',
    icon: Plus,
    keywords: ['create', 'new', 'event', 'meeting'],
    category: 'create',
    shortcut: 'C',
    availability: ['calendar'],
    action: () => {
      window.open('https://calendar.google.com/calendar/r/eventedit', '_blank');
    },
  },
  {
    id: 'calendar-search',
    title: 'Search Events',
    description: 'Find calendar events',
    icon: Search,
    keywords: ['search', 'find', 'events'],
    category: 'search',
    shortcut: '/',
    availability: ['calendar'],
    action: () => {
      // Focus calendar search if available
      console.log('Search calendar events');
    },
  },
  {
    id: 'calendar-today',
    title: "Today's Events",
    description: 'View today\'s schedule',
    icon: Sun,
    keywords: ['today', 'schedule', 'agenda'],
    category: 'navigation',
    availability: ['calendar'],
    action: () => {
      // Trigger calendar to show today view
      console.log('Show today\'s events');
    },
  },
  {
    id: 'calendar-create-task',
    title: 'Create Task from Event',
    description: 'Convert event to task',
    icon: CheckSquare,
    keywords: ['task', 'todo', 'convert'],
    category: 'create',
    availability: ['calendar'],
    action: () => {
      console.log('Create task from event - Feature coming soon');
    },
  },
  {
    id: 'calendar-join-meeting',
    title: 'Join Next Meeting',
    description: 'Quick join upcoming meeting',
    icon: Video,
    keywords: ['join', 'meeting', 'video', 'call'],
    category: 'actions',
    availability: ['calendar'],
    action: () => {
      console.log('Join next meeting - Feature coming soon');
    },
  },
];
