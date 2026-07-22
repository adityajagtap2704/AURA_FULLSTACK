'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutProps {
  onOpenShortcuts?: () => void;
}

export function useKeyboardShortcuts({
  onOpenShortcuts,
}: KeyboardShortcutProps = {}) {
  const router = useRouter();

  useEffect(() => {
    let waitingForG = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();

        const search = document.getElementById(
          'global-search'
        ) as HTMLInputElement | null;

        search?.focus();
        return;
      }

      // ?
      if (e.key === '?') {
        e.preventDefault();
        onOpenShortcuts?.();
        return;
      }

      // G shortcuts
      if (e.key.toLowerCase() === 'g') {
        waitingForG = true;

        setTimeout(() => {
          waitingForG = false;
        }, 600);

        return;
      }

      if (waitingForG) {
        switch (e.key.toLowerCase()) {
          case 't':
            router.push('/dashboard/tasks');
            break;

          case 'c':
            router.push('/dashboard/calendar');
            break;

          case 'm':
            router.push('/dashboard/gmail');
            break;

          case 'd':
            router.push('/dashboard/documents');
            break;
            case "o":
  router.push("/dashboard/documents");
  break;

          default:
            break;
        }

        waitingForG = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, onOpenShortcuts]);
}