'use client';

import { useCallback } from 'react';
import { commandRegistry } from '@/lib/commandRegistry';
import { useCommandPalette } from '@/providers/CommandPaletteProvider';
import { useRouter } from 'next/navigation';

/**
 * Hook to execute commands programmatically
 */
export function useCommands() {
  const { open, close } = useCommandPalette();
  const router = useRouter();

  const execute = useCallback(async (commandId: string) => {
    const command = commandRegistry.get(commandId);
    if (command) {
      await command.action();
    }
  }, []);

  const navigateTo = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const openAndSearch = useCallback((query: string) => {
    open();
    // Wait for palette to open and focus
    setTimeout(() => {
      const searchInput = document.querySelector('[data-command-search]') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  }, [open]);

  return {
    open,
    close,
    execute,
    navigateTo,
    openAndSearch,
    getCommand: (id: string) => commandRegistry.get(id),
    getAllCommands: () => commandRegistry.getAll(),
    searchCommands: (query: string) => commandRegistry.search(query),
  };
}
