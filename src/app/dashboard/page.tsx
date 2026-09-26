"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  getDashboardData,
  FullDashboardData,
} from "@/lib/demo-data/dashboard-data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import {
  Users,
  Target,
  Briefcase,
  ClipboardList,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building2,
  ChevronRight,
  Sparkles,
  Filter,
  Download,
  Plus,
  PhoneCall,
  Mail,
  MapPin,
  CalendarDays,
  FileText
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [isEmptyState, setIsEmptyState] = useState<boolean>(false);

  const fetchData = async (shouldFail = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardData(shouldFail);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <PageHeader
          title="Enterprise CRM Overview"
          subtitle="Loading Executive Metrics & Revenue Intelligence..."
          breadcrumbs={[{ label: "Overview" }, { label: "Executive Dashboard" }]}
        />

        {/* KPI Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-[#E5E2D9] rounded-xl p-4 space-y-3">
              <div className="h-4 bg-[#F7F4EC] rounded w-1/2" />
              <div className="h-7 bg-[#F7F4EC] rounded w-3/4" />
              <div className="h-3 bg-[#F7F4EC] rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-white border border-[#E5E2D9] rounded-xl p-5" />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-[#C95C5C] rounded-2xl">
          <AlertCircle className="w-10 h-10 mx-auto" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-[#18332B]">Unable to Load Dashboard</h2>
          <p className="text-xs text-[#6B766F] mt-1">{error}</p>
        </div>
        <button
          onClick={() => fetchData(false)}
          className="flex items-center gap-2 bg-[#285943] hover:bg-[#173F32] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  // Toggle Empty State view for verification
  const kpis = isEmptyState ? null : data?.kpis;

  return (
    <div className="space-y-6 pb-12 font-sans text-[#18332B]">
      {/* Top Header & Context Controls */}
      <PageHeader
        title="Enterprise CRM Overview"
        subtitle="Monday Hotels Commercial Performance, Lead Pipeline & Guest Operations Summary"
        breadcrumbs={[{ label: "Overview" }, { label: "Executive Dashboard" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe selector */}
            <div className="bg-white border border-[#E5E2D9] rounded-lg p-1 flex items-center gap-1 shadow-sm">
              {["7d", "30d", "q3", "ytd"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium uppercase ${
                    timeframe === tf
                      ? "bg-[#285943] text-white font-bold shadow-sm"
                      : "text-[#6B766F] hover:text-[#18332B] hover:bg-[#F7F4EC]"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Empty State Toggle button for testing */}
            <button
              onClick={() => setIsEmptyState(!isEmptyState)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                isEmptyState
                  ? "bg-[#DDE9E1] text-[#173F32] border-[#A8C3B2]"
                  : "bg-white text-[#18332B] border-[#E5E2D9] hover:bg-[#F7F4EC]"
              }`}
            >
              {isEmptyState ? "Exit Empty State" : "Simulate Empty State"}
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchData(false)}
              className="p-2 bg-white border border-[#E5E2D9] hover:bg-[#F7F4EC] text-[#285943] rounded-lg transition-colors shadow-sm"
              title="Refresh Analytics Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => alert("Downloading PDF Brief...")}
              className="hidden sm:flex items-center gap-1.5 bg-[#C9A15B] hover:bg-[#b08b47] text-[#18332B] font-bold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Executive Brief</span>
            </button>
          </div>
        }
      />

      {/* Empty State Banner if toggled */}
      {isEmptyState && (
        <div className="bg-white border border-[#E5E2D9] rounded-xl p-8 text-center space-y-3 shadow-sm">
          <Building2 className="w-10 h-10 text-[#6B766F] mx-auto" />
          <h3 className="text-base font-bold text-[#18332B]">No Portfolio Data Available</h3>
          <p className="text-xs text-[#6B766F] max-w-sm mx-auto">
            Zero active records were found for the selected timeframe or filter. Connect Supabase database tables or populate demo data.
          </p>
          <button
            onClick={() => setIsEmptyState(false)}
            className="text-xs font-semibold text-[#285943] hover:underline"
          >
            Restore Demo Enterprise Dataset
          </button>
        </div>
      )}

      {/* 8 Requested KPI Metric Cards Grid */}
      {!isEmptyState && kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Total Leads */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Total Leads</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.totalLeads.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> {kpis.totalLeads.change}
                </span>
                <span className="text-[#6B766F]">{kpis.totalLeads.subtitle}</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Qualified Leads */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Qualified Leads</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.qualifiedLeads.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> {kpis.qualifiedLeads.change}
                </span>
                <span className="text-[#6B766F]">{kpis.qualifiedLeads.subtitle}</span>
              </div>
            </div>
          </div>

          {/* KPI 3: Active Opportunities */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Active Opportunities</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.activeOpportunities.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#C9A15B] font-semibold">{kpis.activeOpportunities.totalValue}</span>
              </div>
            </div>
          </div>

          {/* KPI 4: Booking Enquiries */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Booking Enquiries</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.bookingEnquiries.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold">{kpis.bookingEnquiries.slaPerformance}</span>
              </div>
            </div>
          </div>

          {/* KPI 5: Confirmed Reservations */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Confirmed Reservations</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.confirmedReservations.value.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold">{kpis.confirmedReservations.occupancyRate}</span>
              </div>
            </div>
          </div>

          {/* KPI 6: Revenue Pipeline */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Revenue Pipeline</span>
              <div className="p-1.5 bg-[#E9D7AE] text-[#18332B] rounded-lg">
                <DollarSign className="w-4 h-4 text-[#285943]" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.revenuePipeline.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> {kpis.revenuePipeline.change}
                </span>
                <span className="text-[#6B766F]">{kpis.revenuePipeline.subtitle}</span>
              </div>
            </div>
          </div>

          {/* KPI 7: Conversion Rate */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Enquiry Conversion Rate</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.conversionRate.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold">{kpis.conversionRate.change}</span>
                <span className="text-[#6B766F]">{kpis.conversionRate.subtitle}</span>
              </div>
            </div>
          </div>

          {/* KPI 8: Returning Guests */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 hover:border-[#285943]/40 transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#6B766F]">
              <span className="text-xs font-medium text-[#6B766F]">Returning Guests</span>
              <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-[#285943] tracking-tight">{kpis.returningGuests.value}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-[#2E8B57] font-semibold">{kpis.returningGuests.change}</span>
                <span className="text-[#6B766F]">{kpis.returningGuests.subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 Recharts Charts Section */}
      {!isEmptyState && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Lead Pipeline Stage Breakdown */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18332B]">1. Lead Pipeline Stage Breakdown</h3>
                <p className="text-xs text-[#6B766F]">Volume and value of deals moving through the sales pipeline</p>
              </div>
              <span className="text-xs font-bold text-[#173F32] bg-[#DDE9E1] px-2.5 py-1 rounded border border-[#A8C3B2]">
                284 Leads
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.leadPipelineStages} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                  <XAxis type="number" stroke="#6B766F" fontSize={11} />
                  <YAxis type="category" dataKey="stage" stroke="#18332B" fontSize={11} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#FFFEFA", borderColor: "#E5E2D9", borderRadius: "8px", fontSize: "12px", color: "#18332B" }}
                  />
                  <Bar dataKey="count" name="Active Deals" radius={[0, 4, 4, 0]}>
                    {data.leadPipelineStages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Booking Enquiry Conversion */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18332B]">2. Booking Enquiry Conversion</h3>
                <p className="text-xs text-[#6B766F]">Monthly inbound booking requests vs confirmed reservations</p>
              </div>
              <span className="text-xs font-bold text-[#285943] bg-[#DDE9E1] px-2.5 py-1 rounded border border-[#A8C3B2]">
                44.8% Conv Rate
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.enquiryConversion} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                  <XAxis dataKey="month" stroke="#6B766F" fontSize={11} />
                  <YAxis stroke="#6B766F" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#FFFEFA", borderColor: "#E5E2D9", borderRadius: "8px", fontSize: "12px", color: "#18332B" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="received" name="Received Enquiries" fill="#A8C3B2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" name="Converted Bookings" fill="#285943" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="rate" name="Conversion Rate %" stroke="#C9A15B" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Reservation Trends */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18332B]">3. Portfolio Reservation & Occupancy Trends</h3>
                <p className="text-xs text-[#6B766F]">Monthly room night volume and portfolio occupancy rate %</p>
              </div>
              <span className="text-xs font-bold text-[#173F32] bg-[#DDE9E1] px-2.5 py-1 rounded border border-[#A8C3B2]">
                85.4% Occupancy
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.reservationTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNights" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#285943" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#285943" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                  <XAxis dataKey="month" stroke="#6B766F" fontSize={11} />
                  <YAxis stroke="#6B766F" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#FFFEFA", borderColor: "#E5E2D9", borderRadius: "8px", fontSize: "12px", color: "#18332B" }}
                  />
                  <Area type="monotone" dataKey="roomNights" name="Total Room Nights" stroke="#285943" strokeWidth={2} fillOpacity={1} fill="url(#colorNights)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Revenue Pipeline */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18332B]">4. Revenue Realized vs Target Pipeline</h3>
                <p className="text-xs text-[#6B766F]">Monthly commercial revenue realization vs monthly target</p>
              </div>
              <span className="text-xs font-bold text-[#173F32] bg-[#E9D7AE] px-2.5 py-1 rounded border border-[#C9A15B]">
                $3.85M Pipeline
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenuePipeline} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                  <XAxis dataKey="month" stroke="#6B766F" fontSize={11} />
                  <YAxis stroke="#6B766F" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                  <RechartsTooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                    contentStyle={{ backgroundColor: "#FFFEFA", borderColor: "#E5E2D9", borderRadius: "8px", fontSize: "12px", color: "#18332B" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="realized" name="Realized Revenue ($)" fill="#285943" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pipeline" name="Active Pipeline ($)" fill="#C9A15B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Guest Retention & Loyalty */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18332B]">5. Guest Retention & Repeat Loyalty</h3>
                <p className="text-xs text-[#6B766F]">Proportion of repeat loyalty members vs first-time guest stays</p>
              </div>
              <span className="text-xs font-bold text-[#173F32] bg-[#DDE9E1] px-2.5 py-1 rounded border border-[#A8C3B2]">
                62.4% Repeat Rate
              </span>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.guestRetention}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="category"
                  >
                    {data.guestRetention.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#FFFEFA", borderColor: "#E5E2D9", borderRadius: "8px", fontSize: "12px", color: "#18332B" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 6: Lead Source Distribution */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#18332B]">6. Lead Source Distribution</h3>
                <p className="text-xs text-[#6B766F]">Lead origin across direct web, corporate MICE, referrals & OTAs</p>
              </div>
              <span className="text-xs font-bold text-[#285943] bg-[#DDE9E1] px-2.5 py-1 rounded border border-[#A8C3B2]">
                42% Direct Web
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.leadSources} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                  <XAxis dataKey="source" stroke="#6B766F" fontSize={10} interval={0} />
                  <YAxis stroke="#6B766F" fontSize={11} unit="%" />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#FFFEFA", borderColor: "#E5E2D9", borderRadius: "8px", fontSize: "12px", color: "#18332B" }}
                  />
                  <Bar dataKey="percentage" name="Share %" radius={[4, 4, 0, 0]}>
                    {data.leadSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 5 Requested Dashboard Detailed Sections */}
      {!isEmptyState && data && (
        <div className="space-y-6">
          {/* Grid Row 1: Recent Leads & Recent Booking Enquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Recent Leads */}
            <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
                <h3 className="text-base font-bold text-[#18332B] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#285943]" />
                  <span>Recent Sales Leads</span>
                </h3>
                <span className="text-xs text-[#285943] hover:underline cursor-pointer font-semibold">View All Leads →</span>
              </div>

              <div className="space-y-3">
                {data.recentLeads.map((lead) => (
                  <div key={lead.id} className="bg-[#F7F4EC] border border-[#E5E2D9] rounded-xl p-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#173F32] bg-[#DDE9E1] px-1.5 py-0.5 rounded border border-[#A8C3B2] font-bold">
                          {lead.id}
                        </span>
                        <h4 className="font-bold text-[#18332B]">{lead.companyName}</h4>
                      </div>
                      <p className="text-[#6B766F] text-[11px]">POC: {lead.contactPoc} • Source: {lead.source}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#E5E2D9] text-[#18332B]">
                        {lead.status}
                      </span>
                      <div className="text-[10px] text-[#6B766F]">{lead.createdAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Recent Booking Enquiries */}
            <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
                <h3 className="text-base font-bold text-[#18332B] flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#285943]" />
                  <span>Recent Booking Enquiries</span>
                </h3>
                <span className="text-xs text-[#285943] hover:underline cursor-pointer font-semibold">View Enquiries →</span>
              </div>

              <div className="space-y-3">
                {data.recentEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-[#F7F4EC] border border-[#E5E2D9] rounded-xl p-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#285943] bg-[#DDE9E1] px-1.5 py-0.5 rounded border border-[#A8C3B2] font-bold">
                          {enq.enquiryCode}
                        </span>
                        <h4 className="font-bold text-[#18332B]">{enq.guestName}</h4>
                      </div>
                      <p className="text-[#6B766F] text-[11px]">{enq.property} • {enq.dates}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-[#285943]">{enq.budget}</div>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#E5E2D9] text-[#18332B]">
                        {enq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Row 2: Upcoming Reservations & Pending Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 3: Upcoming Reservations */}
            <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
                <h3 className="text-base font-bold text-[#18332B] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#285943]" />
                  <span>Upcoming Reservations</span>
                </h3>
                <span className="text-xs text-[#285943] hover:underline cursor-pointer font-semibold">View All Reservations →</span>
              </div>

              <div className="space-y-3">
                {data.upcomingReservations.map((res) => (
                  <div key={res.id} className="bg-[#F7F4EC] border border-[#E5E2D9] rounded-xl p-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#285943] bg-[#DDE9E1] px-1.5 py-0.5 rounded border border-[#A8C3B2] font-bold">
                          {res.reservationCode}
                        </span>
                        <h4 className="font-bold text-[#18332B]">{res.guestName}</h4>
                      </div>
                      <p className="text-[#6B766F] text-[11px]">{res.property} • {res.roomType}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-[#18332B] font-semibold">{res.checkInDate}</div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        res.paymentStatus === "PAID" ? "bg-[#DDE9E1] text-[#173F32] border border-[#A8C3B2]" : "bg-[#E9D7AE] text-[#18332B] border border-[#C9A15B]"
                      }`}>
                        {res.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Pending Tasks */}
            <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
                <h3 className="text-base font-bold text-[#18332B] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A15B]" />
                  <span>Pending Tasks & Actions</span>
                </h3>
                <span className="text-xs text-[#285943] hover:underline cursor-pointer font-semibold">Manage Tasks →</span>
              </div>

              <div className="space-y-3">
                {data.pendingTasks.map((task) => (
                  <div key={task.id} className="bg-[#F7F4EC] border border-[#E5E2D9] rounded-xl p-3.5 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#18332B]">{task.title}</h4>
                      <p className="text-[#6B766F] text-[11px]">Assigned to: {task.assignedTo}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.priority === "URGENT" ? "bg-rose-100 text-[#C95C5C] border border-rose-200" : "bg-[#E9D7AE] text-[#18332B] border border-[#C9A15B]"
                      }`}>
                        {task.priority}
                      </span>
                      <div className="text-[10px] text-[#6B766F]">{task.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Recent Activities Timeline */}
          <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
              <h3 className="text-base font-bold text-[#18332B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A15B]" />
                <span>Recent System & Activity Timeline</span>
              </h3>
              <span className="text-xs text-[#285943] hover:underline cursor-pointer font-semibold">Full Activity Log →</span>
            </div>

            <div className="divide-y divide-[#E5E2D9]">
              {data.recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F7F4EC] rounded-lg border border-[#E5E2D9] text-[#285943]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-[#18332B]">{act.title}</p>
                      <p className="text-[11px] text-[#6B766F]">Performer: {act.performer} • Entity: {act.relatedEntity}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B766F] font-medium">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
