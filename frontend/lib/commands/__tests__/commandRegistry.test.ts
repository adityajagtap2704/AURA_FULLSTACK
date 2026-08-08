/**
 * Command Registry Tests
 */

import { commandRegistry, Command } from '../../commandRegistry';
import { CheckSquare } from 'lucide-react';

describe('CommandRegistry', () => {
  beforeEach(() => {
    commandRegistry.clear();
  });

  describe('register', () => {
    it('should register a command', () => {
      const command: Command = {
        id: 'test-command',
        title: 'Test Command',
        icon: CheckSquare,
        keywords: ['test'],
        category: 'actions',
        availability: ['global'],
        action: () => {},
      };

      commandRegistry.register(command);
      
      const retrieved = commandRegistry.get('test-command');
      expect(retrieved).toBeDefined();
      expect(retrieved?.title).toBe('Test Command');
    });

    it('should register multiple commands', () => {
      const commands: Command[] = [
        {
          id: 'cmd-1',
          title: 'Command 1',
          icon: CheckSquare,
          keywords: ['cmd1'],
          category: 'actions',
          availability: ['global'],
          action: () => {},
        },
        {
          id: 'cmd-2',
          title: 'Command 2',
          icon: CheckSquare,
          keywords: ['cmd2'],
          category: 'actions',
          availability: ['global'],
          action: () => {},
        },
      ];

      commandRegistry.registerMany(commands);
      
      const all = commandRegistry.getAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      const commands: Command[] = [
        {
          id: 'nav-tasks',
          title: 'Go to Tasks',
          description: 'Manage your tasks',
          icon: CheckSquare,
          keywords: ['tasks', 'todo'],
          aliases: ['todos'],
          category: 'navigation',
          availability: ['global'],
          action: () => {},
        },
        {
          id: 'create-task',
          title: 'Create Task',
          icon: CheckSquare,
          keywords: ['task', 'create'],
          category: 'create',
          availability: ['global'],
          action: () => {},
        },
      ];
      commandRegistry.registerMany(commands);
    });

    it('should find commands by title', () => {
      const results = commandRegistry.search('tasks');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Tasks');
    });

    it('should find commands by keyword', () => {
      const results = commandRegistry.search('todo');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find commands by alias', () => {
      const results = commandRegistry.search('todos');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should prioritize exact matches', () => {
      const results = commandRegistry.search('tasks');
      expect(results[0].title).toBe('Go to Tasks');
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      const commands: Command[] = [
        {
          id: 'global-cmd',
          title: 'Global Command',
          icon: CheckSquare,
          keywords: ['global'],
          category: 'actions',
          availability: ['global'],
          action: () => {},
        },
        {
          id: 'gmail-cmd',
          title: 'Gmail Command',
          icon: CheckSquare,
          keywords: ['gmail'],
          category: 'actions',
          availability: ['gmail'],
          action: () => {},
        },
      ];
      commandRegistry.registerMany(commands);
    });

    it('should filter by availability', () => {
      const gmailCommands = commandRegistry.getByAvailability('gmail');
      expect(gmailCommands.length).toBeGreaterThan(0);
      expect(gmailCommands.some(c => c.id === 'gmail-cmd')).toBe(true);
      expect(gmailCommands.some(c => c.id === 'global-cmd')).toBe(true); // global should be included
    });

    it('should filter by category', () => {
      const actionCommands = commandRegistry.getByCategory('actions');
      expect(actionCommands).toHaveLength(2);
    });
  });
});
