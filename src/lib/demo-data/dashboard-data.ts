// Isolated Demo Data Layer for Monday Hotels Enterprise CRM Dashboard
// Designed to be swapped cleanly with real Supabase / PostgreSQL database service queries.

export interface DashboardKPIData {
  totalLeads: { value: number; change: string; isPositive: boolean; subtitle: string };
  qualifiedLeads: { value: number; change: string; isPositive: boolean; subtitle: string };
  activeOpportunities: { value: number; change: string; isPositive: boolean; totalValue: string };
  bookingEnquiries: { value: number; change: string; isPositive: boolean; slaPerformance: string };
  confirmedReservations: { value: number; change: string; isPositive: boolean; occupancyRate: string };
  revenuePipeline: { value: string; change: string; isPositive: boolean; subtitle: string };
  conversionRate: { value: string; change: string; isPositive: boolean; subtitle: string };
  returningGuests: { value: string; change: string; isPositive: boolean; subtitle: string };
}

export interface PipelineStageData {
  stage: string;
  count: number;
  value: number;
  color: string;
}

export interface EnquiryConversionData {
  month: string;
  received: number;
  converted: number;
  rate: number;
}

export interface ReservationTrendData {
  month: string;
  roomNights: number;
  occupancyPct: number;
  adr: number;
}

export interface RevenuePipelineData {
  month: string;
  realized: number;
  pipeline: number;
  target: number;
}

export interface GuestRetentionData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export interface LeadSourceData {
  source: string;
  percentage: number;
  leadsCount: number;
  color: string;
}

export interface RecentLead {
  id: string;
  companyName: string;
  contactPoc: string;
  industry: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  score: number;
  status: string;
  source: string;
  createdAt: string;
}

export interface RecentEnquiry {
  id: string;
  enquiryCode: string;
  guestName: string;
  property: string;
  dates: string;
  roomsCount: number;
  budget: string;
  status: string;
}

export interface UpcomingReservation {
  id: string;
  reservationCode: string;
  guestName: string;
  property: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  paymentStatus: "PAID" | "PARTIAL" | "PENDING";
  vipTier: string;
}

