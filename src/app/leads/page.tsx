import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { UserCheck } from "lucide-react";

export default function LeadsPage() {
  return (
    <PlaceholderPage
      title="Sales Leads"
      subtitle="Group Sales Inbound Inquiries, Event Prospects & Lead Scoring"
      icon={UserCheck}
      phaseTarget="Phase 6 (Sales Leads Pipeline)"
      breadcrumbs={[{ label: "Commercial CRM" }, { label: "Leads" }]}
      stats={[
        { label: "New Leads (This Month)", value: "64", change: "+24.0%", isPositive: true },
        { label: "Unassigned Leads", value: "3", change: "Action Needed", isPositive: false },
        { label: "Lead Qualification Rate", value: "72.4%", change: "+5.0%", isPositive: true },
        { label: "Top Source", value: "Corporate Direct", change: "48% Share", isPositive: true },
      ]}
      features={[
        "React Hook Form + Zod lead creation modal with validation",
        "Lead scoring engine based on room night volume and budget",
        "Lead assignment to hotel sales managers",
        "Activity log timeline for phone calls, emails, and meetings",
      ]}
    />
  );
}
