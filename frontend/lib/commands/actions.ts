import { Command } from '../commandRegistry';
import {
  RefreshCw,
  Settings,
  LogOut,
  Sun,
  Moon,
  Keyboard,
  Bug,
  Mail as MailIcon,
  Info,
  Link2,
} from 'lucide-react';
import { showToast, triggerEvent } from '../commandUtils';

export const actionCommands: Command[] = [
  {
    id: 'action-theme-toggle',
    title: 'Toggle Theme',
    description: 'Switch between light and dark mode',
    icon: Sun,
    keywords: ['theme', 'dark', 'light', 'mode'],
    category: 'actions',
    availability: ['global'],
    action: () => {
      triggerEvent('aura:toggle-theme');
      showToast('Theme toggled', 'success');
    },
  },
  {
    id: 'action-keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'View all keyboard shortcuts',
    icon: Keyboard,
    keywords: ['shortcuts', 'keyboard', 'hotkeys'],
    category: 'actions',
    shortcut: 'Ctrl/Cmd + /',
    availability: ['global'],
    action: () => {
      triggerEvent('aura:open-shortcuts');
    },
  },
  {
    id: 'action-report-bug',
    title: 'Report Bug',
    description: 'Report an issue',
    icon: Bug,
    keywords: ['bug', 'report', 'issue', 'problem'],
    category: 'actions',
    availability: ['global'],
    action: () => {
      triggerEvent('aura:open-report-bug');
    },
  },
  {
    id: 'action-contact-support',
    title: 'Contact Support',
    description: 'Get help from support',
    icon: MailIcon,
    keywords: ['support', 'help', 'contact'],
    category: 'actions',
    availability: ['global'],
    action: () => {
      triggerEvent('aura:open-contact-support');
    },
  },
  {
    id: 'action-about',
    title: 'About AURA',
    description: 'Learn about AURA',
    icon: Info,
    keywords: ['about', 'info', 'version'],
    category: 'actions',
    availability: ['global'],
    action: () => {
      triggerEvent('aura:open-about');
    },
  },
  {
    id: 'action-manage-integrations',
    title: 'Manage Integrations',
    description: 'Connect or disconnect services',
    icon: Link2,
    keywords: ['integrations', 'connections', 'oauth'],
    category: 'actions',
    availability: ['global'],
    href: '/dashboard/integrations',
    action: () => {},
  },
];
