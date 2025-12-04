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
      className="fixed create-project-modal inset-0 flex items-center justify-center z-50 h-screen"
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

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  creator: string;
  isContributing?: boolean;
  isPinned?: boolean;
  recentlyViewed?: boolean;
  taskCount?: number;
  teamMembers?: number;
  daysUntilDeadline?: number;
  requiresAction: boolean;
  updatedAt: string;
}

interface UserAnalytics {
  projectsCreated: number;
  tasksCompleted: number;
  contributions: number;
  productivityScore: number;
  avgCompletionTime: string;
  streak: number;
}

interface ActivityItem {
  id: string;
  type: 'project' | 'task' | 'comment' | 'member';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface NotificationItem {
  id: string;
  type: 'deadline' | 'mention' | 'assignment' | 'update' | 'system';
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface DashboardClientProps {
  userName: string;
  initialProjects: Project[];
}

export default function DashboardClient({ userName, initialProjects }: DashboardClientProps) {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  // Use fetched projects as initial state, allow updates from Create Project
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const userAnalytics: UserAnalytics = {
    projectsCreated: projects.filter((p) => p.creator === userName || p.creator === 'You').length,
    tasksCompleted: 127,
    contributions: 342,
    productivityScore: 94,
    avgCompletionTime: '2.3 days',
    streak: 12,
  };

  const activityItems: ActivityItem[] = [
    {
      id: '1',
      type: 'task',
      title: 'Completed task "Setup Database"',
      description: 'In Backend API Enhancement',
      timestamp: '2 hours ago',
      icon: '✓',
    },
    {
      id: '2',
      type: 'comment',
      title: 'Left a comment on "Design Sprint"',
      description: 'In Website Redesign',
      timestamp: '4 hours ago',
      icon: '💬',
    },
    {
      id: '3',
      type: 'member',
      title: 'Added Sarah Chen as contributor',
      description: 'To Security Audit project',
      timestamp: '1 day ago',
      icon: '👤',
    },
    {
      id: '4',
      type: 'project',
      title: 'Created new project "Mobile App Development"',
      description: 'Team collaboration project',
      timestamp: '3 days ago',
      icon: '📁',
    },
  ];

  const notificationItems: NotificationItem[] = [
    {
      id: '1',
      type: 'deadline',
      title: 'Website Redesign due in 5 days',
      description: 'Complete remaining tasks to meet deadline',
      read: false,
      timestamp: '1 hour ago',
    },
    {
      id: '2',
      type: 'mention',
      title: 'You were mentioned by John Doe',
      description: 'In Backend API Enhancement task comments',
      read: false,
      timestamp: '3 hours ago',
    },
    {
      id: '3',
      type: 'assignment',
      title: 'New task assigned: "Code Review"',
      description: 'In Security Audit project',
      read: false,
      timestamp: '1 day ago',
    },
    {
      id: '4',
      type: 'update',
      title: 'Project update: Database Migration',
      description: 'Jane Smith marked project as completed',
      read: true,
      timestamp: '2 days ago',
    },
  ];

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'active').length,
    activeTasks: projects.reduce((sum: number, p) => sum + (p.taskCount || 0), 0),
  };

  const StatCard = ({ title, value, subtitle, color }: { title: string; value: string | number; subtitle: string; color: string }) => (
    <div className={`bg-linear-to-br ${color} rounded-lg shadow-sm border border-opacity-20 p-6 text-white`}>
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs opacity-75 mt-2">{subtitle}</p>
    </div>
  );

