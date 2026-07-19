import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanColumn({ id, title, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  return (
    <div className="flex flex-col flex-1 min-w-[320px] bg-[#FAF9F6]/50 border border-border/60 rounded-2xl h-[calc(100vh-240px)] overflow-hidden shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-[15px] text-foreground tracking-tight">{title}</h3>
          <span className="bg-muted text-muted-foreground text-[11px] font-bold px-2 py-0.5 rounded-full shadow-inner">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-colors border border-transparent hover:border-border shadow-sm"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Column Body - Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 overflow-y-auto transition-colors ${
          isOver ? 'bg-accent/10' : ''
        }`}
      >
        <div className="flex flex-col gap-3 min-h-[100px]">
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>
          
          {/* Add Task Button at bottom of column */}
          <button
            onClick={() => onAddTask(id)}
            className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 text-sm font-semibold text-muted-foreground hover:text-primary bg-background/50 hover:bg-background border border-dashed border-border hover:border-primary/30 rounded-xl transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
