import { LucideIcon } from 'lucide-react';

export type CommandCategory = 
  | 'navigation'
  | 'create'
  | 'search'
  | 'ai'
  | 'actions'
  | 'settings';

export type CommandAvailability = 
  | 'global'
  | 'dashboard'
  | 'gmail'
  | 'calendar'
  | 'tasks'
  | 'documents'
  | 'notion'
  | 'ai-assistant'
  | 'ai-digest'
  | 'integrations'
  | 'settings';

export interface Command {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  keywords: string[];
  category: CommandCategory;
  shortcut?: string;
  availability: CommandAvailability[];
  href?: string;
  queryParam?: string;
  newTab?: boolean;
  action: (query?: string) => void | Promise<void>;
  children?: Command[];
  aliases?: string[]; // Alternative names for fuzzy search
  tags?: string[]; // Additional tags for categorization
}

export interface CommandGroup {
  category: CommandCategory;
  title: string;
  commands: Command[];
}

class CommandRegistry {
  private commands: Map<string, Command> = new Map();
  private listeners: Set<() => void> = new Set();

  register(command: Command): void {
    this.commands.set(command.id, command);
    this.notifyListeners();
  }

  registerMany(commands: Command[]): void {
    commands.forEach(cmd => this.commands.set(cmd.id, cmd));
    this.notifyListeners();
  }

  unregister(id: string): void {
    this.commands.delete(id);
    this.notifyListeners();
  }

  get(id: string): Command | undefined {
    return this.commands.get(id);
  }

  getAll(): Command[] {
    return Array.from(this.commands.values());
  }

  getByCategory(category: CommandCategory): Command[] {
    return this.getAll().filter(cmd => cmd.category === category);
  }

  getByAvailability(context: CommandAvailability): Command[] {
    return this.getAll().filter(cmd => 
      cmd.availability.includes('global') || cmd.availability.includes(context)
    );
  }

  search(query: string, context?: CommandAvailability): Command[] {
    const lowerQuery = query.toLowerCase();
    const contextCommands = context 
      ? this.getByAvailability(context)
      : this.getAll();

    return contextCommands
      .filter(cmd => {
        const titleMatch = cmd.title.toLowerCase().includes(lowerQuery);
        const descMatch = cmd.description?.toLowerCase().includes(lowerQuery);
        const keywordMatch = cmd.keywords.some(kw => kw.toLowerCase().includes(lowerQuery));
        const aliasMatch = cmd.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery));
        const tagMatch = cmd.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        return titleMatch || descMatch || keywordMatch || aliasMatch || tagMatch;
      })
      .map(cmd => {
        // Calculate relevance score
        const titleExact = cmd.title.toLowerCase() === lowerQuery ? 100 : 0;
        const titleStarts = cmd.title.toLowerCase().startsWith(lowerQuery) ? 50 : 0;
        const titleContains = cmd.title.toLowerCase().includes(lowerQuery) ? 25 : 0;
        const aliasExact = cmd.aliases?.some(a => a.toLowerCase() === lowerQuery) ? 90 : 0;
        const keywordExact = cmd.keywords.some(k => k.toLowerCase() === lowerQuery) ? 80 : 0;
        
        const score = titleExact || aliasExact || keywordExact || titleStarts || titleContains;
        
        return { cmd, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ cmd }) => cmd);
  }

  groupByCategory(commands: Command[]): CommandGroup[] {
    const groups: Map<CommandCategory, Command[]> = new Map();
    
    commands.forEach(cmd => {
      const existing = groups.get(cmd.category) || [];
      groups.set(cmd.category, [...existing, cmd]);
    });

    const categoryTitles: Record<CommandCategory, string> = {
      navigation: 'Navigation',
      create: 'Create',
      search: 'Search',
      ai: 'AI',
      actions: 'Actions',
      settings: 'Settings',
    };

    return Array.from(groups.entries()).map(([category, cmds]) => ({
      category,
      title: categoryTitles[category],
      commands: cmds,
    }));
  }

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  clear(): void {
    this.commands.clear();
    this.notifyListeners();
  }
}

// Singleton instance
export const commandRegistry = new CommandRegistry();
