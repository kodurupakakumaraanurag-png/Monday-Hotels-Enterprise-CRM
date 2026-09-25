import { getLeads, CompleteLeadRecord } from "./lead-service";
import { getEnterpriseOpportunities, EnterpriseOpportunity } from "./opportunity-service";
import { getReservations, Reservation, getEnquiries, BookingEnquiry } from "./reservation-service";
import { calculateGuestIntelligence, CalculatedGuestIntelligence } from "./guest-retention-service";
import { getUsers, SystemUser } from "./user-service";

export type ReportTab =
  | "LEAD_PERFORMANCE"
  | "SALES_PIPELINE"
  | "BOOKING_CONVERSION"
  | "RESERVATION_PERFORMANCE"
  | "REVENUE"
  | "GUEST_RETENTION"
  | "PROPERTY_PERFORMANCE"
  | "SALES_EXEC_PERFORMANCE";

export interface AnalyticsFilterOptions {
  dateRange: "ALL" | "LAST_30_DAYS" | "LAST_90_DAYS" | "THIS_YEAR" | "Q3_2026";
  property: string; // "ALL" or specific property name
  leadSource: string; // "ALL" or specific lead source
  salesExecId: string; // "ALL" or specific user ID
  bookingSource: string; // "ALL" or specific booking source
  status: string; // "ALL" or specific status
}

export interface CSVRow {
  [key: string]: string | number;
}

/**
 * Filter data by common fields safely
 */
function isWithinDateRange(dateStr: string, range: AnalyticsFilterOptions["dateRange"]): boolean {
  if (range === "ALL") return true;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return true;

  const now = new Date("2026-09-25");
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

  if (range === "LAST_30_DAYS") return diffDays >= 0 && diffDays <= 30;
  if (range === "LAST_90_DAYS") return diffDays >= 0 && diffDays <= 90;
  if (range === "THIS_YEAR") return d.getFullYear() === 2026;
  if (range === "Q3_2026") return d.getFullYear() === 2026 && d.getMonth() >= 6 && d.getMonth() <= 8;

  return true;
}

/**
 * Lead Performance Report Data
 */
export function getLeadPerformanceAnalytics(filters: AnalyticsFilterOptions) {
  const allLeads = getLeads();

  const filteredLeads = allLeads.filter((l: CompleteLeadRecord) => {
    if (!isWithinDateRange(l.dateAdded || "2026-01-01", filters.dateRange)) return false;
    if (filters.property !== "ALL" && (l.targetProperty || l.placementOpportunity) !== filters.property) return false;
    if (filters.leadSource !== "ALL" && l.leadSource !== filters.leadSource) return false;
    if (filters.salesExecId !== "ALL" && l.assignedTo !== filters.salesExecId) return false;
    if (filters.status !== "ALL" && l.pipelineStatus !== filters.status) return false;
    return true;
  });

  const totalLeads = filteredLeads.length;
  const qualifiedCount = filteredLeads.filter((l: CompleteLeadRecord) =>
    ["QUALIFIED", "QUOTATION", "NEGOTIATION", "CONFIRMED"].includes(l.pipelineStatus)
  ).length;
  const wonCount = filteredLeads.filter((l: CompleteLeadRecord) => l.pipelineStatus === "CONFIRMED").length;
  const lostCount = filteredLeads.filter((l: CompleteLeadRecord) => l.pipelineStatus === "LOST").length;

  const qualificationRate = totalLeads > 0 ? ((qualifiedCount / totalLeads) * 100).toFixed(1) + "%" : "0.0%";
  const conversionRate = totalLeads > 0 ? ((wonCount / totalLeads) * 100).toFixed(1) + "%" : "0.0%";

  // Breakdown by Source
  const sourceMap = new Map<string, number>();
  filteredLeads.forEach((l: CompleteLeadRecord) => {
    const src = l.leadSource || "Unknown";
    sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
  });

  const sourceBreakdown = Array.from(sourceMap.entries()).map(([source, count]) => ({
    source,
    count,
    percentage: totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) + "%" : "0.0%",
  }));

  // Breakdown by Status
  const statusMap = new Map<string, number>();
  filteredLeads.forEach((l: CompleteLeadRecord) => {
    const st = l.pipelineStatus || "NEW";
    statusMap.set(st, (statusMap.get(st) || 0) + 1);
  });

  const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) + "%" : "0.0%",
  }));

  return {
    totalLeads,
    qualifiedCount,
    wonCount,
    lostCount,
    qualificationRate,
    conversionRate,
    sourceBreakdown,
    statusBreakdown,
    leads: filteredLeads,
  };
}

