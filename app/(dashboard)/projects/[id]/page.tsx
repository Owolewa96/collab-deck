'use client';

import { useState, use } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

interface Task {
  _id: string;
  title: string;
  columnId: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
}

interface Column {
  _id: string;
  name: string;
  order: number;
}

// Draggable Task Component
function DraggableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-zinc-900 rounded-md p-3 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <h4 className="font-medium text-zinc-900 dark:text-white text-sm">
        {task.title}
      </h4>
      <div className="mt-2">
        <span
          className={`text-xs px-2 py-1 rounded ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
              : task.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
          }`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({
  column,
  tasks,
}: {
  column: Column;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
  });

  const columnTasks = tasks.filter((task) => task.columnId === column._id);

  return (
    <div
      ref={setNodeRef}
      className={`shrink-0 w-80 rounded-lg p-4 min-h-96 transition-colors ${
        isOver
          ? 'bg-emerald-100 dark:bg-emerald-900 ring-2 ring-emerald-500'
          : 'bg-zinc-100 dark:bg-zinc-800'
      }`}
    >
      <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
        {column.name}
      </h3>
      <div className="space-y-3">
        {columnTasks.map((task) => (
          <DraggableTask key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tasks, setTasks] = useState<Task[]>([
    {
      _id: '1',
      title: 'Set up database',
      columnId: 'todo',
      priority: 'high',
      status: 'todo',
    },
    {
      _id: '2',
      title: 'Create API endpoints',
      columnId: 'in-progress',
      priority: 'high',
      status: 'in-progress',
    },
    {
      _id: '3',
      title: 'Build frontend',
      columnId: 'in-progress',
      priority: 'medium',
      status: 'in-progress',
    },
  ]);

  const [columns] = useState<Column[]>([
    { _id: 'todo', name: 'To Do', order: 0 },
    { _id: 'in-progress', name: 'In Progress', order: 1 },
    { _id: 'done', name: 'Done', order: 2 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    // Determine if we're dragging over a column or a task
    const columnIds = columns.map((c) => c._id);
    let targetColumnId: string;

    if (columnIds.includes(overId as string)) {
      // Dragging over a column directly
      targetColumnId = overId as string;
    } else if (columnIds.includes(overId as string)) {
      // Column directly
      targetColumnId = overId as string;
    } else {
      // Dragging over a task - get that task's column
      const overTask = tasks.find((t) => t._id === overId);
      if (!overTask) {
        // If not a task, try to find if it's a column container
        return;
      }
      targetColumnId = overTask.columnId;
    }

    // Only update if column actually changed
    if (activeTask.columnId === targetColumnId) return;

    // Update task's column
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === activeId
          ? { ...task, columnId: targetColumnId }
          : task
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
        Project {id}
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4">
            {/* Single SortableContext for all tasks across columns */}
            <SortableContext
              items={tasks.map((t) => t._id)}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((column) => (
                <DroppableColumn
                  key={column._id}
                  column={column}
                  tasks={tasks}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
