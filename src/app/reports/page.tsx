import React from "react";
import { PlaceholderPage } from "@/components/placeholder-page";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports & Commercial Analytics"
      subtitle="Financial Revenue Reports, Occupancy Forecasts, Channel Mix & Pace Analysis"
      icon={BarChart3}
      phaseTarget="Phase 5 & Phase 9 (Revenue Analytics & CSAT)"
      breadcrumbs={[{ label: "Intelligence & Admin" }, { label: "Reports & Analytics" }]}
      stats={[
        { label: "YTD Gross Revenue", value: "$18,450,000", change: "+16.8%", isPositive: true },
        { label: "Forecasted Q4 RevPAR", value: "$265.00", change: "+8.2%", isPositive: true },
        { label: "Direct Channel Share", value: "62.4%", change: "+4.1%", isPositive: true },
        { label: "OTA Commission Saved", value: "$412,000", change: "+22.5%", isPositive: true },
      ]}
      features={[
        "Interactive revenue pace charts and pickup reports",
        "Channel manager distribution breakdown (Direct, OTA, GDS, Corporate)",
        "Scheduled automated PDF report email dispatches to executives",
        "Custom date range filtering and CSV export capabilities",
      ]}
    />
  );
}