/**
 * Sales Pipeline Report Data
 */
export function getSalesPipelineAnalytics(filters: AnalyticsFilterOptions) {
  const allOpps = getEnterpriseOpportunities();

  const filteredOpps = allOpps.filter((o: EnterpriseOpportunity) => {
    if (!isWithinDateRange(o.createdAt || "2026-01-01", filters.dateRange)) return false;
    if (filters.salesExecId !== "ALL" && o.accountOwner !== filters.salesExecId) return false;
    if (filters.status !== "ALL" && o.stage !== filters.status) return false;
    return true;
  });

  const totalCount = filteredOpps.length;
  const totalPipelineValue = filteredOpps.reduce((acc: number, o: EnterpriseOpportunity) => acc + (o.opportunityValue || 0), 0);
  const weightedPipelineValue = filteredOpps.reduce(
    (acc: number, o: EnterpriseOpportunity) => acc + (o.opportunityValue || 0) * ((o.probability || 0) / 100),
    0
  );

  const wonOpps = filteredOpps.filter((o: EnterpriseOpportunity) => ["CONFIRMED", "COMPLETED"].includes(o.stage));
  const conversionRate = totalCount > 0 ? ((wonOpps.length / totalCount) * 100).toFixed(1) + "%" : "0.0%";
  const avgDealSize = totalCount > 0 ? Math.round(totalPipelineValue / totalCount) : 0;

  // Stages Breakdown (Funnel Data)
  const stagesList = ["NEW", "CONTACTED", "QUALIFIED", "QUOTATION", "NEGOTIATION", "CONFIRMED", "COMPLETED", "LOST"];
  const stageBreakdown = stagesList.map((st) => {
    const matching = filteredOpps.filter((o: EnterpriseOpportunity) => o.stage === st);
    const sumVal = matching.reduce((acc: number, o: EnterpriseOpportunity) => acc + (o.opportunityValue || 0), 0);
    return {
      stage: st,
      count: matching.length,
      value: sumVal,
      percentage: totalPipelineValue > 0 ? ((sumVal / totalPipelineValue) * 100).toFixed(1) + "%" : "0.0%",
    };
  });

  return {
    totalCount,
    totalPipelineValue,
    weightedPipelineValue,
    conversionRate,
    avgDealSize,
    stageBreakdown,
    opportunities: filteredOpps,
  };
}

/**
 * Booking Conversion Report Data
 */
export function getBookingConversionAnalytics(filters: AnalyticsFilterOptions) {
  const allEnquiries = getEnquiries();

  const filteredEnquiries = allEnquiries.filter((e: BookingEnquiry) => {
    if (!isWithinDateRange(e.createdAt || "2026-01-01", filters.dateRange)) return false;
    if (filters.property !== "ALL" && e.property !== filters.property) return false;
    if (filters.bookingSource !== "ALL" && e.source !== filters.bookingSource) return false;
    if (filters.salesExecId !== "ALL" && e.assignedStaff !== filters.salesExecId) return false;
    if (filters.status !== "ALL" && e.status !== filters.status) return false;
    return true;
  });

  const totalEnquiries = filteredEnquiries.length;
  const convertedEnquiries = filteredEnquiries.filter((e: BookingEnquiry) => e.status === "CONFIRMED" || e.status === "COMPLETED").length;
  const lostEnquiries = filteredEnquiries.filter((e: BookingEnquiry) => e.status === "LOST" || e.status === "CANCELLED").length;
  const pendingEnquiries = filteredEnquiries.filter((e: BookingEnquiry) => ["NEW", "CONTACTED", "QUALIFIED", "QUOTATION", "NEGOTIATION"].includes(e.status)).length;

  const conversionRate = totalEnquiries > 0 ? ((convertedEnquiries / totalEnquiries) * 100).toFixed(1) + "%" : "0.0%";

  // Property Breakdown
  const propMap = new Map<string, { total: number; converted: number }>();
  filteredEnquiries.forEach((e: BookingEnquiry) => {
    const p = e.property || "Unspecified";
    if (!propMap.has(p)) propMap.set(p, { total: 0, converted: 0 });
    const item = propMap.get(p)!;
    item.total += 1;
    if (e.status === "CONFIRMED" || e.status === "COMPLETED") item.converted += 1;
  });

  const propertyBreakdown = Array.from(propMap.entries()).map(([property, data]) => ({
    property,
    total: data.total,
    converted: data.converted,
    rate: data.total > 0 ? ((data.converted / data.total) * 100).toFixed(1) + "%" : "0.0%",
  }));

  return {
    totalEnquiries,
    convertedEnquiries,
    lostEnquiries,
    pendingEnquiries,
    conversionRate,
    propertyBreakdown,
    enquiries: filteredEnquiries,
  };
}

