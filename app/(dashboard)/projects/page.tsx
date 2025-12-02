'use client';

import { useState } from 'react';
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
  }) => void;
}

function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const handleAddCollaborator = () => {
    const email = collaboratorInput.trim();
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
        priority,
        startDate,
        endDate,
        collaborators,
      });
      setProjectName('');
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

          <div className="grid grid-cols-2 gap-4">
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
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Today by default</p>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Collaborators
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCollaborator}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {collaborators.length > 0 && (
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div
                    key={collab}
                    className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-zinc-900 dark:text-white">{collab}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCollaborator(collab)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!projectName.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium transition-colors"
            >
              Create Project
            </button>
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
  taskCount: number;
  teamMembers: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      _id: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      status: 'active',
      taskCount: 24,
      teamMembers: 5,
      createdAt: '2025-11-15',
      updatedAt: '2025-12-02',
    },
    {
      _id: '2',
      name: 'Mobile App Development',
      description: 'Build a native mobile application for iOS and Android',
      status: 'active',
      taskCount: 18,
      teamMembers: 4,
      createdAt: '2025-11-20',
      updatedAt: '2025-12-01',
    },
    {
      _id: '3',
      name: 'Backend API Enhancement',
      description: 'Improve API performance and add new endpoints',
      status: 'active',
      taskCount: 12,
      teamMembers: 3,
      createdAt: '2025-11-10',
      updatedAt: '2025-11-28',
    },
    {
      _id: '4',
      name: 'Database Migration',
      description: 'Migrate from legacy database to modern cloud solution',
      status: 'completed',
      taskCount: 8,
      teamMembers: 2,
      createdAt: '2025-10-01',
      updatedAt: '2025-11-30',
    },
    {
      _id: '5',
      name: 'Security Audit',
      description: 'Comprehensive security review and vulnerability assessment',
      status: 'active',
      taskCount: 15,
      teamMembers: 3,
      createdAt: '2025-11-25',
      updatedAt: '2025-12-02',
    },
  ]);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const archivedProjects = projects.filter((p) => p.status === 'archived');

  const handleCreateProject = (projectData: {
    name: string;
    priority: string;
    startDate: string;
    endDate: string;
    collaborators: string[];
  }) => {
    const newProject: Project = {
      _id: String(projects.length + 1),
      name: projectData.name,
      description: 'New project',
      status: 'active',
      taskCount: 0,
      teamMembers: projectData.collaborators.length + 1,
      createdAt: projectData.startDate,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjects([...projects, newProject]);
    setIsCreateProjectModalOpen(false);
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
    <Link href={`/projects/${project._id}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {project.name}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {project.description}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${getStatusBadge(
              project.status
            )}`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span className="text-zinc-700 dark:text-zinc-300">
                {project.taskCount} tasks
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-zinc-500 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-zinc-700 dark:text-zinc-300">
                {project.teamMembers} members
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
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
