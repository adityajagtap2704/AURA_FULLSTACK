/**
 * Command history tracking and analytics
 */

interface CommandHistoryEntry {
  commandId: string;
  timestamp: number;
  context: string;
}

const HISTORY_KEY = 'aura-command-history';
const MAX_HISTORY_SIZE = 100;

class CommandHistory {
  private history: CommandHistoryEntry[] = [];

  constructor() {
    this.load();
  }

  /**
   * Load history from localStorage
   */
  private load(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load command history:', e);
      this.history = [];
    }
  }

  /**
   * Save history to localStorage
   */
  private save(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
    } catch (e) {
      console.error('Failed to save command history:', e);
    }
  }

  /**
   * Add a command to history
   */
  add(commandId: string, context: string): void {
    const entry: CommandHistoryEntry = {
      commandId,
      timestamp: Date.now(),
      context,
    };

    this.history.unshift(entry);

    // Keep only the last MAX_HISTORY_SIZE entries
    if (this.history.length > MAX_HISTORY_SIZE) {
      this.history = this.history.slice(0, MAX_HISTORY_SIZE);
    }

    this.save();
  }

  /**
   * Get recent commands (unique)
   */
  getRecent(limit: number = 5): string[] {
    const seen = new Set<string>();
    const recent: string[] = [];

    for (const entry of this.history) {
      if (!seen.has(entry.commandId)) {
        seen.add(entry.commandId);
        recent.push(entry.commandId);
        if (recent.length >= limit) break;
      }
    }

    return recent;
  }

  /**
   * Get most used commands
   */
  getMostUsed(limit: number = 10): Array<{ commandId: string; count: number }> {
    const counts = new Map<string, number>();

    for (const entry of this.history) {
      counts.set(entry.commandId, (counts.get(entry.commandId) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([commandId, count]) => ({ commandId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get commands used in a specific context
   */
  getByContext(context: string, limit: number = 5): string[] {
    const contextCommands = this.history
      .filter(entry => entry.context === context)
      .map(entry => entry.commandId);

    // Remove duplicates while preserving order
    return [...new Set(contextCommands)].slice(0, limit);
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = [];
    this.save();
  }

  /**
   * Get usage statistics
   */
  getStats(): {
    totalCommands: number;
    uniqueCommands: number;
    lastUsed: number | null;
    mostUsedCommand: string | null;
  } {
    const uniqueCommands = new Set(this.history.map(e => e.commandId)).size;
    const lastUsed = this.history.length > 0 ? this.history[0].timestamp : null;
    
    const mostUsed = this.getMostUsed(1);
    const mostUsedCommand = mostUsed.length > 0 ? mostUsed[0].commandId : null;

    return {
      totalCommands: this.history.length,
      uniqueCommands,
      lastUsed,
      mostUsedCommand,
    };
  }
}

// Singleton instance
export const commandHistory = new CommandHistory();