/**
 * Reservation Performance Report Data
 */
export function getReservationPerformanceAnalytics(filters: AnalyticsFilterOptions) {
  const allRes = getReservations();

  const filteredRes = allRes.filter((r: Reservation) => {
    if (!isWithinDateRange(r.checkIn || "2026-01-01", filters.dateRange)) return false;
    if (filters.property !== "ALL" && r.property !== filters.property) return false;
    if (filters.bookingSource !== "ALL" && r.bookingSource !== filters.bookingSource) return false;
    if (filters.status !== "ALL" && r.reservationStatus !== filters.status) return false;
    return true;
  });

  const totalReservations = filteredRes.length;
  const totalRevenue = filteredRes.reduce((acc: number, r: Reservation) => acc + (r.totalAmount || 0), 0);
  const totalRoomNights = filteredRes.reduce((acc: number, r: Reservation) => {
    const checkIn = new Date(r.checkIn).getTime();
    const checkOut = new Date(r.checkOut).getTime();
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    return acc + nights;
  }, 0);

  const adr = totalRoomNights > 0 ? Math.round(totalRevenue / totalRoomNights) : 0;
  const revPar = Math.round(adr * 0.78);
  const cancelledCount = filteredRes.filter((r: Reservation) => r.reservationStatus === "CANCELLED").length;
  const cancellationRate = totalReservations > 0 ? ((cancelledCount / totalReservations) * 100).toFixed(1) + "%" : "0.0%";
  const estOccupancyRate = "78.4%";

  // Breakdown by Status
  const statusMap = new Map<string, number>();
  filteredRes.forEach((r: Reservation) => {
    const st = r.reservationStatus || "CONFIRMED";
    statusMap.set(st, (statusMap.get(st) || 0) + 1);
  });

  const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: totalReservations > 0 ? ((count / totalReservations) * 100).toFixed(1) + "%" : "0.0%",
  }));

  return {
    totalReservations,
    totalRevenue,
    totalRoomNights,
    totalNights: totalRoomNights,
    adr,
    revPar,
    cancellationRate,
    estOccupancyRate,
    statusBreakdown,
    reservations: filteredRes,
  };
}

/**
 * Revenue Report Data
 */
export function getRevenueAnalytics(filters: AnalyticsFilterOptions) {
  const allRes = getReservations();

  const filteredRes = allRes.filter((r: Reservation) => {
    if (!isWithinDateRange(r.checkIn || "2026-01-01", filters.dateRange)) return false;
    if (filters.property !== "ALL" && r.property !== filters.property) return false;
    if (filters.bookingSource !== "ALL" && r.bookingSource !== filters.bookingSource) return false;
    return true;
  });

  const grossRevenue = filteredRes.reduce((acc: number, r: Reservation) => acc + (r.totalAmount || 0), 0);
  const cancelledAmount = filteredRes
    .filter((r: Reservation) => r.reservationStatus === "CANCELLED")
    .reduce((acc: number, r: Reservation) => acc + (r.totalAmount || 0), 0);
  const netRevenue = grossRevenue - cancelledAmount;

  // Revenue by Property
  const propRevMap = new Map<string, number>();
  filteredRes.forEach((r: Reservation) => {
    if (r.reservationStatus !== "CANCELLED") {
      const p = r.property || "Unknown Property";
      propRevMap.set(p, (propRevMap.get(p) || 0) + (r.totalAmount || 0));
    }
  });

  const propertyRevenue = Array.from(propRevMap.entries()).map(([property, sum]) => ({
    property,
    revenue: sum,
    percentage: netRevenue > 0 ? ((sum / netRevenue) * 100).toFixed(1) + "%" : "0.0%",
  }));

  // Revenue by Source
  const sourceRevMap = new Map<string, number>();
  filteredRes.forEach((r: Reservation) => {
    if (r.reservationStatus !== "CANCELLED") {
      const src = r.bookingSource || "Direct";
      sourceRevMap.set(src, (sourceRevMap.get(src) || 0) + (r.totalAmount || 0));
    }
  });

  const sourceRevenue = Array.from(sourceRevMap.entries()).map(([source, sum]) => ({
    source,
    revenue: sum,
    percentage: netRevenue > 0 ? ((sum / netRevenue) * 100).toFixed(1) + "%" : "0.0%",
  }));

  return {
    grossRevenue,
    cancelledAmount,
    netRevenue,
    propertyRevenue,
    sourceRevenue,
  };
}

