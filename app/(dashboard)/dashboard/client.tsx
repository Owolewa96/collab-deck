'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
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

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  creator: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  collaborators: User[];
  // User preferences (from ProjectUser model)
  isPinned?: boolean;
  isArchived?: boolean;
  isFavorite?: boolean;
  isContributing?: boolean;
  recentlyViewed?: boolean;
  viewedAt?: string;
  // Computed fields
  taskCount?: number;
  teamMembers?: number;
  daysUntilDeadline?: number;
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
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [tasksFromServer, setTasksFromServer] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/user/dashboard', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(
            data.projects.map((p: any) => ({
              _id: p._id,
              name: p.name,
              description: p.description || '',
              status: p.status || 'active',
              creator: p.creator,
              priority: p.priority || 'medium',
              startDate: p.startDate || undefined,
              endDate: p.endDate || undefined,
              updatedAt: p.updatedAt || new Date().toISOString(),
            }))
          );
        }

        if (Array.isArray(data.recentProjects)) {
          setRecentProjects(data.recentProjects.map((p: any) => ({
            _id: p._id,
            name: p.name,
            description: p.description || '',
            status: p.status || 'active',
            creator: p.creator,
            updatedAt: p.updatedAt || new Date().toISOString(),
          })));
        }

        if (Array.isArray(data.tasks)) {
          setTasksFromServer(data.tasks);
        }
      } catch (err) {
        // ignore fetch errors
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Derive analytics from fetched projects and tasks
  const tasksFrom = tasksFromServer || [];
  const completedCount = tasksFrom.filter((t) => t.status === 'done').length;
  const assignedToYouCount = tasksFrom.filter((t) => t.assignees && t.assignees.includes(userName)).length;

  const userAnalytics: UserAnalytics = {
    projectsCreated: projects.filter((p) => p.creator === userName || p.creator === 'You').length,
    tasksCompleted: completedCount,
    contributions: tasksFrom.length,
    productivityScore: Math.min(100, completedCount > 0 ? Math.round((completedCount / Math.max(1, tasksFrom.length)) * 100) : 0),
    avgCompletionTime: 'n/a',
    streak: 0,
  };

  // Recent activity derived from tasks and projects
  const activityItems: ActivityItem[] = tasksFrom.slice(0, 8).map((t: any, i: number) => ({
    id: `${t._id || t.id}-${i}`,
    type: 'task',
    title: `${t.status === 'done' ? 'Completed' : 'Updated'} task "${t.title}"`,
    description: t.projectName || t.project?.name || 'Project',
    timestamp: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : (t.createdAt ? new Date(t.createdAt).toLocaleString() : 'recent'),
    icon: t.status === 'done' ? '✓' : '📝',
  } as ActivityItem));

  // Notifications: upcoming deadlines and new assignments
  const now = new Date();
  const upcomingDeadlines = tasksFrom.filter((t: any) => t.dueDate).filter((t: any) => {
    const due = new Date(t.dueDate);
    const diff = due.getTime() - now.getTime();
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000; // next 7 days
  });

  // Start with derived notifications, then we will overwrite with persisted ones from the server
  const derivedNotifications = [
    ...upcomingDeadlines.map((t: any, i: number) => ({
      id: `deadline-${t._id || t.id}-${i}`,
      type: 'deadline',
      title: `${t.title} due ${t.dueDate}`,
      description: `In ${t.projectName || t.project?.name || 'a project'}`,
      read: false,
      timestamp: t.dueDate,
    })),
    ...tasksFrom.filter((t: any) => t.assignees && t.assignees.includes(userName)).slice(0, 5).map((t: any, i: number) => ({
      id: `assignment-${t._id || t.id}-${i}`,
      type: 'assignment',
      title: `Assigned: ${t.title}`,
      description: `In ${t.projectName || t.project?.name || 'a project'}`,
      read: false,
      timestamp: t.createdAt || t.updatedAt || new Date().toISOString(),
    })),
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    derivedNotifications as NotificationItem[]
  );

  // Outgoing invites state
  const [invites, setInvites] = useState<Array<any>>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [deletingInvites, setDeletingInvites] = useState<string[]>([]);
  // confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<any>(null);

  // simple toast system
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'error' }>>([]);
  const toastIdRef = useRef(0);

  const pushToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = `toast-${++toastIdRef.current}`;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4500);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/notifications', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data.notifications)) {
          // map server notifications to client shape where necessary
          const mapped = data.notifications.map((n: any) => ({
            id: String(n._id || n.id),
            type: n.type,
            title: n.title,
            description: n.description || '',
            read: !!n.read,
            timestamp: n.createdAt || n.updatedAt,
            actionUrl: n.actionUrl,
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        // ignore
      }
    })();

    // fetch outgoing invites for the current user (inviter)
    (async () => {
      try {
        setLoadingInvites(true);
        const r = await fetch('/api/invites', { credentials: 'include' });
        if (!r.ok) { setLoadingInvites(false); return; }
        const payload = await r.json();
        if (!mounted) return;
        setInvites(Array.isArray(payload.invites) ? payload.invites : []);
      } catch (err) {
        // ignore
      } finally {
        setLoadingInvites(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tasksFrom]);


  // Compute top collaborators from projects
  const topCollaborators = useMemo(() => {
    const collabMap = new Map();
    // Only consider projects created by the user
    const userProjects = projects.filter(p => p.creator === userName);
    userProjects.forEach(project => {
      project.collaborators.forEach((collab: any) => {
        if (collab.name !== userName) { // Exclude self if somehow included
          if (!collabMap.has(collab._id)) {
            collabMap.set(collab._id, { name: collab.name, projects: 0 });
          }
          collabMap.get(collab._id).projects += 1;
        }
      });
    });
    return Array.from(collabMap.values()).sort((a, b) => b.projects - a.projects);
  }, [projects, userName]);


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
  const archived = projects.filter((p) => p.isArchived);
  const nearDeadline = projects.filter((p) => p.daysUntilDeadline && p.daysUntilDeadline <= 7);
  const favorite = projects.filter((p) => p.isFavorite);
  const unreadNotifications = notifications.filter((n) => !n.read);

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
          credentials: 'include',
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
            priority: createdProject.priority || projectData.priority,
            startDate: createdProject.startDate,
            endDate: createdProject.endDate,
            // User preferences (from ProjectUser model)
            isPinned: false,
            isArchived: false,
            isFavorite: false,
            isContributing: true,
            recentlyViewed: true,
            // Computed fields
            taskCount: createdProject.taskCount ?? 0,
            teamMembers: createdProject.teamMembersCount ?? (projectData.collaborators.length + 1),
            updatedAt: createdProject.updatedAt || new Date().toISOString().split('T')[0],
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
        priority: projectData.priority,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        // User preferences
        isPinned: false,
        isArchived: false,
        isFavorite: false,
        isContributing: true,
        recentlyViewed: true,
        // Computed fields
        taskCount: 0,
        teamMembers: projectData.collaborators.length + 1,
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
          <StatCard title="Projects Created" value={initialProjects.length} subtitle="All time" color="from-emerald-500 to-emerald-600" />
          <StatCard title="Tasks Completed" value={userAnalytics.tasksCompleted} subtitle="Overall" color="from-blue-500 to-blue-600" />
          <StatCard title="Contributions" value={userAnalytics.contributions} subtitle="Team contributions" color="from-purple-500 to-purple-600" />
          <StatCard title="Productivity Score" value={`${userAnalytics.productivityScore}%`} subtitle="Performance rating" color="from-orange-500 to-orange-600" />
          <StatCard title="Avg Completion Time" value={userAnalytics.avgCompletionTime} subtitle="Per task" color="from-pink-500 to-pink-600" />
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
              {topCollaborators.length === 0 && (
                <div className="text-xs text-zinc-600 dark:text-zinc-400">No collaborators yet</div>
              )}
              {topCollaborators.map((collab, idx) => (
                <div key={collab.name} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">{collab.name}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                    {collab.projects} projects • {collab.contributions} contributions
                  </p>
                </div>
              ))}
            </div>
            {/* Outgoing Invites Panel */}
            <div className="mt-4">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2 text-sm">Outgoing Invites</h4>
              <div className="space-y-2">
                {loadingInvites && <div className="text-xs text-zinc-600 dark:text-zinc-400">Loading invites…</div>}
                {!loadingInvites && invites.length === 0 && (
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">No outgoing invites</div>
                )}
                {invites.map((inv: any) => (
                  <div key={inv._id || inv.id} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">{inv.email}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{inv.projectName || (inv.project && inv.project.name) || '—'}</div>
                      <div className="text-xs text-zinc-500 mt-1">{inv.accepted ? 'Accepted' : 'Pending'} • {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : ''}</div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      {!inv.accepted && (
                        <button
                          onClick={() => {
                            setConfirmTarget(inv);
                            setConfirmOpen(true);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors"
                          disabled={deletingInvites.includes(String(inv._id || inv.id))}
                        >
                          {deletingInvites.includes(String(inv._id || inv.id)) ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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

        {/* Favorite Projects */}
        {favorite.length > 0 && (
          <section>
            <SectionHeader title="❤️ Favorite Projects" count={favorite.length} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorite.map((project) => (
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

        {/* Confirmation Modal */}
        {confirmOpen && confirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Cancel Invite</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Are you sure you want to cancel the invite to <strong className="text-zinc-900 dark:text-white">{confirmTarget.email}</strong>?</p>
              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 border rounded text-zinc-700" onClick={() => { setConfirmOpen(false); setConfirmTarget(null); }}>No</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={async () => {
                  const inv = confirmTarget;
                  setConfirmOpen(false);
                  setConfirmTarget(null);
                  const id = String(inv._id || inv.id);
                  if (deletingInvites.includes(id)) return;
                  setDeletingInvites((s) => [...s, id]);
                  // optimistic remove
                  setInvites((prev) => prev.filter((i) => String(i._id || i.id) !== id));
                  try {
                    const res = await fetch(`/api/invites/${id}`, { method: 'DELETE', credentials: 'include' });
                    if (!res.ok) {
                      const payload = await res.json().catch(() => null);
                      setInvites((prev) => [...prev, inv]);
                      pushToast('Failed to cancel invite', 'error');
                      console.warn('Failed to cancel invite', payload);
                    } else {
                      pushToast('Invite cancelled', 'success');
                    }
                  } catch (err) {
                    setInvites((prev) => [...prev, inv]);
                    pushToast('Network error while cancelling invite', 'error');
                  } finally {
                    setDeletingInvites((s) => s.filter((x) => x !== id));
                  }
                }}>Yes, cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Toasts */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-60">
          {toasts.map((t) => (
            <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
              {t.message}
            </div>
          ))}
        </div>
    </div>
  );
}
