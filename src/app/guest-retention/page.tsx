"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Crown,
  AlertTriangle,
  Send,
  Users,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Mail,
  Phone,
} from "lucide-react";
import {
  getChurnRiskGuests,
  RETENTION_CAMPAIGNS,
  ChurnRiskGuest,
} from "@/lib/services/guest-service";

export default function GuestRetentionPage() {
  const [churnRiskGuests, setChurnRiskGuests] = useState<ChurnRiskGuest[]>(() =>
    getChurnRiskGuests()
  );
  const [campaigns, setCampaigns] = useState(() => RETENTION_CAMPAIGNS);
  const [sentAlerts, setSentAlerts] = useState<Record<string, boolean>>({});

  const handleTriggerOutreach = (id: string, name: string) => {
    setSentAlerts((prev) => ({ ...prev, [id]: true }));
  };

  const getRiskBadge = (score: string) => {
    switch (score) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold";
      default:
        return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    }
  };

  const totalRiskSpend = churnRiskGuests.reduce(
    (acc, g) => acc + g.lifetimeSpend,
    0
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Guest Retention & Loyalty Analytics
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            AI Churn Risk Diagnostics, Automated VIP Win-Back Workflows & Repeat Booking Campaigns
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/80 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">At-Risk VIP Lifetime Value</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">
              ${totalRiskSpend.toLocaleString()}
            </h3>
            <p className="text-xs text-stone-400 mt-1">High-spend guests inactive &gt; 90 days</p>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Active Loyalty Campaigns</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">{campaigns.length}</h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
              <Zap className="w-3 h-3 inline" />
              <span>750+ Guests Reached</span>
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Campaign Win-Back Rate</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">27.2%</h3>
            <p className="text-xs text-emerald-400 mt-1">+4.8% vs benchmark</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Projected Win-Back Revenue</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">$675,000</h3>
            <p className="text-xs text-stone-400 mt-1">Q4 Loyalty Impact</p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Section 1: VIP Churn Risk Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-stone-100">
              High-LTV VIP Guests At Risk of Churn
            </h2>
          </div>
          <span className="text-xs bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full border border-rose-500/30">
            {churnRiskGuests.length} VIPs Needing Direct Engagement
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase tracking-wider font-semibold bg-stone-950/60">
                <th className="py-3 px-4">Guest Name & Tier</th>
                <th className="py-3 px-4">Days Inactive</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">AI Recommended Win-Back Action</th>
                <th className="py-3 px-4 text-right">Outreach Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {churnRiskGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/guests/${guest.id}`}
                      className="font-semibold text-stone-100 hover:text-amber-300 transition flex items-center space-x-2"
                    >
                      <span>{guest.guestName}</span>
                      <span className="text-xs bg-stone-800 text-amber-300 px-2 py-0.5 rounded border border-stone-700">
                        {guest.vipTier}
                      </span>
                    </Link>
                    <div className="text-xs text-stone-400 mt-0.5">{guest.email}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-stone-200 font-medium">
                      {guest.daysSinceLastStay} Days
                    </div>
                    <div className="text-xs text-stone-500">Last stay: {guest.lastStayDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-amber-300">
                      ${guest.lifetimeSpend.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500">{guest.totalStays} Stays</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs ${getRiskBadge(
                        guest.churnRiskScore
                      )}`}
                    >
                      {guest.churnRiskScore} Risk
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-xs text-stone-300 bg-stone-950 p-2 rounded border border-stone-800 leading-relaxed">
                      {guest.suggestedAction}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {sentAlerts[guest.id] ? (
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Outreach Sent</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTriggerOutreach(guest.id, guest.guestName)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-semibold text-xs rounded-lg shadow transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Trigger VIP Offer</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Active Loyalty Campaigns */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-stone-100">
              Active Repeat Loyalty & Milestone Campaigns
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((cmp) => (
            <div
              key={cmp.id}
              className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4 hover:border-amber-500/40 transition"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/30 font-semibold">
                  {cmp.status}
                </span>
                <span className="text-xs text-stone-400">{cmp.id}</span>
              </div>

              <div>
                <h3 className="font-semibold text-stone-100 text-sm leading-snug">
                  {cmp.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1">{cmp.targetAudience}</p>
              </div>

              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 text-xs text-amber-200">
                <span className="font-medium text-amber-400">Incentive: </span>
                {cmp.incentive}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-800">
                <div>
                  <p className="text-stone-500">Eligible Base</p>
                  <p className="font-semibold text-stone-200 mt-0.5">
                    {cmp.eligibleGuestsCount} Guests
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Proj. Revenue</p>
                  <p className="font-semibold text-emerald-400 mt-0.5">
                    {cmp.projectedRevenue}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
