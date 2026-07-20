import { Task } from '@/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col flex-1 min-w-[320px] bg-muted/30 border border-border/60 rounded-2xl h-[calc(100vh-240px)] overflow-hidden shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-[15px] text-foreground tracking-tight">{title}</h3>
          <span className="bg-muted text-muted-foreground text-[11px] font-bold px-2 py-0.5 rounded-full shadow-inner">
            {tasks.length}
          </span>
        </div>
        {/* Add button removed — tasks are read-only / synced from external sources */}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-3 min-h-[100px]">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
          {/* Add Task removed — board is read-only for synced tasks */}
        </div>
      </div>
    </div>
  );
}
