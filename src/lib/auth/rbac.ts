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
        badgeClass: "bg-[#E9D7AE] text-[#1E293B] border-[#C9A15B]",
      };
    case "SALES_MANAGER":
      return {
        label: "Sales Manager",
        badgeClass: "bg-[#DDE9E1] text-[#1E4D3B] border-[#A8C3B2]",
      };
    case "SALES_EXECUTIVE":
      return {
        label: "Sales Executive",
        badgeClass: "bg-[#DDE9E1] text-[#285943] border-[#A8C3B2]",
      };
    case "OPERATIONS_MANAGER":
      return {
        label: "Ops Manager",
        badgeClass: "bg-[#DDE9E1] text-[#1E4D3B] border-[#A8C3B2]",
      };
    case "VIEWER":
      return {
        label: "Read-Only Viewer",
        badgeClass: "bg-[#F7F4EC] text-[#6B766F] border-[#E5E2D9]",
      };
    default:
      return {
        label: role,
        badgeClass: "bg-[#F7F4EC] text-[#1E293B] border-[#E5E2D9]",
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
