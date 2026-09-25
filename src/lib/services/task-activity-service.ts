import {
  TaskFormValues,
  ActivityLogFormValues,
  TaskStatusType,
  TaskPriorityType,
  ActivityType,
} from "../validations/task-activity-schema";

export interface EnterpriseTask extends TaskFormValues {
  id: string;
  createdAt: string;
}

export interface EnterpriseActivityLog extends ActivityLogFormValues {
  id: string;
  timestamp: string;
}

const INITIAL_TASKS: EnterpriseTask[] = [
  {
    id: "TSK-2026-101",
    title: "Follow up on Reliance Leadership Summit RFP Proposal",
    description: "Confirm Presidential Sky Suite availability and finalize catering addendum.",
    assignedUser: "Vikram Malhotra",
    relatedLead: "Reliance Tech Summit Lead",
    relatedCompany: "Reliance Enterprise Solutions",
    relatedContact: "Dr. Vikramaditya Singhania",
    relatedGuest: "Dr. Vikramaditya Singhania",
    dueDate: "2026-09-26", // Upcoming
    priority: "URGENT",
    status: "IN_PROGRESS",
    createdAt: "2026-09-20",
  },
  {
    id: "TSK-2026-102",
    title: "Setup VIP Goose Down Pillow preference for Dr. Singhania",
    description: "Ensure housekeepers place 4 goose down pillows and sparkling water in Suite 1001.",
    assignedUser: "Priya Sharma",
    relatedGuest: "Dr. Vikramaditya Singhania",
    relatedCompany: "Reliance Enterprise Solutions",
    dueDate: "2026-09-20", // Overdue if not completed
    priority: "HIGH",
    status: "TODO",
    createdAt: "2026-09-15",
  },
  {
    id: "TSK-2026-103",
    title: "Prepare Infosys Corporate Discount Agreement",
    description: "Draft 22.5% corporate rate ceiling document for annual signing.",
    assignedUser: "Priya Sharma",
    relatedCompany: "Infosys Global Systems",
    relatedContact: "Elena Rostova",
    dueDate: "2026-10-01",
    priority: "MEDIUM",
    status: "TODO",
    createdAt: "2026-09-22",
  },
  {
    id: "TSK-2026-104",
    title: "Conduct site visit tour for TCS Event Coordinators",
    description: "Show Beachfront Pool Villa 12 and Grand Ballroom in Goa.",
    assignedUser: "Vikram Malhotra",
    relatedCompany: "TCS Enterprise Global",
    relatedContact: "Marcus Vance",
    dueDate: "2026-09-18",
    priority: "HIGH",
    status: "COMPLETED",
    createdAt: "2026-09-10",
  },
];

const INITIAL_ACTIVITIES: EnterpriseActivityLog[] = [
  {
    id: "ACT-2026-001",
    activityType: "CALL",
    title: "Discovery Call with Reliance Board Secretariat",
    description: "Discussed 450 suite nights allocation and security escort for Chairman.",
    loggedBy: "Vikram Malhotra",
    relatedEntity: "Reliance Enterprise Solutions",
    relatedEntityId: "CORP-101",
    timestamp: "2026-09-25 14:30",
  },
  {
    id: "ACT-2026-002",
    activityType: "EMAIL",
    title: "Sent Revised RFP Quotation PDF ($145,000)",
    description: "Emailed complete 15-page commercial proposal with discounted ADR.",
    loggedBy: "Priya Sharma",
    relatedEntity: "Reliance Enterprise Solutions",
    relatedEntityId: "CORP-101",
    timestamp: "2026-09-24 16:15",
  },
  {
    id: "ACT-2026-003",
    activityType: "MEETING",
    title: "In-Person Executive Banquet Review",
    description: "Met with Chef Sanjeev regarding gluten-free catering menu.",
    loggedBy: "Priya Sharma",
    relatedEntity: "Dr. Vikramaditya Singhania",
    relatedEntityId: "GST-9001",
    timestamp: "2026-09-23 11:00",
  },
  {
    id: "ACT-2026-004",
    activityType: "SITE_VISIT",
    title: "Goa Beachfront Villa Inspection Tour",
    description: "Escorted Marcus Vance through Villa 12 and Spa facilities.",
    loggedBy: "Vikram Malhotra",
    relatedEntity: "TCS Enterprise Global",
    relatedEntityId: "CORP-103",
    timestamp: "2026-09-21 15:00",
  },
  {
    id: "ACT-2026-005",
    activityType: "NOTE",
    title: "Logged High-Touch Butler Preference",
    description: "Prefers morning Financial Times paper and 21°C constant room climate.",
    loggedBy: "Priya Sharma",
    relatedEntity: "Dr. Vikramaditya Singhania",
    relatedEntityId: "GST-9001",
    timestamp: "2026-09-20 09:30",
  },
  {
    id: "ACT-2026-006",
    activityType: "FOLLOW_UP",
    title: "Follow-up on Infosys Partner Conference Contract",
    description: "Re-engaged Elena Rostova via telephone.",
    loggedBy: "Vikram Malhotra",
    relatedEntity: "Infosys Global Systems",
    relatedEntityId: "CORP-102",
    timestamp: "2026-09-19 13:20",
  },
];

