import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Task } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onAddTask: (status?: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMNS = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Done', title: 'Done' },
];

export function KanbanBoard({ tasks, onUpdateTaskStatus, onAddTask, onEditTask, onDeleteTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Group tasks by status
  const columns = useMemo(() => {
    const cols = {
      'To Do': tasks.filter((t) => t.status === 'To Do' || !t.status),
      'In Progress': tasks.filter((t) => t.status === 'In Progress'),
      'Done': tasks.filter((t) => t.status === 'Done'),
    };
    return cols;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);
    
    // Dropping over another task
    if (activeTask && overTask && activeTask.status !== overTask.status) {
      onUpdateTaskStatus(activeId as string, overTask.status || 'To Do');
      return;
    }

    // Dropping over a column
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn && activeTask && activeTask.status !== overId) {
      onUpdateTaskStatus(activeId as string, overId as string);
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 pt-2 hide-scrollbar w-full px-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={columns[col.id as keyof typeof columns] || []}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 rotate-2 scale-105 transition-transform cursor-grabbing">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
