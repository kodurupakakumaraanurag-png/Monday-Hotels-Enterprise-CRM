import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <PlaceholderPage
      title="System Notifications & Alerts"
      subtitle="Real-time Alert Center for High-Value Leads, VIP Arrivals & Operations"
      icon={Bell}
      phaseTarget="Phase 4 (Auth & Notifications)"
      breadcrumbs={[{ label: "Intelligence & Admin" }, { label: "Notifications" }]}
      stats={[
        { label: "Unread Notifications", value: "3 Alerts", change: "Action Needed", isPositive: false },
        { label: "Total Received Today", value: "28 Alerts", change: "System Normal", isPositive: true },
        { label: "High Priority", value: "1 Alert", change: "VIP Check-in", isPositive: false },
        { label: "Delivery Success", value: "99.9%", change: "Push & Email", isPositive: true },
      ]}
      features={[
        "Notification filter tabs (All, Unread, High Priority, System)",
        "Notification preference matrix for email and web push alerts",
        "Direct deep links to relevant reservations or sales leads",
        "Mark as read and clear all actions",
      ]}
    />
  );
}