let tasksStore: EnterpriseTask[] = [...INITIAL_TASKS];
let activitiesStore: EnterpriseActivityLog[] = [...INITIAL_ACTIVITIES];

// --- TASK SERVICE API ---
export function getTasks(): EnterpriseTask[] {
  return tasksStore;
}

export function getMyTasks(username: string): EnterpriseTask[] {
  return tasksStore.filter((t) => t.assignedUser.toLowerCase().includes(username.toLowerCase()));
}

export function getUpcomingTasks(): EnterpriseTask[] {
  const today = new Date().toISOString().split("T")[0];
  return tasksStore.filter((t) => t.dueDate >= today && t.status !== "COMPLETED");
}

export function getOverdueTasks(): EnterpriseTask[] {
  const today = new Date().toISOString().split("T")[0];
  return tasksStore.filter((t) => t.dueDate < today && t.status !== "COMPLETED");
}

export function createTask(data: TaskFormValues): EnterpriseTask {
  const newTask: EnterpriseTask = {
    ...data,
    id: `TSK-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString().split("T")[0],
  };

  tasksStore = [newTask, ...tasksStore];

  // Auto-log activity for task creation
  logActivity({
    activityType: "NOTE",
    title: `Task Created: ${data.title}`,
    description: `Assigned to ${data.assignedUser} with priority ${data.priority} (Due: ${data.dueDate})`,
    loggedBy: data.assignedUser || "System User",
    relatedEntity: data.relatedCompany || data.relatedGuest || data.relatedLead || "System Task",
  });

  return newTask;
}

export function updateTask(id: string, data: Partial<TaskFormValues>): EnterpriseTask | undefined {
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;

  tasksStore[idx] = { ...tasksStore[idx], ...data };
  return tasksStore[idx];
}

export function completeTask(id: string): EnterpriseTask | undefined {
  const task = tasksStore.find((t) => t.id === id);
  if (!task) return undefined;

  task.status = task.status === "COMPLETED" ? "TODO" : "COMPLETED";

  if (task.status === "COMPLETED") {
    logActivity({
      activityType: "FOLLOW_UP",
      title: `Completed Task: ${task.title}`,
      description: `Task marked complete by ${task.assignedUser}`,
      loggedBy: task.assignedUser,
      relatedEntity: task.relatedCompany || task.relatedGuest || "System Task",
    });
  }

  return task;
}

export function deleteTask(id: string): boolean {
  const len = tasksStore.length;
  tasksStore = tasksStore.filter((t) => t.id !== id);
  return tasksStore.length < len;
}

// --- ACTIVITY SERVICE API ---
export function getActivities(): EnterpriseActivityLog[] {
  return activitiesStore;
}

export function getActivitiesForEntity(relatedEntityName: string, relatedEntityId?: string): EnterpriseActivityLog[] {
  const searchKey = relatedEntityName.toLowerCase();
  return activitiesStore.filter((a) => {
    if (relatedEntityId && a.relatedEntityId === relatedEntityId) return true;
    return a.relatedEntity.toLowerCase().includes(searchKey);
  });
}

export function logActivity(data: ActivityLogFormValues): EnterpriseActivityLog {
  const newActivity: EnterpriseActivityLog = {
    ...data,
    id: `ACT-2026-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: data.timestamp || new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  activitiesStore = [newActivity, ...activitiesStore];
  return newActivity;
}
