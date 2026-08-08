import { Command } from '../commandRegistry';
import {
  Plus,
  CheckSquare,
  Calendar,
  Mail,
  FileText,
} from 'lucide-react';

export const createCommands: Command[] = [
  {
    id: 'create-task',
    title: 'Create Task',
    description: 'Add a new task',
    icon: CheckSquare,
    keywords: ['create', 'new', 'task', 'todo'],
    category: 'create',
    shortcut: 'C → T',
    availability: ['global', 'tasks'],
    action: () => {
      // Navigate to tasks page - task creation is handled by external systems
      window.location.href = '/dashboard/tasks';
    },
  },
  {
    id: 'create-event',
    title: 'Create Calendar Event',
    description: 'Schedule a new event',
    icon: Calendar,
    keywords: ['create', 'new', 'event', 'meeting', 'calendar'],
    category: 'create',
    shortcut: 'C → E',
    availability: ['global', 'calendar'],
    action: () => {
      // Open Google Calendar in new tab
      window.open('https://calendar.google.com/calendar/r/eventedit', '_blank');
    },
  },
  {
    id: 'create-note',
    title: 'Create Note',
    description: 'Start a new note in Notion',
    icon: FileText,
    keywords: ['create', 'new', 'note', 'document', 'notion'],
    category: 'create',
    availability: ['global', 'documents'],
    action: () => {
      // Open Notion in new tab
      window.open('https://www.notion.so/', '_blank');
    },
  },
  {
    id: 'compose-email',
    title: 'Compose Email',
    description: 'Write a new email in Gmail',
    icon: Mail,
    keywords: ['compose', 'email', 'message', 'gmail', 'send'],
    category: 'create',
    availability: ['global', 'gmail'],
    action: () => {
      // Open Gmail compose in new tab
      window.open('https://mail.google.com/mail/?view=cm&fs=1', '_blank');
    },
  },
];
