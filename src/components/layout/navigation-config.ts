import {
  LayoutDashboard,
  Kanban,
  UserCheck,
  TrendingUp,
  Users,
  Building2,
  Contact,
  CalendarDays,
  Hotel,
  Activity,
  CheckSquare,
  HeartHandshake,
  BarChart3,
  Bell,
  UserCog,
  Settings,
  ShieldAlert,
  ClipboardList,
  Database,
} from "lucide-react";
import { NavGroup } from "@/types/navigation";

export const navigationConfig: NavGroup[] = [
  {
    groupTitle: "Executive & Core",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Executive KPIs, RevPAR, ADR, and portfolio overview",
      },
      {
        title: "Reservations",
        href: "/reservations",
        icon: CalendarDays,
        badge: 12,
        description: "Guest stay bookings, check-ins, check-outs, and room status",
      },
      {
        title: "Booking Enquiries",
        href: "/booking-enquiries",
        icon: ClipboardList,
        badge: "New",
        description: "Incoming reservation inquiries and rate requests",
      },
      {
        title: "Properties",
        href: "/properties",
        icon: Hotel,
        description: "Hotel properties, inventory, room categories, and amenities",
      },
    ],
  },
  {
    groupTitle: "Sales & Commercial CRM",
    items: [
      {
        title: "Sales Pipeline",
        href: "/pipeline",
        icon: Kanban,
        description: "Visual deal stage progression for group & event sales",
      },
      {
        title: "Leads",
        href: "/leads",
        icon: UserCheck,
        badge: 8,
        description: "Inbound & outbound group sales opportunities",
      },
      {
        title: "Opportunities",
        href: "/opportunities",
        icon: TrendingUp,
        description: "Qualified sales deals, proposals, and contract negotiations",
      },
      {
        title: "Corporate Clients",
        href: "/corporate",
        icon: Building2,
        description: "Enterprise accounts, corporate rate agreements, and SLAs",
      },
      {
        title: "Contacts",
        href: "/contacts",
        icon: Contact,
        description: "Corporate buyers, event planners, and travel agent contacts",
      },
    ],
  },
  {
    groupTitle: "Guest Experience",
    items: [
      {
        title: "Guests",
        href: "/guests",
        icon: Users,
        description: "360° guest profile records, preference tags, and stay history",
      },
      {
        title: "Guest Retention",
        href: "/guest-retention",
        icon: HeartHandshake,
        description: "VIP guest loyalty, CSAT sentiment scores, and churn prevention",
      },
      {
        title: "Activities",
        href: "/activities",
        icon: Activity,
        description: "Audit trail of guest interactions, sales calls, and site visits",
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: CheckSquare,
        badge: 5,
        description: "Operational action items, follow-ups, and SLA reminders",
      },
    ],
  },
  {
    groupTitle: "Intelligence & Admin",
    items: [
      {
        title: "Reports & Analytics",
        href: "/reports",
        icon: BarChart3,
        description: "Financial performance, revenue forecasts, and channel mix",
      },
      {
        title: "Data Import Wizard",
        href: "/import",
        icon: Database,
        badge: "Tool",
        description: "Bulk CSV/Excel migration with validation & deduplication",
      },
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: 3,
        description: "System alerts, high-value lead updates, and VIP arrivals",
      },
      {
        title: "Users",
        href: "/users",
        icon: UserCog,
        description: "Hotel staff accounts, role-based access control, and teams",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "System configurations, integrations, and property preferences",
      },
      {
        title: "Audit Logs",
        href: "/audit-logs",
        icon: ShieldAlert,
        description: "Compliance audit trail, security events, and system changes",
      },
    ],
  },
];
