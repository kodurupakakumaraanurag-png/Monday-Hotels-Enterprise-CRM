import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Contact } from "lucide-react";

export default function ContactsPage() {
  return (
    <PlaceholderPage
      title="B2B Contacts Directory"
      subtitle="Event Organizers, Travel Managers, Corporate Buyers & Agency Contacts"
      icon={Contact}
      phaseTarget="Phase 7 (Guest 360° & Corporate Accounts)"
      breadcrumbs={[{ label: "Commercial CRM" }, { label: "Contacts" }]}
      stats={[
        { label: "Total Contacts", value: "850", change: "+45 This Month", isPositive: true },
        { label: "Key Decision Makers", value: "320", change: "Verified", isPositive: true },
        { label: "Travel Agencies", value: "95", change: "+8 Agencies", isPositive: true },
        { label: "Opted-in Marketing", value: "91%", change: "High Reach", isPositive: true },
      ]}
      features={[
        "Full contact card cards with direct dial, LinkedIn, and corporate affiliation",
        "Tagging by buyer persona (Travel Mgr, Event Planner, Procurement)",
        "Communication history and call logging",
        "VCard export and contact sync options",
      ]}
    />
  );
}
