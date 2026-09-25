import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Executive Dashboard"
      subtitle="Portfolio KPI Summary, RevPAR, Occupancy Rates & Commercial Highlights"
      icon={LayoutDashboard}
      phaseTarget="Phase 5 (Executive Dashboard & Analytics)"
      breadcrumbs={[{ label: "Dashboard" }]}
      stats={[
        { label: "Portfolio RevPAR", value: "$248.50", change: "+14.2%", isPositive: true },
        { label: "Average Daily Rate (ADR)", value: "$312.00", change: "+6.8%", isPositive: true },
        { label: "Occupancy Rate", value: "84.6%", change: "+3.4%", isPositive: true },
        { label: "Active Lead Pipeline", value: "$1,450,000", change: "+22.1%", isPositive: true },
      ]}
      features={[
        "Real-time RevPAR, ADR, and Occupancy metric cards",
        "Interactive Recharts monthly revenue and forecast trends",
        "Multi-property comparative performance breakdown",
        "Recent high-value group lead activity feed",
      ]}
    />
  );
}
