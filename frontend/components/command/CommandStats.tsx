'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Command, Clock, Award } from 'lucide-react';
import { commandHistory } from '@/lib/commandHistory';
import { commandRegistry } from '@/lib/commandRegistry';

export default function CommandStats() {
  const [stats, setStats] = useState({
    totalCommands: 0,
    uniqueCommands: 0,
    lastUsed: null as number | null,
    mostUsedCommand: null as string | null,
  });
  const [mostUsed, setMostUsed] = useState<Array<{ commandId: string; count: number }>>([]);

  useEffect(() => {
    const updateStats = () => {
      setStats(commandHistory.getStats());
      setMostUsed(commandHistory.getMostUsed(3));
    };

    updateStats();

    // Update stats when commands are executed
    const handleCommandExecuted = () => {
      setTimeout(updateStats, 100);
    };

    window.addEventListener('aura:command-executed', handleCommandExecuted);
    return () => window.removeEventListener('aura:command-executed', handleCommandExecuted);
  }, []);

  if (stats.totalCommands === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-30 max-w-xs"
    >
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Command Stats</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total executed</span>
            <span className="font-semibold text-foreground">{stats.totalCommands}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Unique commands</span>
            <span className="font-semibold text-foreground">{stats.uniqueCommands}</span>
          </div>
        </div>

        {mostUsed.length > 0 && (
          <>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <Award className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">Most Used</span>
              </div>
              <div className="space-y-1.5">
                {mostUsed.map(({ commandId, count }) => {
                  const command = commandRegistry.get(commandId);
                  if (!command) return null;

                  const Icon = command.icon;
                  return (
                    <div
                      key={commandId}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{command.title}</span>
                      </div>
                      <span className="font-semibold text-primary ml-2">{count}×</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
