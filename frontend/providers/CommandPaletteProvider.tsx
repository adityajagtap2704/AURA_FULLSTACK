'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { CommandAvailability } from '@/lib/commandRegistry';
import { useTheme } from './ThemeProvider';

interface CommandPaletteContextType {
  isOpen: boolean;
  open: () => void;
  openWithQuery: (query: string, compact?: boolean) => void;
  close: () => void;
  toggle: () => void;
  context: CommandAvailability;
  initialQuery: string;
  compactAIMode: boolean;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  // Determine context from pathname
  const context: CommandAvailability = (() => {
    if (pathname.includes('/gmail')) return 'gmail';
    if (pathname.includes('/calendar')) return 'calendar';
    if (pathname.includes('/tasks')) return 'tasks';
    if (pathname.includes('/documents')) return 'documents';
    if (pathname.includes('/ai-assistant')) return 'ai-assistant';
    if (pathname.includes('/ai-digest')) return 'ai-digest';
    if (pathname.includes('/integrations')) return 'integrations';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/dashboard')) return 'dashboard';
    return 'global';
  })();

  const [initialQuery, setInitialQuery] = useState('');
  const [compactAIMode, setCompactAIMode] = useState(false);

  const open = useCallback(() => {
    setInitialQuery('');
    setCompactAIMode(false);
    setIsOpen(true);
  }, []);
  const openWithQuery = useCallback((query: string, compact = false) => {
    setInitialQuery(query);
    setCompactAIMode(compact);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setCompactAIMode(false);
    setIsOpen(false);
  }, []);
  const toggle = useCallback(() => {
    setInitialQuery('');
    setCompactAIMode(false);
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      close();
    }
  }, [isAuthenticated, close]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();

        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.id === 'global-search') {
          return;
        }

        if (isAuthenticated) {
          open();
        } else {
          openWithQuery('', true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isAuthenticated, loading, open, openWithQuery]);

  // Listen for custom events from commands
  useEffect(() => {
    const handleToggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    };

    window.addEventListener('aura:toggle-theme', handleToggleTheme);
    return () => window.removeEventListener('aura:toggle-theme', handleToggleTheme);
  }, [theme, setTheme]);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle, openWithQuery, context, initialQuery, compactAIMode }}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error('useCommandPalette must be used within CommandPaletteProvider');
  }
  return context;
}
