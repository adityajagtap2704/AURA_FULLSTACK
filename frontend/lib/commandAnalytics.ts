/**
 * Command analytics and insights
 */

import { commandHistory } from './commandHistory';
import { commandRegistry } from './commandRegistry';

export interface CommandInsight {
  commandId: string;
  title: string;
  usageCount: number;
  lastUsed: number;
  avgTimeOfDay: number;
  contexts: string[];
}

export class CommandAnalytics {
  /**
   * Get insights for all commands
   */
  getInsights(): CommandInsight[] {
    const mostUsed = commandHistory.getMostUsed(50);
    const insights: CommandInsight[] = [];

    for (const { commandId, count } of mostUsed) {
      const command = commandRegistry.get(commandId);
      if (!command) continue;

      insights.push({
        commandId,
        title: command.title,
        usageCount: count,
        lastUsed: Date.now(), // Placeholder - would need to track in history
        avgTimeOfDay: 12, // Placeholder - would calculate from history
        contexts: [...command.availability],
      });
    }

    return insights;
  }

  /**
   * Get personalized command suggestions
   */
  getSuggestions(context: string, limit: number = 3): string[] {
    // Get commands used in this context
    const contextCommands = commandHistory.getByContext(context, 10);
    
    // Mix with most used overall
    const mostUsed = commandHistory.getMostUsed(10).map(c => c.commandId);
    
    // Combine and deduplicate
    const combined = [...new Set([...contextCommands, ...mostUsed])];
    
    return combined.slice(0, limit);
  }

  /**
   * Track command execution pattern
   */
  getExecutionPattern(commandId: string): {
    hourlyDistribution: number[];
    dayOfWeekDistribution: number[];
  } {
    // Placeholder - would analyze history
    return {
      hourlyDistribution: new Array(24).fill(0),
      dayOfWeekDistribution: new Array(7).fill(0),
    };
  }

  /**
   * Get command performance metrics
   */
  getPerformanceMetrics(): {
    avgCommandsPerDay: number;
    mostProductiveHour: number;
    topCategory: string;
  } {
    const stats = commandHistory.getStats();
    
    return {
      avgCommandsPerDay: 0, // Would calculate from history
      mostProductiveHour: 10, // Placeholder
      topCategory: 'navigation', // Placeholder
    };
  }
}

export const commandAnalytics = new CommandAnalytics();
