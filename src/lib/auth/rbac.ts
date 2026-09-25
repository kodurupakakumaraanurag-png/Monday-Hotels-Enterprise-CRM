import { UserRole, DemoAccount } from "@/types/auth";

// Defined route access matrix per role according to Enterprise CRM specs
export const ROLE_ROUTE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ["*"], // Full system access
  SALES_MANAGER: [
    "/dashboard",
    "/leads",
    "/pipeline",
    "/opportunities",
    "/corporate",
    "/contacts",
    "/activities",
    "/tasks",
    "/reports",
    "/notifications",
  ],
  SALES_EXECUTIVE: [
    "/dashboard",
    "/leads",
    "/pipeline",
    "/opportunities",
    "/contacts",
    "/activities",
    "/tasks",
    "/notifications",
  ],
  OPERATIONS_MANAGER: [
    "/dashboard",
    "/guests",
    "/guest-retention",
    "/properties",
    "/booking-enquiries",
    "/reservations",
    "/reports",
    "/activities",
    "/tasks",
    "/notifications",
  ],
  VIEWER: [
    "/dashboard",
    "/reports",
    "/notifications",
  ],
};

// Check if a given user role is authorized to view a specific path
export function canAccessRoute(role: UserRole | undefined, pathname: string): boolean {
  if (!role) return false;
  
  // ADMIN has full system access
  if (role === "ADMIN") return true;

  const allowedRoutes = ROLE_ROUTE_PERMISSIONS[role];
  if (!allowedRoutes) return false;

  // Root or login always allowed if authenticated
  if (pathname === "/" || pathname === "/dashboard" || pathname === "/login") return true;

  // Match route prefix (e.g. /leads/123 matches /leads)
  return allowedRoutes.some((route) => {
    if (route === "*") return true;
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

// Role badge visual styles
export function getRoleBadgeStyle(role: UserRole): { label: string; badgeClass: string } {
  switch (role) {
    case "ADMIN":
      return {
        label: "System Admin",
        badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      };
    case "SALES_MANAGER":
      return {
        label: "Sales Manager",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      };
    case "SALES_EXECUTIVE":
      return {
        label: "Sales Executive",
        badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      };
    case "OPERATIONS_MANAGER":
      return {
        label: "Ops Manager",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      };
    case "VIEWER":
      return {
        label: "Read-Only Viewer",
        badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/30",
      };
    default:
      return {
        label: role,
        badgeClass: "bg-slate-800 text-slate-300 border-slate-700",
      };
  }
}

// Pre-configured demo personas for 1-click testing
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    title: "Global Enterprise Admin",
    email: "admin@mondayhotels.com",
    name: "Vikramaditya Roy",
    description: "Full system access (Users, Audit Logs, Settings, All Modules)",
    badgeColor: "purple",
    permittedRoutes: ["All Systems & Admin Settings"],
  },
  {
    role: "SALES_MANAGER",
    title: "Regional Sales Director",
    email: "sales.mgr@mondayhotels.com",
    name: "Priya Sharma",
    description: "Access to Leads, Corporate Accounts, Deals, Reports & Team Tasks",
    badgeColor: "amber",
    permittedRoutes: ["Leads", "Pipeline", "Corporate", "Contacts", "Reports"],
  },
  {
    role: "SALES_EXECUTIVE",
    title: "Senior Sales Executive",
    email: "sales.exec@mondayhotels.com",
    name: "Rahul Verma",
    description: "Access to assigned Leads, Contacts, Opportunities & Tasks",
    badgeColor: "blue",
    permittedRoutes: ["Leads", "Pipeline", "Contacts", "Opportunities"],
  },
  {
    role: "OPERATIONS_MANAGER",
    title: "General Operations Manager",
    email: "ops.mgr@mondayhotels.com",
    name: "Ananya Deshmukh",
    description: "Access to Guests, Room Inventory, Booking Enquiries & Reservations",
    badgeColor: "emerald",
    permittedRoutes: ["Guests", "Properties", "Enquiries", "Reservations"],
  },
  {
    role: "VIEWER",
    title: "Executive Board Viewer",
    email: "viewer@mondayhotels.com",
    name: "Rajesh Singhania",
    description: "Read-only access to Portfolio Dashboard & High-level Reports",
    badgeColor: "slate",
    permittedRoutes: ["Dashboard", "Reports (Read-Only)"],
  },
];