  const TaskCard = ({ title, project, priority }: { title: string; project: string; priority: 'high' | 'medium' | 'low' }) => {
    const priorityColors = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
    };
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-zinc-900 dark:text-white text-sm flex-1">{title}</h4>
          <span className={`text-xs font-medium px-2 py-1 rounded ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{project}</p>
      </div>
    );
  };

  const NotificationComponent = ({ notification }: { notification: NotificationItem }) => {
    const typeIcons = {
      deadline: '⏰',
      mention: '👤',
      assignment: '📋',
      update: '🔔',
      system: '⚙️',
    };
    const typeColors = {
      deadline: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
      mention: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
      assignment: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
      update: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20',
      system: 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50',
    };

    return (
      <div className={`border rounded-lg p-4 ${typeColors[notification.type]} ${!notification.read ? 'font-medium' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-xl">{typeIcons[notification.type]}</span>
            <div className="flex-1">
              <h4 className="text-sm text-zinc-900 dark:text-white">{notification.title}</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{notification.description}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">{notification.timestamp}</p>
            </div>
          </div>
          {!notification.read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1 shrink-0"></div>}
        </div>
      </div>
    );
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Link href={`/projects/${project._id}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all p-4 cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">
            {project.name}
          </h4>
          {project.isPinned && (
            <span className="text-yellow-500 text-lg">★</span>
          )}
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span>{project.taskCount || 0} tasks</span>
          <span>{project.teamMembers || 1} members</span>
        </div>
      </div>
    </Link>
  );

  const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-sm font-normal text-zinc-600 dark:text-zinc-400">
            ({count})
          </span>
        )}
      </h2>
    </div>
  );

  const allActiveProjects = projects.filter((p) => p.status === 'active');
  const createdByYou = projects.filter((p) => p.creator === userName || p.creator === 'You');
  const contributing = projects.filter((p) => p.isContributing && p.creator !== userName && p.creator !== 'You');
  const recentlyViewed = projects.filter((p) => p.recentlyViewed);
  const pinned = projects.filter((p) => p.isPinned);
  const completed = projects.filter((p) => p.status === 'completed');
  const archived = projects.filter((p) => p.status === 'archived');
  const nearDeadline = projects.filter((p) => p.daysUntilDeadline && p.daysUntilDeadline <= 7);
  const requiresAction = projects.filter((p) => p.requiresAction);
  const unreadNotifications = notificationItems.filter((n) => !n.read);

  const handleCreateProject = (projectData: {
    name: string;
    priority: string;
    startDate: string;
    endDate: string;
    collaborators: string[];
  }) => {
    // Try creating project in backend first, fallback to local state on failure
    (async () => {
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectData.name,
            priority: projectData.priority,
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            collaborators: projectData.collaborators,
            description: 'New project',
            creator: userName,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const createdProject = data.project;
          // Ensure project shape matches front-end Project type
          const projectToAdd = {
            _id: String(createdProject._id || createdProject.id || projects.length + 1),
            name: createdProject.name || projectData.name,
            description: createdProject.description || 'New project',
            status: createdProject.status || 'active',
            creator: createdProject.creator || userName,
            isContributing: createdProject.isContributing ?? true,
            isPinned: createdProject.isPinned ?? false,
            recentlyViewed: createdProject.recentlyViewed ?? true,
            taskCount: createdProject.taskCount ?? 0,
            teamMembers: createdProject.teamMembersCount ?? (projectData.collaborators.length + 1),
            requiresAction: createdProject.requiresAction ?? false,
            updatedAt: createdProject.updatedAt || new Date().toISOString().split('T')[0],
            // optional field left undefined when unknown
            daysUntilDeadline: undefined,
          } as Project;

          setProjects((prev) => [...prev, projectToAdd]);
          setIsCreateProjectModalOpen(false);
          return;
        }
      } catch (err) {
        // ignore and fallback to client-side creation
        // console.warn('Project API create failed, falling back to client', err);
      }

      // Fallback: add locally so UI is responsive even if backend failed
      const fallbackProject = {
        _id: String(projects.length + 1),
        name: projectData.name,
        description: 'New project',
        status: 'active',
        creator: userName,
        isContributing: true,
        isPinned: false,
        recentlyViewed: true,
        taskCount: 0,
        teamMembers: projectData.collaborators.length + 1,
        requiresAction: false,
        updatedAt: new Date().toISOString().split('T')[0],
      } as Project;
      setProjects((prev) => [...prev, fallbackProject]);
      setIsCreateProjectModalOpen(false);
    })();
  };

  return (
    <div className="space-y-8">
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Welcome, {userName}! 👋
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Here's your performance overview
          </p>
        </div>
        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          + New Project
        </button>
      </div>

      {/* Quick Actions */}


      {/* User Analytics Section */}
      <section>
        <SectionHeader title="📊 Your Analytics" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Projects Created" value={userAnalytics.projectsCreated} subtitle="All time" color="from-emerald-500 to-emerald-600" />
          <StatCard title="Tasks Completed" value={userAnalytics.tasksCompleted} subtitle="Overall" color="from-blue-500 to-blue-600" />
          <StatCard title="Contributions" value={userAnalytics.contributions} subtitle="Team contributions" color="from-purple-500 to-purple-600" />
          <StatCard title="Productivity Score" value={`${userAnalytics.productivityScore}%`} subtitle="Performance rating" color="from-orange-500 to-orange-600" />
          <StatCard title="Avg Completion Time" value={userAnalytics.avgCompletionTime} subtitle="Per task" color="from-pink-500 to-pink-600" />
          <StatCard title="Current Streak" value={`${userAnalytics.streak} days`} subtitle="Active participation" color="from-red-500 to-red-600" />
        </div>
      </section>

      {/* Activity Timeline */}
      <section>
        <SectionHeader title="🕐 Recent Activity" />
        <div className="space-y-3">
          {activityItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{item.description}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">{item.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tasks & Workflow (moved to Tasks page) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">📋 Tasks & Workflow</h2>
          <Link href="/tasks" className="text-sm text-emerald-600 hover:underline">Open Tasks</Link>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Summary & detailed tasks moved to the Tasks page.</p>
      </section>

      {/* Team & Collaboration */}
      <section>
        <SectionHeader title="🤝 Team & Collaboration" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Your Teams</h3>
            <div className="space-y-3">
              {[
                { name: 'Frontend Team', members: 5, projects: 3 },
                { name: 'Backend Team', members: 4, projects: 2 },
                { name: 'Design Team', members: 3, projects: 2 },
              ].map((team, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">{team.name}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                    {team.members} members • {team.projects} projects
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Top Collaborators</h3>
            <div className="space-y-3">
              {[
                { name: 'John Doe', projects: 5, contributions: 142 },
                { name: 'Jane Smith', projects: 4, contributions: 98 },
                { name: 'Sarah Chen', projects: 3, contributions: 67 },
              ].map((collab, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">{collab.name}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                    {collab.projects} projects • {collab.contributions} contributions
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications (moved to notifications page) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">🔔 Notifications & Alerts</h2>
          <Link href="/notifications" className="text-sm text-emerald-600 hover:underline">View all</Link>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Your notifications moved to a dedicated Notifications page.</p>
      </section>

      {/* Projects Sections */}
      <div className="space-y-10">
        {/* Pinned / Favorite Projects */}
        {pinned.length > 0 && (
          <section>
            <SectionHeader title="📌 Pinned / Favorite Projects" count={pinned.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinned.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Projects Requiring Action */}
        {requiresAction.length > 0 && (
          <section>
            <SectionHeader title="⚠️ Projects Requiring Your Action" count={requiresAction.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requiresAction.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Projects Near Deadline */}
        {nearDeadline.length > 0 && (
          <section>
            <SectionHeader title="⏰ Projects Near Deadline" count={nearDeadline.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearDeadline.map((project) => (
                <div key={project._id}>
                  <ProjectCard project={project} />
                  {project.daysUntilDeadline && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      {project.daysUntilDeadline} days until deadline
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Projects */}
        {recentlyViewed.length > 0 && (
          <section>
            <SectionHeader title="🕐 Recently Viewed Projects" count={recentlyViewed.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyViewed.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* All Active Projects */}
        {allActiveProjects.length > 0 && (
          <section>
            <SectionHeader title="✨ All Active Projects" count={allActiveProjects.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allActiveProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Projects You Created */}
        {createdByYou.length > 0 && (
          <section>
            <SectionHeader title="👤 Projects You Created" count={createdByYou.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {createdByYou.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Projects You're Contributing To */}
        {contributing.length > 0 && (
          <section>
            <SectionHeader title="🤝 Projects You're Contributing To" count={contributing.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributing.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Projects */}
        {completed.length > 0 && (
          <section>
            <SectionHeader title="✅ Completed Projects" count={completed.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completed.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Archived Projects */}
        {archived.length > 0 && (
          <section>
            <SectionHeader title="📦 Archived Projects" count={archived.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archived.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
