'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Command as CommandIcon, Clock } from 'lucide-react';
import { commandRegistry, Command, CommandGroup } from '@/lib/commandRegistry';
import { getAllCommands } from '@/lib/commands';
import { useCommandPalette } from '@/providers/CommandPaletteProvider';
import { commandHistory } from '@/lib/commandHistory';

const RECENT_COMMANDS_KEY = 'aura-recent-commands';
const MAX_RECENT_COMMANDS = 5;

export default function CommandPalette() {
  const { isOpen, close, context, initialQuery, compactAIMode } = useCommandPalette();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [currentParent, setCurrentParent] = useState<Command | null>(null);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const hideAskAuraInDashboard = context === 'dashboard';
  const filterDashboardCommands = (cmd: Command) => !(
    hideAskAuraInDashboard && cmd.id === 'ai-ask'
  );

  useEffect(() => {
    setMounted(true);
    // Register all commands
    commandRegistry.registerMany(getAllCommands());
    
    // Load recent commands from history
    setRecentCommands(commandHistory.getRecent(MAX_RECENT_COMMANDS));
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery(initialQuery || '');
      setSelectedIndex(0);
      setBreadcrumb([]);
      setCurrentParent(null);
      // Refresh recent commands
      setRecentCommands(commandHistory.getRecent(MAX_RECENT_COMMANDS));
    }
  }, [isOpen, initialQuery]);

  // Filter commands based on query and context
  const filteredCommands = useMemo(() => {
    if (currentParent?.children) {
      return [
        {
          category: currentParent.category || 'actions',
          title: currentParent.title,
          commands: currentParent.children,
        },
      ];
    }

    if (compactAIMode) {
      const aiCommand = commandRegistry.get('ai-ask');
      return aiCommand && filterDashboardCommands(aiCommand)
        ? [{ category: 'ai', title: 'AI', commands: [aiCommand] }]
        : [];
    }

    if (query.trim()) {
      return commandRegistry.groupByCategory(
        commandRegistry.search(query, context),
      );
    }

    const recent = recentCommands
      .map(id => commandRegistry.get(id))
      .filter((cmd): cmd is Command => cmd !== undefined && filterDashboardCommands(cmd))
      .slice(0, MAX_RECENT_COMMANDS);

    const availableCommands = commandRegistry.getByAvailability(context).filter(filterDashboardCommands);
    const recentIds = new Set(recent.map(cmd => cmd.id));
    const remainingCommands = availableCommands.filter(cmd => !recentIds.has(cmd.id));
    const groupedCommands = commandRegistry.groupByCategory(remainingCommands);

    if (recent.length > 0) {
      return [
        {
          category: 'recent',
          title: 'Recent',
          commands: recent,
        },
        ...groupedCommands,
      ];
    }

    return groupedCommands;
  }, [query, context, currentParent, recentCommands]);

  // Get flat list of visible commands
  const flatCommands = useMemo(() => {
    return filteredCommands.flatMap(group => group.commands);
  }, [filteredCommands]);

  // Reset selection when commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatCommands]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  const router = useRouter();

  const addToRecent = (commandId: string) => {
    commandHistory.add(commandId, context);
    setRecentCommands(commandHistory.getRecent(MAX_RECENT_COMMANDS));
  };

  const executeCommand = async (command: Command) => {
    if (command.children && command.children.length > 0) {
      // Navigate into nested command
      setBreadcrumb([...breadcrumb, command.title]);
      setCurrentParent(command);
      setQuery('');
      setSelectedIndex(0);
    } else {
      // Execute command
      addToRecent(command.id);
      close();

      // Dispatch event for analytics
      window.dispatchEvent(new CustomEvent('aura:command-executed', {
        detail: { commandId: command.id, context }
      }));

      const trimmedQuery = query.trim();
      if (command.href) {
        let target = command.href;
        if (command.queryParam && trimmedQuery) {
          const url = new URL(target, window.location.origin);
          url.searchParams.set(command.queryParam, trimmedQuery);
          target = url.pathname + url.search + url.hash;
        }

        if (command.newTab) {
          window.open(target, '_blank', 'noopener,noreferrer');
        } else {
          await router.push(target);
        }
      } else {
        await command.action(trimmedQuery);
      }
    }
  };

  const goBack = () => {
    if (breadcrumb.length > 0) {
      const newBreadcrumb = [...breadcrumb];
      newBreadcrumb.pop();
      setBreadcrumb(newBreadcrumb);
      setCurrentParent(null);
      setQuery('');
      setSelectedIndex(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatCommands.length) % flatCommands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          executeCommand(flatCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (breadcrumb.length > 0) {
          goBack();
        } else {
          close();
        }
        break;
      case 'ArrowLeft':
        if (breadcrumb.length > 0 && !query) {
          e.preventDefault();
          goBack();
        }
        break;
      case 'ArrowRight':
        if (flatCommands[selectedIndex]?.children) {
          e.preventDefault();
          executeCommand(flatCommands[selectedIndex]);
        }
        break;
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100000] flex items-start justify-center pt-[15vh] px-4"
          onClick={close}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-command-palette-open
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 20vh)' }}
          >
            {/* Header */}
            <div className="relative border-b border-border">
              {/* Breadcrumb */}
              {breadcrumb.length > 0 && (
                <div className="flex items-center gap-2 px-4 pt-3 pb-1 text-xs text-muted-foreground">
                  <button
                    onClick={goBack}
                    className="hover:text-foreground transition-colors"
                  >
                    Commands
                  </button>
                  {breadcrumb.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      <span>{crumb}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-command-search
                  aria-label="Search commands"
                  aria-autocomplete="list"
                  aria-controls="command-list"
                  aria-activedescendant={flatCommands[selectedIndex]?.id}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-muted-foreground bg-muted/50 border border-border rounded-md" aria-label="Press Escape to close">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Command List */}
            <div
              ref={listRef}
              id="command-list"
              role="listbox"
              aria-label="Available commands"
              className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto overscroll-contain"
            >
              {filteredCommands.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <CommandIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">No commands found</p>
                  <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
                    Try a different search term or browse all commands by clearing your search
                  </p>
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="mt-4 px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((group, groupIndex) => (
                    <div key={`${group.category}-${group.title}-${groupIndex}`} className={groupIndex > 0 ? 'mt-4' : ''}>
                      {/* Group Header */}
                      <div className="sticky top-0 z-10 bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <span>{group.title}</span>
                          <span className="text-[10px] font-normal opacity-60">
                            {group.commands.length}
                          </span>
                        </div>
                      </div>

                      {/* Commands */}
                      {group.commands.map((command, cmdIndex) => {
                        const globalIndex = filteredCommands
                          .slice(0, groupIndex)
                          .reduce((acc, g) => acc + g.commands.length, 0) + cmdIndex;
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = command.icon;
                        const hasChildren = command.children && command.children.length > 0;

                        return (
                          <button
                            key={command.id}
                            id={command.id}
                            data-index={globalIndex}
                            onClick={() => executeCommand(command)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            role="option"
                            aria-selected={isSelected}
                            aria-label={`${command.title}${command.description ? `: ${command.description}` : ''}`}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              isSelected
                                ? 'bg-primary/10 text-foreground'
                                : 'text-foreground/80 hover:bg-muted/50'
                            }`}
                          >
                            {/* Icon */}
                            <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                              isSelected 
                                ? 'bg-primary/20 text-primary scale-110' 
                                : 'bg-muted/70 text-muted-foreground'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{command.title}</div>
                              {command.description && (
                                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>

                            {/* Right Side */}
                            <div className="flex-shrink-0 flex items-center gap-2">
                              {command.shortcut && !hasChildren && (
                                <kbd className="hidden sm:block px-2 py-1 text-[10px] font-semibold text-muted-foreground bg-muted/50 border border-border rounded-md">
                                  {command.shortcut}
                                </kbd>
                              )}
                              {hasChildren && (
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              <div className="hidden sm:flex items-center gap-4 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↓</kbd>
                  <span className="ml-1">Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↵</kbd>
                  <span className="ml-1">Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">ESC</kbd>
                  <span className="ml-1">Close</span>
                </div>
              </div>
              
              {/* Mobile: Just show the brand */}
              <div className="sm:hidden text-[10px] text-muted-foreground">
                Tap command to execute
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <CommandIcon className="h-3 w-3" />
                <span className="hidden sm:inline">AURA Command Center</span>
                <span className="sm:hidden">AURA</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
