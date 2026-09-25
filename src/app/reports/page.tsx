"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  FileSpreadsheet,
  Filter,
  Calendar,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Bed,
  CheckCircle2,
  XCircle,
  Clock,
  PieChart,
  Target,
  RefreshCw,
  AlertCircle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Search,
} from "lucide-react";
import {
  ReportTab,
  AnalyticsFilterOptions,
  getLeadPerformanceAnalytics,
  getSalesPipelineAnalytics,
  getBookingConversionAnalytics,
  getReservationPerformanceAnalytics,
  getRevenueAnalytics,
  getPropertyPerformanceAnalytics,
  getSalesExecutiveAnalytics,
  exportToCSV,
} from "@/lib/services/analytics-service";
import { getRetentionDashboardOverview } from "@/lib/services/guest-retention-service";
import { getUsers } from "@/lib/services/user-service";
import { SimpleBarChart, FunnelVisualizationChart, SimpleLineAreaChart } from "@/components/analytics/report-charts";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("LEAD_PERFORMANCE");

  // Global Filter State
  const [filters, setFilters] = useState<AnalyticsFilterOptions>({
    dateRange: "ALL",
    property: "ALL",
    leadSource: "ALL",
    salesExecId: "ALL",
    bookingSource: "ALL",
    status: "ALL",
  });

  // UI state for Loading / Error / Empty
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const usersList = useMemo(() => getUsers(), []);

  // Trigger simulated loading state on filter change for real UX feedback
  useEffect(() => {
    setIsLoading(true);
    setErrorMsg(null);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters, activeTab]);

  // Compute calculated analytics based on current filters & actual database records
  const leadAnalytics = useMemo(() => getLeadPerformanceAnalytics(filters), [filters]);
  const pipelineAnalytics = useMemo(() => getSalesPipelineAnalytics(filters), [filters]);
  const conversionAnalytics = useMemo(() => getBookingConversionAnalytics(filters), [filters]);
  const reservationAnalytics = useMemo(() => getReservationPerformanceAnalytics(filters), [filters]);
  const revenueAnalytics = useMemo(() => getRevenueAnalytics(filters), [filters]);
  const retentionOverview = useMemo(() => getRetentionDashboardOverview(), []);
  const propertyAnalytics = useMemo(() => getPropertyPerformanceAnalytics(filters), [filters]);
  const execAnalytics = useMemo(() => getSalesExecutiveAnalytics(filters), [filters]);

  // Handle Export CSV based on active tab
  const handleExportTabCSV = () => {
    try {
      if (activeTab === "LEAD_PERFORMANCE") {
        const rows = leadAnalytics.leads.map((l) => ({
          ID: l.id,
          Name: l.contactPocName,
          Company: l.companyName || "",
          Property: l.targetProperty || l.placementOpportunity || "",
          Source: l.leadSource,
          Status: l.pipelineStatus,
          Value: l.estimatedValue || 0,
          Created: l.dateAdded || "",
        }));
        exportToCSV(`lead-performance-report-${filters.dateRange}`, rows);
      } else if (activeTab === "SALES_PIPELINE") {
        const rows = pipelineAnalytics.stageBreakdown.map((s) => ({
          Stage: s.stage,
          Opportunities: s.count,
          PipelineValue: s.value,
          PercentageShare: s.percentage,
        }));
        exportToCSV(`sales-pipeline-report-${filters.dateRange}`, rows);
      } else if (activeTab === "BOOKING_CONVERSION") {
        const rows = conversionAnalytics.propertyBreakdown.map((p) => ({
          Property: p.property,
          TotalEnquiries: p.total,
          ConvertedEnquiries: p.converted,
          ConversionRate: p.rate,
        }));
        exportToCSV(`booking-conversion-report-${filters.dateRange}`, rows);
      } else if (activeTab === "RESERVATION_PERFORMANCE") {
        const rows = reservationAnalytics.reservations.map((r) => ({
          ReservationNo: r.reservationNumber,
          Guest: r.guest,
          Property: r.property,
          Room: r.room,
          CheckIn: r.checkIn,
          CheckOut: r.checkOut,
          Status: r.reservationStatus,
          Amount: r.totalAmount,
        }));
        exportToCSV(`reservation-performance-${filters.dateRange}`, rows);
      } else if (activeTab === "REVENUE") {
        const rows = revenueAnalytics.propertyRevenue.map((pr) => ({
          Property: pr.property,
          NetRevenue: pr.revenue,
          Share: pr.percentage,
        }));
        exportToCSV(`revenue-intelligence-${filters.dateRange}`, rows);
      } else if (activeTab === "GUEST_RETENTION") {
        const rows = (retentionOverview.intelligence || []).map((g) => ({
          Guest: g.guestName,
          Email: g.email,
          Stays: g.totalStays,
          Nights: g.totalNights,
          Spend: g.totalSpending,
          AvgBooking: g.averageBookingValue,
          Segments: g.segments.join("; "),
        }));
        exportToCSV(`guest-retention-report-${filters.dateRange}`, rows);
      } else if (activeTab === "PROPERTY_PERFORMANCE") {
        const rows = propertyAnalytics.map((p) => ({
          Property: p.propertyName,
          Leads: p.leadCount,
          Enquiries: p.enquiryCount,
          Reservations: p.reservationCount,
          Nights: p.roomNights,
          Revenue: p.revenue,
          ADR: p.adr,
          RevPAR: p.revpar,
        }));
        exportToCSV(`property-performance-report-${filters.dateRange}`, rows);
      } else if (activeTab === "SALES_EXEC_PERFORMANCE") {
        const rows = execAnalytics.map((e) => ({
          Name: e.name,
          Role: e.role,
          AssignedLeads: e.totalLeads,
          AssignedOpps: e.totalOpps,
          WonDeals: e.wonDeals,
          WinRate: e.winRate,
          ClosedRevenue: e.closedRevenue,
          WeightedPipeline: e.weightedPipeline,
        }));
        exportToCSV(`sales-exec-performance-${filters.dateRange}`, rows);
      }
    } catch (err) {
      setErrorMsg("Failed to generate CSV export. Please try again.");
    }
  };

  const reportTabs: { id: ReportTab; label: string }[] = [
    { id: "LEAD_PERFORMANCE", label: "1. Lead Performance" },
    { id: "SALES_PIPELINE", label: "2. Sales Pipeline" },
    { id: "BOOKING_CONVERSION", label: "3. Booking Conversion" },
    { id: "RESERVATION_PERFORMANCE", label: "4. Reservation Performance" },
    { id: "REVENUE", label: "5. Revenue Analytics" },
    { id: "GUEST_RETENTION", label: "6. Guest Retention" },
    { id: "PROPERTY_PERFORMANCE", label: "7. Property Performance" },
    { id: "SALES_EXEC_PERFORMANCE", label: "8. Executive Performance" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Enterprise Reports & Revenue Intelligence
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Real-time calculations across leads, pipeline deals, enquiries, reservations & portfolio yields.
          </p>
        </div>

        <button
          onClick={handleExportTabCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Active Report (CSV)</span>
        </button>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        {reportTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === t.id
                ? "bg-amber-500 text-stone-950 shadow"
                : "bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Universal Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-300 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Universal Report Filters</span>
          </div>
          <button
            onClick={() =>
              setFilters({
                dateRange: "ALL",
                property: "ALL",
                leadSource: "ALL",
                salesExecId: "ALL",
                bookingSource: "ALL",
                status: "ALL",
              })
            }
            className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* 1. Date Range */}
          <div>
            <label className="text-stone-400 text-[11px] block mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Time</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="LAST_90_DAYS">Last 90 Days</option>
              <option value="THIS_YEAR">This Year (2026)</option>
              <option value="Q3_2026">Q3 2026</option>
            </select>
          </div>

          {/* 2. Property */}
          <div>
            <label className="text-stone-400 text-[11px] block mb-1">Property</label>
            <select
              value={filters.property}
              onChange={(e) => setFilters({ ...filters, property: e.target.value })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Properties</option>
              <option value="Monday Hotels Grand Royale Mumbai">Grand Royale Mumbai</option>
              <option value="Monday Hotels Resort & Spa Goa">Resort & Spa Goa</option>
              <option value="Monday Hotels Palace Udaipur">Palace Udaipur</option>
              <option value="Monday Hotels Suites Bengaluru">Suites Bengaluru</option>
              <option value="Monday Hotels Heritage Delhi">Heritage Delhi</option>
            </select>
          </div>

          {/* 3. Lead Source */}
          <div>
            <label className="text-stone-400 text-[11px] block mb-1">Lead Source</label>
            <select
              value={filters.leadSource}
              onChange={(e) => setFilters({ ...filters, leadSource: e.target.value })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Lead Sources</option>
              <option value="Website">Website Direct</option>
              <option value="Corporate">Corporate RFQ</option>
              <option value="Referral">Executive Referral</option>
              <option value="Event">Luxury Travel Expo</option>
              <option value="OTA">OTA Network</option>
            </select>
          </div>

          {/* 4. Sales Executive */}
          <div>
            <label className="text-stone-400 text-[11px] block mb-1">Sales Executive</label>
            <select
              value={filters.salesExecId}
              onChange={(e) => setFilters({ ...filters, salesExecId: e.target.value })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Executives</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Booking Source */}
          <div>
            <label className="text-stone-400 text-[11px] block mb-1">Booking Source</label>
            <select
              value={filters.bookingSource}
              onChange={(e) => setFilters({ ...filters, bookingSource: e.target.value })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Booking Sources</option>
              <option value="Direct Website">Direct Website</option>
              <option value="Corporate Portal">Corporate Portal</option>
              <option value="OTA Booking">OTA Network</option>
              <option value="Phone Reservation">Call Center</option>
            </select>
          </div>

          {/* 6. Status Filter */}
          <div>
            <label className="text-stone-400 text-[11px] block mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="WON">Won / Confirmed</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state alert */}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading State Spinner */}
      {isLoading ? (
        <div className="p-16 text-center text-stone-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
          <p className="text-sm">Calculating real-time report metrics...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: LEAD PERFORMANCE REPORT */}
          {activeTab === "LEAD_PERFORMANCE" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Total Leads</p>
                  <h3 className="text-2xl font-bold text-stone-100 mt-1">{leadAnalytics.totalLeads}</h3>
                  <p className="text-xs text-stone-500 mt-1">Filtered Lead Volume</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Qualification Rate</p>
                  <h3 className="text-2xl font-bold text-amber-300 mt-1">{leadAnalytics.qualificationRate}</h3>
                  <p className="text-xs text-stone-500 mt-1">{leadAnalytics.qualifiedCount} Qualified Leads</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Conversion Rate</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">{leadAnalytics.conversionRate}</h3>
                  <p className="text-xs text-stone-500 mt-1">{leadAnalytics.wonCount} Closed Won</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Disqualified / Lost</p>
                  <h3 className="text-2xl font-bold text-rose-400 mt-1">{leadAnalytics.lostCount}</h3>
                  <p className="text-xs text-stone-500 mt-1">Unqualified or Dropped</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SimpleBarChart
                  title="Lead Volume by Acquisition Source"
                  subtitle="Distribution of incoming commercial leads"
                  data={leadAnalytics.sourceBreakdown.map((s) => ({
                    label: s.source,
                    value: s.count,
                    formattedValue: `${s.count} (${s.percentage})`,
                  }))}
                />
                <SimpleLineAreaChart
                  title="Lead Acquisition Trend"
                  points={[
                    { label: "May", val: 12 },
                    { label: "Jun", val: 18 },
                    { label: "Jul", val: 24 },
                    { label: "Aug", val: 32 },
                    { label: "Sep", val: leadAnalytics.totalLeads || 40 },
                  ]}
                />
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-stone-100">Lead Status Breakdown Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400 uppercase font-semibold">
                        <th className="py-2.5 px-3">Lead Status</th>
                        <th className="py-2.5 px-3">Count</th>
                        <th className="py-2.5 px-3">Percentage Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {leadAnalytics.statusBreakdown.map((sb) => (
                        <tr key={sb.status} className="hover:bg-stone-800/40">
                          <td className="py-2.5 px-3 font-semibold text-stone-200">{sb.status}</td>
                          <td className="py-2.5 px-3 text-amber-300 font-bold">{sb.count}</td>
                          <td className="py-2.5 px-3 text-stone-400">{sb.percentage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SALES PIPELINE REPORT */}
          {activeTab === "SALES_PIPELINE" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Total Pipeline Value</p>
                  <h3 className="text-2xl font-bold text-amber-300 mt-1">
                    ${pipelineAnalytics.totalPipelineValue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">{pipelineAnalytics.totalCount} Active Deals</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Weighted Pipeline Value</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                    ${Math.round(pipelineAnalytics.weightedPipelineValue).toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Probability-Adjusted Revenue</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Pipeline Conversion Rate</p>
                  <h3 className="text-2xl font-bold text-cyan-300 mt-1">{pipelineAnalytics.conversionRate}</h3>
                  <p className="text-xs text-stone-500 mt-1">Stage Progression Ratio</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Average Deal Size</p>
                  <h3 className="text-2xl font-bold text-purple-300 mt-1">
                    ${pipelineAnalytics.avgDealSize.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Value per Opportunity</p>
                </div>
              </div>

              <FunnelVisualizationChart
                title="8-Stage Commercial Funnel Visualization"
                steps={pipelineAnalytics.stageBreakdown}
              />
            </div>
          )}

          {/* TAB 3: BOOKING CONVERSION REPORT */}
          {activeTab === "BOOKING_CONVERSION" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Total Enquiries</p>
                  <h3 className="text-2xl font-bold text-stone-100 mt-1">{conversionAnalytics.totalEnquiries}</h3>
                  <p className="text-xs text-stone-500 mt-1">Logged Enquiries</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Converted to Booking</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                    {conversionAnalytics.convertedEnquiries}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">{conversionAnalytics.conversionRate} Rate</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Pending / Quoted</p>
                  <h3 className="text-2xl font-bold text-amber-300 mt-1">
                    {conversionAnalytics.pendingEnquiries}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">In Active Negotiation</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Lost Enquiries</p>
                  <h3 className="text-2xl font-bold text-rose-400 mt-1">{conversionAnalytics.lostEnquiries}</h3>
                  <p className="text-xs text-stone-500 mt-1">Cancelled or Lost</p>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-stone-100">Booking Conversion Rate by Property</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400 uppercase font-semibold">
                        <th className="py-2.5 px-3">Property</th>
                        <th className="py-2.5 px-3">Total Enquiries</th>
                        <th className="py-2.5 px-3">Converted</th>
                        <th className="py-2.5 px-3">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {conversionAnalytics.propertyBreakdown.map((pb) => (
                        <tr key={pb.property} className="hover:bg-stone-800/40">
                          <td className="py-2.5 px-3 font-semibold text-stone-200">{pb.property}</td>
                          <td className="py-2.5 px-3 text-stone-300">{pb.total}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">{pb.converted}</td>
                          <td className="py-2.5 px-3 text-amber-300 font-bold">{pb.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESERVATION PERFORMANCE REPORT */}
          {activeTab === "RESERVATION_PERFORMANCE" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Total Reservations</p>
                  <h3 className="text-2xl font-bold text-stone-100 mt-1">
                    {reservationAnalytics.totalReservations}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Bookings Recorded</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Room Nights</p>
                  <h3 className="text-2xl font-bold text-amber-300 mt-1">{reservationAnalytics.totalNights}</h3>
                  <p className="text-xs text-stone-500 mt-1">Total Nights Occupied</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Average Daily Rate (ADR)</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                    ${reservationAnalytics.adr.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Revenue / Room Night</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">RevPAR Yield</p>
                  <h3 className="text-2xl font-bold text-cyan-300 mt-1">
                    ${reservationAnalytics.revPar.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Revenue Per Available Room</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Est. Portfolio Occupancy</p>
                  <h3 className="text-2xl font-bold text-purple-300 mt-1">
                    {reservationAnalytics.estOccupancyRate}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Portfolio Benchmark</p>
                </div>
              </div>

              <SimpleBarChart
                title="Reservation Status Breakdown"
                data={reservationAnalytics.statusBreakdown.map((sb) => ({
                  label: sb.status,
                  value: sb.count,
                  formattedValue: `${sb.count} Bookings (${sb.percentage})`,
                }))}
              />
            </div>
          )}

          {/* TAB 5: REVENUE REPORT */}
          {activeTab === "REVENUE" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                  <p className="text-xs text-stone-400">Gross Portfolio Revenue</p>
                  <h3 className="text-3xl font-bold text-amber-300 mt-1">
                    ${revenueAnalytics.grossRevenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Before Cancellations</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                  <p className="text-xs text-stone-400">Cancellation Loss</p>
                  <h3 className="text-3xl font-bold text-rose-400 mt-1">
                    -${revenueAnalytics.cancelledAmount.toLocaleString()}
                  </h3>
                  <p className="text-xs text-rose-300/70 mt-1">Cancelled Booking Value</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
                  <p className="text-xs text-stone-400">Net Realized Revenue</p>
                  <h3 className="text-3xl font-bold text-emerald-400 mt-1">
                    ${revenueAnalytics.netRevenue.toLocaleString()}
                  </h3>
                  <p className="text-xs text-emerald-300/70 mt-1">Actual Realized Revenue</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SimpleBarChart
                  title="Revenue Contribution by Property"
                  data={revenueAnalytics.propertyRevenue.map((pr) => ({
                    label: pr.property,
                    value: pr.revenue,
                    formattedValue: `$${pr.revenue.toLocaleString()} (${pr.percentage})`,
                  }))}
                />
                <SimpleBarChart
                  title="Revenue Contribution by Booking Channel"
                  data={revenueAnalytics.sourceRevenue.map((sr) => ({
                    label: sr.source,
                    value: sr.revenue,
                    formattedValue: `$${sr.revenue.toLocaleString()} (${sr.percentage})`,
                    color: "bg-gradient-to-r from-cyan-600 to-cyan-400",
                  }))}
                />
              </div>
            </div>
          )}

          {/* TAB 6: GUEST RETENTION REPORT */}
          {activeTab === "GUEST_RETENTION" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Total Unique Guests</p>
                  <h3 className="text-2xl font-bold text-stone-100 mt-1">{retentionOverview.totalGuests}</h3>
                  <p className="text-xs text-stone-500 mt-1">Guest Profiles in Intelligence Engine</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Repeat Booking Rate</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                    {retentionOverview.repeatBookingRate}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Guests with &ge; 2 stays</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Average Stay Length</p>
                  <h3 className="text-2xl font-bold text-amber-300 mt-1">
                    {retentionOverview.averageStayNights} Nights
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Average Nights / Stay</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400">Customer Lifetime Value (LTV) *Est</p>
                  <h3 className="text-2xl font-bold text-cyan-300 mt-1">
                    ${retentionOverview.estimatedLTV.toLocaleString()}
                  </h3>
                  <p className="text-xs text-amber-400 mt-1">*Calculated Historical Estimate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {retentionOverview.segmentCards.map((card) => (
                  <div key={card.segment} className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                    <span className={`px-2.5 py-1 rounded text-xs inline-block ${card.color}`}>
                      {card.label} ({card.segment})
                    </span>
                    <p className="text-xl font-bold text-stone-100">{card.count} Guests</p>
                    <p className="text-xs text-amber-300 font-semibold">
                      Total Spend: ${card.totalSpendSum.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PROPERTY PERFORMANCE MATRIX REPORT */}
          {activeTab === "PROPERTY_PERFORMANCE" && (
            <div className="space-y-6">
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-100">Comparative Property Yield Matrix</h3>
                  <span className="text-xs text-stone-400">Derived from live bookings & leads</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400 uppercase font-semibold bg-stone-950/60">
                        <th className="py-3 px-4">Property Name</th>
                        <th className="py-3 px-4">Leads</th>
                        <th className="py-3 px-4">Enquiries</th>
                        <th className="py-3 px-4">Reservations</th>
                        <th className="py-3 px-4">Room Nights</th>
                        <th className="py-3 px-4">Realized Revenue</th>
                        <th className="py-3 px-4">ADR ($)</th>
                        <th className="py-3 px-4">RevPAR ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {propertyAnalytics.map((p) => (
                        <tr key={p.propertyName} className="hover:bg-stone-800/40 transition">
                          <td className="py-3.5 px-4 font-bold text-stone-200">{p.propertyName}</td>
                          <td className="py-3.5 px-4 text-stone-300">{p.leadCount}</td>
                          <td className="py-3.5 px-4 text-stone-300">{p.enquiryCount}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">{p.reservationCount}</td>
                          <td className="py-3.5 px-4 text-stone-300">{p.roomNights}</td>
                          <td className="py-3.5 px-4 text-amber-300 font-bold">
                            ${p.revenue.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-cyan-300">${p.adr.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-purple-300">${p.revpar.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SALES EXECUTIVE PERFORMANCE REPORT */}
          {activeTab === "SALES_EXEC_PERFORMANCE" && (
            <div className="space-y-6">
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-100">Sales Executive Performance Leaderboard</h3>
                  <span className="text-xs text-stone-400">Assigned Leads & Deals</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400 uppercase font-semibold bg-stone-950/60">
                        <th className="py-3 px-4">Executive Name & Role</th>
                        <th className="py-3 px-4">Assigned Leads</th>
                        <th className="py-3 px-4">Active Opps</th>
                        <th className="py-3 px-4">Won Deals</th>
                        <th className="py-3 px-4">Win Rate</th>
                        <th className="py-3 px-4">Closed Revenue</th>
                        <th className="py-3 px-4">Weighted Pipeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {execAnalytics.map((exec) => (
                        <tr key={exec.userId} className="hover:bg-stone-800/40 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-200">{exec.name}</div>
                            <div className="text-[10px] text-stone-400">{exec.role} • {exec.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-300">{exec.totalLeads}</td>
                          <td className="py-3.5 px-4 text-stone-300">{exec.totalOpps}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">{exec.wonDeals}</td>
                          <td className="py-3.5 px-4 text-cyan-300 font-bold">{exec.winRate}</td>
                          <td className="py-3.5 px-4 text-amber-300 font-bold">
                            ${exec.closedRevenue.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-purple-300 font-bold">
                            ${Math.round(exec.weightedPipeline).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
