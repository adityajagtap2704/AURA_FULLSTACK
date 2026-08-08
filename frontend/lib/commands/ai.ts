import { Command } from '../commandRegistry';
import {
  MessageSquare,
  Sparkles,
  ListOrdered,
  FileText,
  Zap,
  Mail,
  Calendar as CalendarIcon,
  CheckSquare,
} from 'lucide-react';

export const aiCommands: Command[] = [
  {
    id: 'ai-ask',
    title: 'Ask AURA',
    description: 'Open AI Assistant',
    icon: MessageSquare,
    keywords: ['ai', 'ask', 'assistant', 'chat', 'help'],
    category: 'ai',
    availability: ['global'],
    action: () => {
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/dashboard/ai-assistant';
      } else {
        window.location.href = '/?assistant=1';
      }
    },
  },
  {
    id: 'ai-digest',
    title: 'Daily AI Digest',
    description: 'View your daily summary',
    icon: Sparkles,
    keywords: ['ai', 'digest', 'summary', 'daily', 'overview'],
    category: 'ai',
    availability: ['global'],
    href: '/dashboard/ai-digest',
    action: () => {},
  },
  {
    id: 'ai-prioritize',
    title: 'Prioritize Tasks',
    description: 'AI-powered task prioritization',
    icon: ListOrdered,
    keywords: ['ai', 'prioritize', 'tasks', 'order', 'smart'],
    category: 'ai',
    availability: ['global', 'tasks'],
    action: () => {
      // This would trigger AI prioritization modal/feature
      console.log('AI Prioritize Tasks - Feature coming soon');
    },
  },
  {
    id: 'ai-summarize-email',
    title: 'Summarize Email',
    description: 'AI summary of selected email',
    icon: Mail,
    keywords: ['ai', 'summarize', 'email', 'gmail'],
    category: 'ai',
    availability: ['gmail'],
    action: () => {
      console.log('AI Summarize Email - Feature coming soon');
    },
  },
  {
    id: 'ai-summarize-activity',
    title: 'Summarize Activity',
    description: 'Get an overview of recent activity',
    icon: Zap,
    keywords: ['ai', 'summarize', 'activity', 'overview'],
    category: 'ai',
    availability: ['global', 'dashboard'],
    href: '/dashboard/ai-digest',
    action: () => {},
  },
];
