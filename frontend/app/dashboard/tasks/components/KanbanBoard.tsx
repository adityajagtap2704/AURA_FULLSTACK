import { useMemo } from 'react';
import { Task } from '@/types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
}

const COLUMNS = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Done', title: 'Done' },
];

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const columns = useMemo(() => {
    return {
      'To Do': tasks.filter((t) => t.status === 'To Do' || !t.status),
      'In Progress': tasks.filter((t) => t.status === 'In Progress'),
      'Done': tasks.filter((t) => t.status === 'Done'),
    };
  }, [tasks]);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 pt-2 hide-scrollbar w-full px-1">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          id={col.id}
          title={col.title}
          tasks={columns[col.id as keyof typeof columns] || []}
        />
      ))}
    </div>
  );
}