/**
 * Property Performance Report Data
 */
export function getPropertyPerformanceAnalytics(filters: AnalyticsFilterOptions) {
  const allRes = getReservations();
  const allEnquiries = getEnquiries();
  const allLeads = getLeads();

  const propertiesList = [
    "Monday Hotels Grand Royale Mumbai",
    "Monday Hotels Resort & Spa Goa",
    "Monday Hotels Palace Udaipur",
    "Monday Hotels Suites Bengaluru",
    "Monday Hotels Heritage Delhi",
  ];

  const propertyMetrics = propertiesList.map((propName) => {
    const propRes = allRes.filter(
      (r: Reservation) => r.property === propName && isWithinDateRange(r.checkIn, filters.dateRange)
    );
    const propEnq = allEnquiries.filter(
      (e: BookingEnquiry) => e.property === propName && isWithinDateRange(e.createdAt, filters.dateRange)
    );
    const propLd = allLeads.filter(
      (l: CompleteLeadRecord) => (l.targetProperty || l.placementOpportunity) === propName && isWithinDateRange(l.dateAdded || "2026-01-01", filters.dateRange)
    );

    const totalRes = propRes.length;
    let nights = 0;
    let rev = 0;

    propRes.forEach((r: Reservation) => {
      if (r.reservationStatus !== "CANCELLED") {
        rev += r.totalAmount || 0;
        const checkIn = new Date(r.checkIn).getTime();
        const checkOut = new Date(r.checkOut).getTime();
        nights += Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
      }
    });

    const adr = nights > 0 ? Math.round(rev / nights) : 0;
    const revpar = Math.round(adr * 0.78);

    return {
      propertyName: propName,
      leadCount: propLd.length,
      enquiryCount: propEnq.length,
      reservationCount: totalRes,
      roomNights: nights,
      revenue: rev,
      adr,
      revpar,
    };
  });

  return propertyMetrics;
}

/**
 * Sales Executive Performance Data
 */
export function getSalesExecutiveAnalytics(filters: AnalyticsFilterOptions) {
  const users = getUsers();
  const leads = getLeads();
  const opps = getEnterpriseOpportunities();

  const execList = users.map((u: SystemUser) => {
    const userLeads = leads.filter(
      (l: CompleteLeadRecord) => l.assignedTo === u.id && isWithinDateRange(l.dateAdded || "2026-01-01", filters.dateRange)
    );
    const userOpps = opps.filter(
      (o: EnterpriseOpportunity) => o.accountOwner === u.fullName && isWithinDateRange(o.createdAt, filters.dateRange)
    );

    const totalLeads = userLeads.length;
    const totalOpps = userOpps.length;
    const wonOpps = userOpps.filter((o: EnterpriseOpportunity) => ["CONFIRMED", "COMPLETED"].includes(o.stage));
    const winRate = totalOpps > 0 ? ((wonOpps.length / totalOpps) * 100).toFixed(1) + "%" : "0.0%";

    const closedRevenue = wonOpps.reduce((acc: number, o: EnterpriseOpportunity) => acc + (o.opportunityValue || 0), 0);
    const weightedPipeline = userOpps.reduce(
      (acc: number, o: EnterpriseOpportunity) => acc + (o.opportunityValue || 0) * ((o.probability || 0) / 100),
      0
    );

    return {
      userId: u.id,
      name: u.fullName,
      role: u.role,
      email: u.email,
      totalLeads,
      totalOpps,
      wonDeals: wonOpps.length,
      winRate,
      closedRevenue,
      weightedPipeline,
    };
  });

  return execList;
}

/**
 * Utility to export JavaScript objects to CSV file
 */
export function exportToCSV(filename: string, rows: CSVRow[]) {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(",")];

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : "";
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvLines.push(values.join(","));
  });

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
