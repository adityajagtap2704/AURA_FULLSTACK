/**
 * Utility functions for command execution
 */

import { showCommandToast } from '@/components/command/CommandToast';

/**
 * Execute a command with error handling
 */
export async function executeCommand(
  action: () => void | Promise<void>,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    await action();
    onSuccess?.();
  } catch (error) {
    console.error('Command execution failed:', error);
    onError?.(error as Error);
  }
}

/**
 * Show a toast notification
 */
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  showCommandToast(message, type);
}

/**
 * Focus an input element by selector
 */
export function focusInput(selector: string, delay = 100): void {
  setTimeout(() => {
    const input = document.querySelector(selector) as HTMLInputElement;
    if (input) {
      input.focus();
      input.select?.();
    }
  }, delay);
}

/**
 * Navigate to a URL
 */
export function navigateToUrl(url: string, newTab = false): void {
  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
}

/**
 * Trigger a custom event
 */
export function triggerEvent(eventName: string, detail?: any): void {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Check if user is on mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get keyboard shortcut display text
 */
export function getShortcutDisplay(shortcut: string): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return shortcut
    .replace('Ctrl/Cmd', isMac ? '⌘' : 'Ctrl')
    .replace('Ctrl/', isMac ? '⌘' : 'Ctrl ')
    .replace('Cmd', '⌘')
    .replace('Alt', isMac ? '⌥' : 'Alt')
    .replace('Shift', isMac ? '⇧' : 'Shift');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
