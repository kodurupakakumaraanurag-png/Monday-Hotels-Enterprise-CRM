import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { HeartHandshake } from "lucide-react";

export default function GuestRetentionPage() {
  return (
    <PlaceholderPage
      title="Guest Retention & CSAT"
      subtitle="Loyalty Program Management, Satisfaction Surveys & Churn Risk Analytics"
      icon={HeartHandshake}
      phaseTarget="Phase 9 (CSAT & Verification Build)"
      breadcrumbs={[{ label: "Guest Experience" }, { label: "Guest Retention" }]}
      stats={[
        { label: "Net Promoter Score (NPS)", value: "+68", change: "+4 pts", isPositive: true },
        { label: "CSAT Average", value: "4.85 / 5", change: "+0.15", isPositive: true },
        { label: "At-Risk Guests", value: "12 Profiles", change: "-5 Reduced", isPositive: true },
        { label: "Re-booking Rate", value: "44.2%", change: "+6.0%", isPositive: true },
      ]}
      features={[
        "Sentiment analysis feed of guest reviews and survey responses",
        "Automated post-stay survey dispatches & response logging",
        "Service recovery ticketing for low CSAT scores",
        "Loyalty points engine & reward redemption tracking",
      ]}
    />
  );
}
