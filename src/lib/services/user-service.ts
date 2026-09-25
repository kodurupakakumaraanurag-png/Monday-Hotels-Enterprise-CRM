export type EnterpriseRole =
  | "Super Admin"
  | "Corporate Sales Director"
  | "Hotel General Manager"
  | "Revenue Manager"
  | "Front Desk Concierge";

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  role: EnterpriseRole;
  status: "Active" | "Suspended" | "Pending";
  propertyAccess: string[]; // List of hotel property names or 'All Properties'
  lastActive: string;
  mfaEnabled: boolean;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

const MOCK_USERS: SystemUser[] = [
  {
    id: "USR-001",
    fullName: "Anurag Kodurupa",
    email: "anurag@mondayhotels.com",
    role: "Super Admin",
    status: "Active",
    propertyAccess: ["All Properties (Enterprise Master)"],
    lastActive: "Just now",
    mfaEnabled: true,
    department: "Executive Management",
    createdAt: "2024-01-01",
  },
  {
    id: "USR-002",
    fullName: "Priya Sharma",
    email: "priya.sharma@mondayhotels.com",
    role: "Hotel General Manager",
    status: "Active",
    propertyAccess: ["Monday Hotels Grand Royale Mumbai"],
    lastActive: "10 mins ago",
    mfaEnabled: true,
    department: "Hotel Operations",
    createdAt: "2024-02-15",
  },
  {
    id: "USR-003",
    fullName: "Vikram Malhotra",
    email: "v.malhotra@mondayhotels.com",
    role: "Corporate Sales Director",
    status: "Active",
    propertyAccess: ["All Properties (Enterprise Master)"],
    lastActive: "1 hour ago",
    mfaEnabled: true,
    department: "B2B Enterprise Sales",
    createdAt: "2024-03-01",
  },
  {
    id: "USR-004",
    fullName: "Ayesha Mukherjee",
    email: "ayesha.m@mondayhotels.com",
    role: "Revenue Manager",
    status: "Active",
    propertyAccess: ["Monday Hotels Palace Udaipur", "Monday Hotels Resort & Spa Goa"],
    lastActive: "3 hours ago",
    mfaEnabled: false,
    department: "Revenue & Yield Management",
    createdAt: "2024-04-10",
  },
  {
    id: "USR-005",
    fullName: "Rohan Kapoor",
    email: "rohan.k@mondayhotels.com",
    role: "Front Desk Concierge",
    status: "Active",
    propertyAccess: ["Monday Hotels Grand Royale Mumbai"],
    lastActive: "25 mins ago",
    mfaEnabled: false,
    department: "Front Office",
    createdAt: "2024-05-20",
  },
];

let usersStore: SystemUser[] = [...MOCK_USERS];

export function getUsers(): SystemUser[] {
  return usersStore;
}

export function getUserById(id: string): SystemUser | undefined {
  return usersStore.find((u) => u.id === id);
}

export function createUser(data: Omit<SystemUser, "id" | "lastActive" | "createdAt">): SystemUser {
  const newUser: SystemUser = {
    ...data,
    id: `USR-${Math.floor(100 + Math.random() * 900)}`,
    lastActive: "Never",
    createdAt: new Date().toISOString().split("T")[0],
  };
  usersStore = [newUser, ...usersStore];
  return newUser;
}

export function updateUser(id: string, data: Partial<SystemUser>): SystemUser | undefined {
  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  usersStore[index] = { ...usersStore[index], ...data };
  return usersStore[index];
}

export function deleteUser(id: string): boolean {
  const initialLen = usersStore.length;
  usersStore = usersStore.filter((u) => u.id !== id);
  return usersStore.length < initialLen;
}
