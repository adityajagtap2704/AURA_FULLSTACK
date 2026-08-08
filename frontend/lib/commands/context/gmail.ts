import { Command } from '../../commandRegistry';
import {
  Mail,
  Send,
  FileText,
  Calendar,
  CheckSquare,
  Star,
  Archive,
} from 'lucide-react';

export const gmailContextCommands: Command[] = [
  {
    id: 'gmail-compose',
    title: 'Compose Email',
    description: 'Write a new email',
    icon: Send,
    keywords: ['compose', 'new', 'email', 'write'],
    category: 'create',
    shortcut: 'C',
    availability: ['gmail'],
    action: () => {
      window.open('https://mail.google.com/mail/?view=cm&fs=1', '_blank');
    },
  },
  {
    id: 'gmail-search',
    title: 'Search Gmail',
    description: 'Search messages',
    icon: Mail,
    keywords: ['search', 'find', 'filter'],
    category: 'search',
    shortcut: '/',
    availability: ['gmail'],
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="Search mail"]') as HTMLInputElement;
      searchInput?.focus();
    },
  },
  {
    id: 'gmail-create-task',
    title: 'Create Task from Email',
    description: 'Convert selected email to task',
    icon: CheckSquare,
    keywords: ['task', 'todo', 'convert'],
    category: 'create',
    availability: ['gmail'],
    action: () => {
      // This would open task creation modal with email context
      console.log('Create task from email - Feature coming soon');
    },
  },
  {
    id: 'gmail-create-event',
    title: 'Create Event from Email',
    description: 'Schedule meeting from email',
    icon: Calendar,
    keywords: ['event', 'meeting', 'calendar'],
    category: 'create',
    availability: ['gmail'],
    action: () => {
      window.open('https://calendar.google.com/calendar/r/eventedit', '_blank');
    },
  },
  {
    id: 'gmail-summarize',
    title: 'Summarize Email',
    description: 'AI summary of selected email',
    icon: FileText,
    keywords: ['ai', 'summarize', 'summary'],
    category: 'ai',
    availability: ['gmail'],
    action: () => {
      console.log('AI summarize email - Feature coming soon');
    },
  },
];
