import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { ClipboardList } from "lucide-react";

export default function BookingEnquiriesPage() {
  return (
    <PlaceholderPage
      title="Booking Enquiries"
      subtitle="Incoming Reservation Inquiries, Web Form Requests & Group Quotations"
      icon={ClipboardList}
      phaseTarget="Phase 8 (Reservations & Room Inventory)"
      breadcrumbs={[{ label: "Core Operations" }, { label: "Booking Enquiries" }]}
      stats={[
        { label: "New Enquiries", value: "24", change: "+15.0%", isPositive: true },
        { label: "Avg Response Time", value: "18 mins", change: "-4 mins", isPositive: true },
        { label: "Conversion Rate", value: "42.5%", change: "+3.2%", isPositive: true },
        { label: "Est. Enquiry Value", value: "$185,000", change: "+12.0%", isPositive: true },
      ]}
      features={[
        "Inbound enquiry queue with SLA countdown timer",
        "Instant group rate calculator & quotation generator",
        "One-click conversion from enquiry to confirmed reservation",
        "Guest communication history log",
      ]}
    />
  );
}
