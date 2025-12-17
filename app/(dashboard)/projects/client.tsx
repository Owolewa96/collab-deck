'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: {
    name: string;
    priority: string;
    startDate: string;
    endDate: string;
    collaborators: string[];
    description?: string;
  }) => void;
}

function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const handleAddCollaborator = async () => {
    const email = collaboratorInput.trim();

    const res = await fetch("/api/users/exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

  const data = await res.json();
   console.log(data)
    if (email && !collaborators.includes(email)) {
      setCollaborators([...collaborators, email]);
      setCollaboratorInput('');
    }
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter((c) => c !== email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit({
        name: projectName,
        description: projectDescription,
        priority,
        startDate,
        endDate,
        collaborators,
      });
      setProjectName('');
      setProjectDescription('');
      setPriority('medium');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setCollaborators([]);
      setCollaboratorInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCollaborator();
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 h-screen"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe the project (optional)"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Add Collaborators
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter email (press Enter)"
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCollaborator}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add
              </button>
            </div>

            {collaborators.length > 0 && (
              <div className="mt-3 space-y-2">
                {collaborators.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm text-zinc-900 dark:text-white">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCollaborator(email)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskModal({
  isOpen,
  onClose,
  collaborators,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  collaborators: string[];
  onSubmit: (data: { title: string; description?: string; dueDate?: string; assignees: string[] }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignees, setAssignees] = useState<string[]>([]);

  const toggleAssignee = (email: string) => {
    setAssignees((prev) => (prev.includes(email) ? prev.filter((a) => a !== email) : [...prev, email]));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description ?? '', dueDate: dueDate || undefined, assignees });
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignees([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Create Task</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded border" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded border" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Assign To</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {collaborators.map((c) => (
                <label key={c} className="flex items-center gap-2">
                  <input type="checkbox" checked={assignees.includes(c)} onChange={() => toggleAssignee(c)} />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
            <button type="submit" className="px-3 py-2 rounded bg-emerald-600 text-white">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  creator: string;
  collaborators: string[];
  priority?: string;
  startDate?: string;
  endDate?: string;
  updatedAt: string;
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskProject, setTaskProject] = useState<Project | null>(null);

  const openTaskModal = (project: Project) => {
    setTaskProject(project);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = async (taskData: { title: string; description?: string; dueDate?: string; assignees: string[] }) => {
    if (!taskProject) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: taskProject._id,
          title: taskData.title,
          description: taskData.description ?? '',
          dueDate: taskData.dueDate ?? null,
          assignees: taskData.assignees || [],
        }),
      });
      if (res.ok) {
        // optionally handle returned task
        const data = await res.json();
        console.log('Task created', data);
      } else {
        console.warn('Failed to create task');
      }
    } catch (err) {
      console.error('Create task error', err);
    }
    setIsTaskModalOpen(false);
    setTaskProject(null);
  };

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const archivedProjects = projects.filter((p) => p.status === 'archived');

  const handleCreateProject = (projectData: {
    name: string;
    priority: string;
    startDate: string;
    endDate: string;
    collaborators: string[];
    description?: string;
  }) => {
    // Try creating project in backend first
    (async () => {
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectData.name,
            priority: projectData.priority,
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            collaborators: projectData.collaborators,
            description: projectData.description ?? '',
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const createdProject = data.project;

          const newProject: Project = {
            _id: createdProject._id?.toString() || String(projects.length + 1),
            name: createdProject.name || projectData.name,
            description: createdProject.description ?? '',
            status: createdProject.status || 'active',
            creator: createdProject.creator,
            collaborators: createdProject.collaborators || projectData.collaborators,
            priority: createdProject.priority || projectData.priority,
            startDate: createdProject.startDate,
            endDate: createdProject.endDate,
            updatedAt: createdProject.updatedAt || new Date().toISOString(),
          };

          setProjects([...projects, newProject]);
          setIsCreateProjectModalOpen(false);
          return;
        }
      } catch (err) {
        // ignore and fallback to client-side creation
      }

      // Fallback: add locally
      const fallbackProject: Project = {
        _id: String(projects.length + 1),
        name: projectData.name,
        description: projectData.description ?? '',
        status: 'active',
        creator: 'You',
        collaborators: projectData.collaborators,
        priority: projectData.priority,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        updatedAt: new Date().toISOString(),
      };
      setProjects([...projects, fallbackProject]);
      setIsCreateProjectModalOpen(false);
    })();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      archived: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.active;
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className='bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all p-6'>
    <Link href={`/projects/${project._id}`}>
    <div className="">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{project.name}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{project.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getStatusBadge(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-zinc-700 dark:text-zinc-300">{project.collaborators.length + 1} members</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Updated {new Date(project.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>

       
    </div>
     

      {/* <div className="relative mt-4 w-max flex justify-self-end gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openTaskModal(project);
          }}
          className="px-3 py-2 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Add Task
        </button>
      </div> */}
     </Link>
      </div>
  );

  return (
    <div>
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskProject(null);
        }}
        collaborators={taskProject?.collaborators || []}
        onSubmit={handleCreateTask}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Projects
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Manage and organize all your projects
          </p>
        </div>
        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition font-medium"
        >
          New Project
        </button>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Active Projects ({activeProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Completed Projects ({completedProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Archived Projects */}
      {archivedProjects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
            Archived Projects ({archivedProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            No projects yet
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Create your first project to get started
          </p>
          <button
            onClick={() => setIsCreateProjectModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-500 transition font-medium"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}
