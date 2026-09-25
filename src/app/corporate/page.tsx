import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Building2 } from "lucide-react";

export default function CorporatePage() {
  return (
    <PlaceholderPage
      title="Corporate Accounts"
      subtitle="Enterprise Company Profiles, Negotiated Rates & B2B Volume Contracts"
      icon={Building2}
      phaseTarget="Phase 7 (Guest 360° & Corporate Accounts)"
      breadcrumbs={[{ label: "Commercial CRM" }, { label: "Corporate Clients" }]}
      stats={[
        { label: "Corporate Accounts", value: "142", change: "+12 Accounts", isPositive: true },
        { label: "Contracted Revenue", value: "$3,400,000", change: "+21.5%", isPositive: true },
        { label: "Avg Corporate ADR", value: "$285.00", change: "+4.0%", isPositive: true },
        { label: "Account Managers", value: "8 Staff", change: "Full Coverage", isPositive: true },
      ]}
      features={[
        "Company directory with corporate tax ID and contract codes",
        "Negotiated corporate rate tiers across hotel properties",
        "Key contacts & decision maker directory",
        "Annual room night commitment vs actual production tracking",
      ]}
    />
  );
}