export interface PendingTask {
  id: string;
  title: string;
  assignedTo: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface RecentActivity {
  id: string;
  title: string;
  type: "CALL" | "EMAIL" | "MEETING" | "SITE_VISIT" | "NOTE" | "STATUS_CHANGE";
  performer: string;
  timestamp: string;
  relatedEntity: string;
}

export interface FullDashboardData {
  kpis: DashboardKPIData;
  leadPipelineStages: PipelineStageData[];
  enquiryConversion: EnquiryConversionData[];
  reservationTrends: ReservationTrendData[];
  revenuePipeline: RevenuePipelineData[];
  guestRetention: GuestRetentionData[];
  leadSources: LeadSourceData[];
  recentLeads: RecentLead[];
  recentEnquiries: RecentEnquiry[];
  upcomingReservations: UpcomingReservation[];
  pendingTasks: PendingTask[];
  recentActivities: RecentActivity[];
}

export const MOCK_DASHBOARD_DATA: FullDashboardData = {
  kpis: {
    totalLeads: { value: 284, change: "+18.4%", isPositive: true, subtitle: "vs prev 30 days" },
    qualifiedLeads: { value: 142, change: "+12.6%", isPositive: true, subtitle: "50% qualification rate" },
    activeOpportunities: { value: 68, change: "+22.1%", isPositive: true, totalValue: "$2.45M Deal Pipeline" },
    bookingEnquiries: { value: 195, change: "+9.2%", isPositive: true, slaPerformance: "94.5% response SLA" },
    confirmedReservations: { value: 1240, change: "+14.8%", isPositive: true, occupancyRate: "85.4% portfolio avg" },
    revenuePipeline: { value: "$3,850,000", change: "+24.2%", isPositive: true, subtitle: "Target $3.50M" },
    conversionRate: { value: "44.8%", change: "+4.2%", isPositive: true, subtitle: "Enquiry to Booking" },
    returningGuests: { value: "62.4%", change: "+5.1%", isPositive: true, subtitle: "Loyalty Repeat Guests" },
  },

  leadPipelineStages: [
    { stage: "New Leads", count: 85, value: 425000, color: "#6B766F" },
    { stage: "Contacted", count: 62, value: 620000, color: "#A8C3B2" },
    { stage: "Qualified", count: 48, value: 720000, color: "#285943" },
    { stage: "Proposal / Quote", count: 38, value: 950000, color: "#C9A15B" },
    { stage: "Negotiation", count: 26, value: 680000, color: "#173F32" },
    { stage: "Confirmed Won", count: 25, value: 455000, color: "#2E8B57" },
  ],

  enquiryConversion: [
    { month: "May", received: 140, converted: 58, rate: 41.4 },
    { month: "Jun", received: 155, converted: 66, rate: 42.5 },
    { month: "Jul", received: 170, converted: 75, rate: 44.1 },
    { month: "Aug", received: 185, converted: 82, rate: 44.3 },
    { month: "Sep", received: 195, converted: 88, rate: 45.1 },
    { month: "Oct (F)", received: 210, converted: 98, rate: 46.6 },
  ],

  reservationTrends: [
    { month: "May", roomNights: 2450, occupancyPct: 79.2, adr: 285 },
    { month: "Jun", roomNights: 2620, occupancyPct: 81.5, adr: 295 },
    { month: "Jul", roomNights: 2780, occupancyPct: 83.1, adr: 305 },
    { month: "Aug", roomNights: 2910, occupancyPct: 84.6, adr: 312 },
    { month: "Sep", roomNights: 3050, occupancyPct: 86.2, adr: 325 },
    { month: "Oct (F)", roomNights: 3200, occupancyPct: 88.5, adr: 340 },
  ],

  revenuePipeline: [
    { month: "May", realized: 1850000, pipeline: 450000, target: 2000000 },
    { month: "Jun", realized: 2100000, pipeline: 520000, target: 2100000 },
    { month: "Jul", realized: 2350000, pipeline: 640000, target: 2250000 },
    { month: "Aug", realized: 2580000, pipeline: 780000, target: 2400000 },
    { month: "Sep", realized: 2820000, pipeline: 890000, target: 2600000 },
    { month: "Oct (F)", realized: 3100000, pipeline: 950000, target: 2800000 },
  ],

  guestRetention: [
    { category: "Returning Loyalty Members", value: 774, percentage: 62.4, color: "#285943" },
    { category: "First-Time Guests", value: 466, percentage: 37.6, color: "#C9A15B" },
  ],

  leadSources: [
    { source: "Direct Brand Web", percentage: 42, leadsCount: 119, color: "#285943" },
    { source: "Corporate MICE & B2B", percentage: 28, leadsCount: 80, color: "#173F32" },
    { source: "Client Referrals", percentage: 14, leadsCount: 40, color: "#C9A15B" },
    { source: "Travel Agents (GDS)", percentage: 10, leadsCount: 28, color: "#A8C3B2" },
    { source: "OTA Channels", percentage: 6, leadsCount: 17, color: "#6B766F" },
  ],

  recentLeads: [
    { id: "LD-504", companyName: "Accenture Tech Summit 2026", contactPoc: "Sunil Nair", industry: "Technology", priority: "HIGH", score: 540, status: "Quotation Sent", source: "Corporate B2B", createdAt: "10 mins ago" },
    { id: "LD-503", companyName: "Oberoi & Singhania Wedding", contactPoc: "Kavita Singhania", industry: "Events", priority: "URGENT", score: 580, status: "Negotiation", source: "Direct Web", createdAt: "42 mins ago" },
    { id: "LD-502", companyName: "Goldman Sachs India Offsite", contactPoc: "Meera Krishnan", industry: "Banking & Finance", priority: "HIGH", score: 510, status: "Qualified", source: "Referral", createdAt: "2 hours ago" },
    { id: "LD-501", companyName: "Novartis Pharma Council", contactPoc: "Dr. Rohan Kapoor", industry: "Healthcare", priority: "MEDIUM", score: 420, status: "Contacted", source: "GDS Agent", createdAt: "4 hours ago" },
    { id: "LD-500", companyName: "Amazon AWS Cloud Forum", contactPoc: "Amit Patel", industry: "Technology", priority: "HIGH", score: 560, status: "Confirmed Won", source: "Corporate B2B", createdAt: "1 day ago" },
  ],

  recentEnquiries: [
    { id: "ENQ-921", enquiryCode: "ENQ-2026-921", guestName: "Devendra Rathore", property: "Monday Heritage Palace, Jaipur", dates: "Nov 12 - Nov 16", roomsCount: 45, budget: "$48,000", status: "QUOTATION" },
    { id: "ENQ-920", enquiryCode: "ENQ-2026-920", guestName: "Sarah Jenkins", property: "Monday Beach Resort, Goa", dates: "Dec 20 - Dec 28", roomsCount: 12, budget: "$28,500", status: "QUALIFIED" },
    { id: "ENQ-919", enquiryCode: "ENQ-2026-919", guestName: "Vikram Malhotra", property: "Monday Luxury Suites, Mumbai", dates: "Oct 18 - Oct 20", roomsCount: 80, budget: "$95,000", status: "NEGOTIATION" },
    { id: "ENQ-918", enquiryCode: "ENQ-2026-918", guestName: "Claire Dupont", property: "Monday Grand Palace, Delhi", dates: "Jan 10 - Jan 14", roomsCount: 150, budget: "$180,000", status: "CONFIRMED" },
    { id: "ENQ-917", enquiryCode: "ENQ-2026-917", guestName: "Anish Kulkarni", property: "Monday Silicon Heights, Bengaluru", dates: "Nov 02 - Nov 05", roomsCount: 30, budget: "$32,000", status: "CONTACTED" },
  ],

  upcomingReservations: [
    { id: "RES-881", reservationCode: "RES-2026-881", guestName: "Deepak & Aarti Varma", property: "Monday Grand Palace", roomType: "Presidential Suite", checkInDate: "Today, 14:00", checkOutDate: "Sep 28", paymentStatus: "PAID", vipTier: "BLACK_DIAMOND" },
    { id: "RES-880", reservationCode: "RES-2026-880", guestName: "Microsoft Leadership Delegation", property: "Monday Silicon Heights", roomType: "Executive Suite (x15)", checkInDate: "Tomorrow", checkOutDate: "Oct 01", paymentStatus: "PAID", vipTier: "PLATINUM" },
    { id: "RES-879", reservationCode: "RES-2026-879", guestName: "Rohan & Natasha Sethi", property: "Monday Beach Resort", roomType: "Deluxe Ocean Villa", checkInDate: "Sep 27", checkOutDate: "Oct 02", paymentStatus: "PARTIAL", vipTier: "GOLD" },
    { id: "RES-878", reservationCode: "RES-2026-878", guestName: "KPMG Advisory Team", property: "Monday Luxury Suites", roomType: "Executive King (x20)", checkInDate: "Sep 29", checkOutDate: "Oct 04", paymentStatus: "PAID", vipTier: "PLATINUM" },
    { id: "RES-877", reservationCode: "RES-2026-877", guestName: "Lord Arthur Pendelton", property: "Monday Heritage Palace", roomType: "Heritage Royal Suite", checkInDate: "Oct 02", checkOutDate: "Oct 08", paymentStatus: "PENDING", vipTier: "BLACK_DIAMOND" },
  ],

  pendingTasks: [
    { id: "TSK-301", title: "Review TechCorp $185k Group Contract SLA", assignedTo: "Priya Sharma (Sales Mgr)", priority: "URGENT", dueDate: "Today, 18:00", status: "IN_PROGRESS" },
    { id: "TSK-302", title: "Confirm VIP Suite Airport Transfer for Lord Pendelton", assignedTo: "Ananya Deshmukh (Ops Mgr)", priority: "HIGH", dueDate: "Tomorrow, 10:00", status: "PENDING" },
    { id: "TSK-303", title: "Send Revised F&B Banquet Quote to Verma Wedding", assignedTo: "Rahul Verma (Sales Exec)", priority: "HIGH", dueDate: "Tomorrow, 14:00", status: "IN_PROGRESS" },
    { id: "TSK-304", title: "Conduct Monthly RevPAR Audit for Goa Property", assignedTo: "Vikramaditya Roy (Admin)", priority: "MEDIUM", dueDate: "Sep 28", status: "PENDING" },
    { id: "TSK-305", title: "Update Q4 Room Rate Matrix in Channel Manager", assignedTo: "Ops Team", priority: "MEDIUM", dueDate: "Sep 30", status: "PENDING" },
  ],

  recentActivities: [
    { id: "ACT-701", title: "Contract Proposal Sent ($240,000)", type: "EMAIL", performer: "Priya Sharma", timestamp: "12 mins ago", relatedEntity: "Verma & Kapoor Wedding" },
    { id: "ACT-702", title: "Site Visit Inspection Completed", type: "SITE_VISIT", performer: "Rahul Verma", timestamp: "1 hour ago", relatedEntity: "TechCorp Global Summit" },
    { id: "ACT-703", title: "Stage Moved: Qualified → Quotation", type: "STATUS_CHANGE", performer: "Rahul Verma", timestamp: "3 hours ago", relatedEntity: "Goldman Sachs Offsite" },
    { id: "ACT-704", title: "Executive Negotiation Call", type: "CALL", performer: "Vikramaditya Roy", timestamp: "5 hours ago", relatedEntity: "Apex Financial Retreat" },
    { id: "ACT-705", title: "Deposit Received ($50,000)", type: "NOTE", performer: "Ananya Deshmukh", timestamp: "1 day ago", relatedEntity: "Pharma Asia Council" },
  ],
};

// Async data fetch function simulating isolated database query with loading & error states
export async function getDashboardData(simulateError = false): Promise<FullDashboardData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error("Failed to fetch dashboard metrics from CRM database server."));
      } else {
        resolve(MOCK_DASHBOARD_DATA);
      }
    }, 600);
  });
}
