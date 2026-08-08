import { Command } from '../commandRegistry';
import { navigationCommands } from './navigation';
import { createCommands } from './create';
import { searchCommands } from './search';
import { aiCommands } from './ai';
import { actionCommands } from './actions';
import { gmailContextCommands } from './context/gmail';
import { calendarContextCommands } from './context/calendar';
import { tasksContextCommands } from './context/tasks';

export function getAllCommands(): Command[] {
  return [
    ...navigationCommands,
    ...createCommands,
    ...searchCommands,
    ...aiCommands,
    ...actionCommands,
    ...gmailContextCommands,
    ...calendarContextCommands,
    ...tasksContextCommands,
  ];
}

export * from './navigation';
export * from './create';
export * from './search';
export * from './ai';
export * from './actions';
export * from './context/gmail';
export * from './context/calendar';
export * from './context/tasks';
