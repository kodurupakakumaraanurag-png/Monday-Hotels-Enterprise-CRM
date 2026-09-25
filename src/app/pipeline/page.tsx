import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Kanban } from "lucide-react";

export default function PipelinePage() {
  return (
    <PlaceholderPage
      title="Sales Pipeline"
      subtitle="Visual Kanban Stage Progression for B2B Group Bookings & Corporate Deals"
      icon={Kanban}
      phaseTarget="Phase 6 (Sales Leads Pipeline)"
      breadcrumbs={[{ label: "Commercial CRM" }, { label: "Sales Pipeline" }]}
      stats={[
        { label: "Pipeline Total", value: "$2,850,000", change: "+18.5%", isPositive: true },
        { label: "Weighted Value", value: "$1,620,000", change: "+12.1%", isPositive: true },
        { label: "Open Deals", value: "38 Deals", change: "+5 New", isPositive: true },
        { label: "Avg Deal Size", value: "$75,000", change: "+4.2%", isPositive: true },
      ]}
      features={[
        "Interactive drag-and-drop Kanban stage columns",
        "Pipeline stages: Inquiry -> Proposal -> Site Visit -> Negotiation -> Won/Lost",
        "Stage probability calculations and expected close dates",
        "Deal owner filter & property pipeline switchers",
      ]}
    />
  );
}
