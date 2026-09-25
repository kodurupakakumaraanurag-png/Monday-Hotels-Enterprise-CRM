import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { CheckSquare } from "lucide-react";

export default function TasksPage() {
  return (
    <PlaceholderPage
      title="Tasks & Operational Action Items"
      subtitle="Follow-ups, Proposal Deadlines, Guest Preferences & Staff Assignments"
      icon={CheckSquare}
      phaseTarget="Phase 6 (Sales Leads Pipeline)"
      breadcrumbs={[{ label: "Guest Experience" }, { label: "Tasks" }]}
      stats={[
        { label: "Pending Tasks", value: "24", change: "5 High Priority", isPositive: false },
        { label: "Completed Today", value: "38", change: "+14.0%", isPositive: true },
        { label: "Overdue Items", value: "0", change: "100% Compliant", isPositive: true },
        { label: "Avg Closure Time", value: "2.4 hrs", change: "-0.5 hrs", isPositive: true },
      ]}
      features={[
        "Priority-sorted task list (High, Medium, Low)",
        "Automated task creation based on deal stage movements",
        "Due date alerts and notification triggers",
        "Staff member assignment & workload balance indicators",
      ]}
    />
  );
}
