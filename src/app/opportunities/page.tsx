import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { TrendingUp } from "lucide-react";

export default function OpportunitiesPage() {
  return (
    <PlaceholderPage
      title="Commercial Opportunities"
      subtitle="Qualified High-Value Deals, B2B RFP Contracts & Proposal Tracking"
      icon={TrendingUp}
      phaseTarget="Phase 6 (Sales Leads Pipeline)"
      breadcrumbs={[{ label: "Commercial CRM" }, { label: "Opportunities" }]}
      stats={[
        { label: "Active Opportunities", value: "28", change: "+4 Deals", isPositive: true },
        { label: "Proposal Sent Value", value: "$940,000", change: "+16.2%", isPositive: true },
        { label: "Win Ratio", value: "58.4%", change: "+3.1%", isPositive: true },
        { label: "Contracted Room Nights", value: "4,200", change: "+18%", isPositive: true },
      ]}
      features={[
        "Qualified opportunity detailed drawer with financial breakdown",
        "RFP proposal builder & PDF contract preview",
        "Competitor rate benchmarking notes",
        "Executive approval workflows for discounted rates",
      ]}
    />
  );
}
