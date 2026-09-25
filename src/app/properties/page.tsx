import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Hotel } from "lucide-react";

export default function PropertiesPage() {
  return (
    <PlaceholderPage
      title="Hotel Properties & Portfolio"
      subtitle="Property Profiles, Room Categories, Inventory & Asset Configuration"
      icon={Hotel}
      phaseTarget="Phase 3 & Phase 4 (Property Context & Database)"
      breadcrumbs={[{ label: "Core Operations" }, { label: "Properties" }]}
      stats={[
        { label: "Active Properties", value: "4", change: "100% Operational", isPositive: true },
        { label: "Total Keys / Rooms", value: "1,240", change: "+50 Keys", isPositive: true },
        { label: "Out of Service", value: "8 Rooms", change: "-2 Rooms", isPositive: true },
        { label: "Portfolio Value", value: "$420M", change: "+4.5%", isPositive: true },
      ]}
      features={[
        "Property management cards with room breakdown & amenities",
        "Room category pricing rules and seasonality tiers",
        "Property manager contact assignments",
        "Multi-property portfolio analytics rollup",
      ]}
    />
  );
}
