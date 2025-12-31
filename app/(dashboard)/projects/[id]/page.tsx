'use client';

import { useState, use, useEffect } from 'react';
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
import { log } from 'console';

interface User {
  _id: string;
  name: string;
  email: string;
}

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

// Task Modal Component
function TaskModal({
  isOpen,
  onClose,
  collaborators,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  collaborators: User[];
  onSubmit: (data: { title: string; description?: string; dueDate?: string; assignees: string[]; priority: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [priority, setPriority] = useState('medium');

  const toggleAssignee = (userId: string) => {
    setAssignees((prev) => (prev.includes(userId) ? prev.filter((a) => a !== userId) : [...prev, userId]));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description ?? '', dueDate: dueDate || undefined, assignees, priority });
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignees([]);
    setPriority('medium');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Create Task</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Assign To</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {collaborators.map((c) => (
                <label key={c._id} className="flex items-center gap-2">
                  <input type="checkbox" checked={assignees.includes(c._id)} onChange={() => toggleAssignee(c._id)} />
                  <span className="text-sm text-zinc-900 dark:text-white">{c.name}</span>
                </label>
              ))}

            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            <button type="submit" className="px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [projectData, setProjectData] = useState<any>(null);

  // Fetch project data and tasks
  useEffect(() => {
    let cancelled = false;
    
    const fetchProjectData = async () => {
      
      try {
        const res = await fetch(`/api/user/`, { credentials: 'include', body: JSON.stringify({ projectId: id }), method: 'POST' });
        if (!res.ok) return;
        const data = await res.json();
        console.log(data);
        if (!cancelled) {
          setProjectData(data.project);
          setCollaborators(data.project.collaborators || []);
          
        }

      } catch (err) {
        // ignore
      }
    };



    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?projectId=${id}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          // adapt shape if necessary
          const serverTasks = (data.tasks || []).map((t: any) => ({
            _id: t._id || t.id || String(Math.random()),
            title: t.title,
            columnId: t.status === 'done' ? 'done' : t.status === 'in-progress' ? 'in-progress' : 'todo',
            priority: t.priority || 'medium',
            status: t.status || 'todo',
          }));
          setTasks(serverTasks);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchProjectData();
    fetchTasks();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCreateTask = (taskData: { title: string; description?: string; dueDate?: string; assignees: string[]; priority: string }) => {
    // Optimistic update: add task immediately
    const optimisticTask: Task = {
      _id: `temp-${Date.now()}`,
      title: taskData.title,
      columnId: 'todo',
      priority: taskData.priority as 'high' | 'medium' | 'low',
      status: 'todo',
    };
    
    setTasks((prev) => [...prev, optimisticTask]);
    setIsTaskModalOpen(false);

    (async () => {
      try {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: id,
            title: taskData.title,
            description: taskData.description || '',
            dueDate: taskData.dueDate,
            assignees: taskData.assignees,
            priority: taskData.priority,
            status: 'todo',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          // Replace the temporary task with the real one from server
          setTasks((prev) =>
            prev.map((t) =>
              t._id === optimisticTask._id
                ? {
                    _id: data.task._id || data.task.id,
                    title: data.task.title,
                    columnId: 'todo',
                    priority: data.task.priority || 'medium',
                    status: data.task.status || 'todo',
                  }
                : t
            )
          );
        } else {
          // Remove optimistic task if request failed
          setTasks((prev) => prev.filter((t) => t._id !== optimisticTask._id));
        }
      } catch (err) {
        // Remove optimistic task on error
        setTasks((prev) => prev.filter((t) => t._id !== optimisticTask._id));
      }
    })();
  };

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

    // Update UI immediately (optimistic update)
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === activeId
          ? { ...task, columnId: targetColumnId, status: targetColumnId }
          : task
      )
    );

    // Persist to database
    const statusMap: { [key: string]: string } = {
      todo: 'todo',
      'in-progress': 'in-progress',
      done: 'done',
    };

    fetch(`/api/tasks/${activeId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusMap[targetColumnId] || 'todo' }),
    }).catch((err) => {
      // Revert on error
      console.error('Failed to update task status:', err);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === activeId
            ? { ...task, columnId: activeTask.columnId, status: activeTask.status }
            : task
        )
      );
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Project {id}
        </h1>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition font-medium"
        >
          Create Task
        </button>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        collaborators={collaborators}
        onSubmit={handleCreateTask}
      />

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
