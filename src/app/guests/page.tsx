import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Users } from "lucide-react";

export default function GuestsPage() {
  return (
    <PlaceholderPage
      title="Guest Profiles 360°"
      subtitle="Comprehensive Guest CRM, VIP Loyalty Tiers, Personalization & Lifetime Value"
      icon={Users}
      phaseTarget="Phase 7 (Guest 360° & Corporate Accounts)"
      breadcrumbs={[{ label: "Guest Experience" }, { label: "Guests" }]}
      stats={[
        { label: "Total Guest Profiles", value: "14,820", change: "+1,240 New", isPositive: true },
        { label: "VIP Tier Members", value: "1,150", change: "7.8% of Base", isPositive: true },
        { label: "Repeat Guest Ratio", value: "38.5%", change: "+4.2%", isPositive: true },
        { label: "Avg Guest LTV", value: "$4,850", change: "+12.4%", isPositive: true },
      ]}
      features={[
        "360° Guest card drawer detailing room preferences (pillow, floor, quiet room)",
        "Historical stay timeline with spend breakdown (Room, F&B, Spa)",
        "VIP status badge assignment (Black Diamond, Platinum, Gold)",
        "Dietary & anniversary notes for front desk concierges",
      ]}
    />
  );
}
