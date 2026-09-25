import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="System & Property Settings"
      subtitle="Global CRM Settings, Integration Keys, Currency Formats & Branding"
      icon={Settings}
      phaseTarget="Phase 1 & Phase 4 (Configuration & Infrastructure)"
      breadcrumbs={[{ label: "Intelligence & Admin" }, { label: "Settings" }]}
      stats={[
        { label: "CRM System Version", value: "v2.4.0", change: "Latest Build", isPositive: true },
        { label: "Connected APIs", value: "4 Integrations", change: "PMS & Webhooks", isPositive: true },
        { label: "Default Currency", value: "USD ($)", change: "Multi-Currency", isPositive: true },
        { label: "DB Connection Status", value: "Operational", change: "Latency 24ms", isPositive: true },
      ]}
      features={[
        "Organization details and logo customization",
        "Currency, date format, and timezone preferences",
        "Supabase API credentials and webhook endpoints configuration",
        "Email template manager for automated quotes and receipts",
      ]}
    />
  );
}
