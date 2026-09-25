import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { UserCog } from "lucide-react";

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Staff Directory & User Management"
      subtitle="Hotel Personnel Accounts, Role-Based Access Control (RBAC) & Teams"
      icon={UserCog}
      phaseTarget="Phase 4 (Auth & Multi-Property Context)"
      breadcrumbs={[{ label: "Intelligence & Admin" }, { label: "Users" }]}
      stats={[
        { label: "Active Staff Users", value: "48 Users", change: "100% Licensed", isPositive: true },
        { label: "Role Categories", value: "5 Roles", change: "RBAC Active", isPositive: true },
        { label: "Active Sessions", value: "14 Staff", change: "Online Now", isPositive: true },
        { label: "Security Enforcement", value: "MFA Enabled", change: "100% Policy", isPositive: true },
      ]}
      features={[
        "User account table with property assignment badges",
        "Role permissions editor (Super Admin, Property Mgr, Sales Mgr, Front Desk)",
        "Staff invite wizard with email magic link dispatch",
        "Session audit & access revocation buttons",
      ]}
    />
  );
}
