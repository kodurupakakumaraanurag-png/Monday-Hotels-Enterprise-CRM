import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { CalendarDays } from "lucide-react";

export default function ReservationsPage() {
  return (
    <PlaceholderPage
      title="Reservations Management"
      subtitle="Guest Stay Bookings, Check-in Schedule, Room Allocation & Statuses"
      icon={CalendarDays}
      phaseTarget="Phase 8 (Reservations & Room Inventory)"
      breadcrumbs={[{ label: "Core Operations" }, { label: "Reservations" }]}
      stats={[
        { label: "Total Bookings", value: "482", change: "+8.4%", isPositive: true },
        { label: "Check-ins Today", value: "34", change: "On Track", isPositive: true },
        { label: "Check-outs Today", value: "28", change: "Cleared", isPositive: true },
        { label: "Direct Booking Share", value: "68.2%", change: "+5.1%", isPositive: true },
      ]}
      features={[
        "TanStack table with status badges (Confirmed, Checked-In, Cancelled)",
        "Calendar schedule grid view for room allocations",
        "New reservation booking wizard with datepicker",
        "Automated confirmation email dispatch trigger",
      ]}
    />
  );
}
