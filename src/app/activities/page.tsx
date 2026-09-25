import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Activity } from "lucide-react";

export default function ActivitiesPage() {
  return (
    <PlaceholderPage
      title="Staff & Guest Activity Trail"
      subtitle="Timeline Log of Sales Calls, Site Visits, Guest Requests & System Touches"
      icon={Activity}
      phaseTarget="Phase 6 (Sales Leads Pipeline)"
      breadcrumbs={[{ label: "Guest Experience" }, { label: "Activities" }]}
      stats={[
        { label: "Activities Logged Today", value: "128", change: "+18%", isPositive: true },
        { label: "Site Inspection Visits", value: "6 Scheduled", change: "This Week", isPositive: true },
        { label: "Sales Calls Made", value: "42 Calls", change: "On Target", isPositive: true },
        { label: "Response SLA Met", value: "98.4%", change: "+0.5%", isPositive: true },
      ]}
      features={[
        "Filterable activity stream timeline by property and staff member",
        "Quick log modal for phone calls, emails, site inspections, and quotes",
        "Integration with corporate calendar and email templates",
        "Automatic touchpoint logging from CRM actions",
      ]}
    />
  );
}
