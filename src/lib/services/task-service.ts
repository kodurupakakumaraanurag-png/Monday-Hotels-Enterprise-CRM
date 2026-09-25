export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";

export interface OperationalTask {
  id: string;
  title: string;
  category: "Lead Follow-up" | "VIP Preference Setup" | "RFP Proposal" | "Contract Approval";
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  relatedEntity: string;
  createdAt: string;
}

const MOCK_TASKS: OperationalTask[] = [
  {
    id: "TSK-101",
    title: "Send revised RFP Proposal for Reliance Leadership Summit",
    category: "RFP Proposal",
    priority: "High",
    status: "In Progress",
    assignee: "Vikram Malhotra",
    dueDate: "Today, 5:00 PM",
    relatedEntity: "Reliance Enterprise Solutions",
    createdAt: "2026-09-25",
  },
  {
    id: "TSK-102",
    title: "Confirm Presidential Suite Goose Down Pillow setup for Dr. Singhania",
    category: "VIP Preference Setup",
    priority: "High",
    status: "Pending",
    assignee: "Priya Sharma (Chief Concierge)",
    dueDate: "Tomorrow, 10:00 AM",
    relatedEntity: "Dr. Vikramaditya Singhania",
    createdAt: "2026-09-25",
  },
  {
    id: "TSK-103",
    title: "Review B2B Corporate Discount Clause for Infosys",
    category: "Contract Approval",
    priority: "Medium",
    status: "Pending",
    assignee: "Anurag Kodurupa",
    dueDate: "2026-09-27",
    relatedEntity: "Infosys Global Systems",
    createdAt: "2026-09-24",
  },
  {
    id: "TSK-104",
    title: "Follow up on TCS Executive Retreat RFP terms",
    category: "Lead Follow-up",
    priority: "Medium",
    status: "Completed",
    assignee: "Vikram Malhotra",
    dueDate: "2026-09-24",
    relatedEntity: "TCS Enterprise Global",
    createdAt: "2026-09-23",
  },
];

let tasksStore: OperationalTask[] = [...MOCK_TASKS];

export function getTasks(): OperationalTask[] {
  return tasksStore;
}

export function toggleTaskStatus(id: string): OperationalTask | undefined {
  const task = tasksStore.find((t) => t.id === id);
  if (!task) return undefined;
  task.status = task.status === "Completed" ? "Pending" : "Completed";
  return task;
}

export function createTask(data: Omit<OperationalTask, "id" | "createdAt">): OperationalTask {
  const newTask: OperationalTask = {
    ...data,
    id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  tasksStore = [newTask, ...tasksStore];
  return newTask;
}
