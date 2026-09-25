"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowUpRight,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Bed,
  ShieldCheck,
  Eye,
  RefreshCw,
  HelpCircle,
  Send,
  CheckCircle2,
  ChevronRight,
  Clock,
  Building2,
  Info,
} from "lucide-react";
import {
  getRetentionDashboardOverview,
  CalculatedGuestIntelligence,
  CustomerSegment,
  SEGMENT_RULES_DOCUMENTATION,
} from "@/lib/services/guest-retention-service";
import { GuestRetentionDetailModal } from "@/components/guests/guest-retention-detail-modal";

export default function GuestRetentionPage() {
  const overview = useMemo(() => getRetentionDashboardOverview(), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<CustomerSegment | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"spend" | "stays" | "inactive">("spend");
  const [activeTab, setActiveTab] = useState<"ALL_GUESTS" | "AT_RISK_LIST">("ALL_GUESTS");

  // Selected Guest for Detail Analytics Modal
  const [selectedGuestIntel, setSelectedGuestIntel] = useState<CalculatedGuestIntelligence | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Outreach notification states
  const [sentAlerts, setSentAlerts] = useState<Record<string, boolean>>({});

  const handleTriggerOutreach = (id: string) => {
    setSentAlerts((prev) => ({ ...prev, [id]: true }));
  };

  const handleViewDetail = (intel: CalculatedGuestIntelligence) => {
    setSelectedGuestIntel(intel);
    setIsDetailModalOpen(true);
  };

  // Filter & Sort Guest Intelligence
  const filteredGuests = useMemo(() => {
    const list = overview.intelligence || [];
    return list
      .filter((g) => {
        if (activeTab === "AT_RISK_LIST" && !g.segments.includes("AT_RISK")) {
          return false;
        }

        if (selectedSegmentFilter !== "ALL" && !g.segments.includes(selectedSegmentFilter)) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = g.guestName.toLowerCase().includes(q);
          const matchEmail = g.email.toLowerCase().includes(q);
          const matchCorp = g.corporateCompanyName?.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchCorp) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "spend") return b.totalSpending - a.totalSpending;
        if (sortBy === "stays") return b.totalStays - a.totalStays;
        if (sortBy === "inactive") return b.daysSinceLastStay - a.daysSinceLastStay;
        return 0;
      });
  }, [overview.intelligence, searchQuery, selectedSegmentFilter, sortBy, activeTab]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Guest Retention & Customer Intelligence
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Calculated metrics, segment rules & churn diagnostics strictly derived from actual reservation history.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/guests"
            className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-sm font-medium transition"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Guest Directory</span>
          </Link>
          <Link
            href="/reservations"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 rounded-lg text-sm font-semibold shadow transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Reservation Logs</span>
          </Link>
        </div>
      </div>

      {/* Label Banner: Calculated Historical Estimates */}
      <div className="bg-stone-900/90 border border-amber-500/30 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-stone-300">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Deterministic Data Processing:</strong> All metrics, repeat rates, customer lifetime values (LTV), and segment tags below are calculated deterministically from historic booking records. (No unbacked AI claims).
          </span>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-500/30 font-semibold shrink-0">
          Calculated Historical Estimates
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Repeat Booking Rate */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Repeat Booking Rate</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {overview.repeatBookingRate}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Guests with &ge; 2 stays ({(overview.intelligence || []).filter((g) => g.totalStays >= 2).length} of {overview.totalGuests})
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Average Stay Length */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Average Stay Length</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">
              {overview.averageStayNights} Nights
            </h3>
            <p className="text-xs text-stone-400 mt-1">Calculated across all reservations</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Lifetime Value (LTV) Estimate */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-stone-400 font-medium">Customer LTV Estimate</p>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1 rounded font-semibold">*Est</span>
            </div>
            <h3 className="text-2xl font-bold text-cyan-300 mt-1">
              ${overview.estimatedLTV.toLocaleString()}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Historical avg revenue / guest</p>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* At-Risk Guest Spend */}
        <div className="bg-stone-900/80 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-300 font-medium">At-Risk Guest Value</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">
              ${overview.atRiskTotalValue.toLocaleString()}
            </h3>
            <p className="text-xs text-rose-300/80 mt-1">
              {overview.atRiskCount} repeat guests inactive &gt; 120 days
            </p>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer Segment Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Configured Customer Segments</span>
          </h2>
          <span className="text-xs text-stone-400">Rule-Based Deterministic Classification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overview.segmentCards.map((card) => {
            const isSelected = selectedSegmentFilter === card.segment;
            return (
              <div
                key={card.segment}
                onClick={() => setSelectedSegmentFilter(isSelected ? "ALL" : card.segment)}
                className={`cursor-pointer bg-stone-900 border ${
                  isSelected ? "border-amber-500 ring-1 ring-amber-500" : "border-stone-800"
                } rounded-xl p-4 space-y-3 hover:border-stone-700 transition`}
              >
                <div className="flex items-start justify-between">
                  <span className={`px-2.5 py-1 rounded text-xs ${card.color}`}>
                    {card.label} ({card.segment})
                  </span>
                  <span className="text-xs font-bold text-stone-300 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                    {card.count} Guests
                  </span>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed min-h-[36px]">
                  {card.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
                  <span className="text-stone-500">Segment Value:</span>
                  <span className="font-bold text-amber-300">${card.totalSpendSum.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retention Directory & At-Risk Guest List Controls */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4 shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("ALL_GUESTS")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === "ALL_GUESTS"
                  ? "bg-amber-500 text-stone-950 shadow"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              All Guest Intelligence Directory ({overview.totalGuests})
            </button>
            <button
              onClick={() => setActiveTab("AT_RISK_LIST")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === "AT_RISK_LIST"
                  ? "bg-rose-500 text-stone-950 shadow"
                  : "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Dedicated At-Risk Guest List ({overview.atRiskCount})</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search guest name, email, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 w-64"
              />
            </div>

            <select
              value={selectedSegmentFilter}
              onChange={(e) => setSelectedSegmentFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Segment Filters</option>
              <option value="NEW">New Guests (1 Stay)</option>
              <option value="RETURNING">Returning Guests (2-4 Stays)</option>
              <option value="FREQUENT">Frequent Guests (5+ Stays)</option>
              <option value="CORPORATE">Corporate Accounts</option>
              <option value="HIGH_VALUE">High Value (&ge; $25k)</option>
              <option value="AT_RISK">At Risk (&gt; 120 Days Inactive)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="spend">Sort: Highest Spending</option>
              <option value="stays">Sort: Most Stays</option>
              <option value="inactive">Sort: Longest Inactive</option>
            </select>
          </div>
        </div>

        {/* Guest Retention Table */}
        <div className="overflow-x-auto">
          {filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-stone-500 space-y-2">
              <Users className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-sm">No guest records match your search or segment filter.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase tracking-wider font-semibold bg-stone-950/60">
                  <th className="py-3 px-4">Guest Info</th>
                  <th className="py-3 px-4">Stays / Nights</th>
                  <th className="py-3 px-4">Total Spend</th>
                  <th className="py-3 px-4">Avg Booking</th>
                  <th className="py-3 px-4">Stay Dates</th>
                  <th className="py-3 px-4">Days Inactive</th>
                  <th className="py-3 px-4">Evaluated Segments</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-sm">
                {filteredGuests.map((intel) => {
                  const isAtRisk = intel.segments.includes("AT_RISK");
                  return (
                    <tr key={intel.guestId} className="hover:bg-stone-800/40 transition">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleViewDetail(intel)}
                          className="font-semibold text-stone-100 hover:text-amber-300 transition text-left"
                        >
                          {intel.guestName}
                        </button>
                        <div className="text-xs text-stone-400 mt-0.5">{intel.email}</div>
                        {intel.corporateCompanyName && (
                          <span className="inline-block text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1">
                            {intel.corporateCompanyName}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-200">{intel.totalStays} Stays</div>
                        <div className="text-xs text-stone-500">{intel.totalNights} Nights total</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-amber-300">
                          ${intel.totalSpending.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-stone-300">
                          ${intel.averageBookingValue.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs text-stone-300">Last: {intel.lastStayDate}</div>
                        <div className="text-[11px] text-stone-500">First: {intel.firstStayDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div
                          className={`font-bold ${
                            intel.daysSinceLastStay > 120 ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {intel.daysSinceLastStay} Days
                        </div>
                        {intel.bookingFrequencyDays > 0 && (
                          <div className="text-[10px] text-stone-500">
                            Freq: ~{intel.bookingFrequencyDays}d
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {intel.segments.map((seg) => {
                            const info = SEGMENT_RULES_DOCUMENTATION[seg];
                            return (
                              <span
                                key={seg}
                                className={`text-[10px] px-2 py-0.5 rounded ${info.color}`}
                              >
                                {seg}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleViewDetail(intel)}
                          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Analytics</span>
                        </button>

                        {isAtRisk && (
                          sentAlerts[intel.guestId] ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Sent</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleTriggerOutreach(intel.guestId)}
                              className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-[11px] font-semibold inline-flex items-center space-x-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Win-Back Offer</span>
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Analytics Modal */}
      <GuestRetentionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        guestIntel={selectedGuestIntel}
      />
    </div>
  );
}
