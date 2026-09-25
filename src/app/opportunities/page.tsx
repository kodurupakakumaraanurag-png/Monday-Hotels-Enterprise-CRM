"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  Filter,
  Plus,
  DollarSign,
  Building2,
  Calendar,
  Percent,
  CheckCircle2,
  Clock,
  Briefcase,
  FileText,
} from "lucide-react";
import {
  getOpportunities,
  createOpportunity,
  Opportunity,
  OpportunityStage,
} from "@/lib/services/opportunity-service";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    getOpportunities()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Opp Form State
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [dealValue, setDealValue] = useState(120000);
  const [stage, setStage] = useState<OpportunityStage>("Proposal Sent");
  const [roomNights, setRoomNights] = useState(350);
  const [expectedCloseDate, setExpectedCloseDate] = useState("2026-10-30");

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.accountOwner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage === "ALL" || opp.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const totalValue = opportunities.reduce((acc, o) => acc + o.dealValue, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName) return;

    createOpportunity({
      title,
      companyName,
      dealValue: Number(dealValue),
      stage,
      expectedCloseDate,
      roomNights: Number(roomNights),
      accountOwner: "Vikram Malhotra",
      probability: 70,
    });

    setOpportunities([...getOpportunities()]);
    setIsModalOpen(false);
    setTitle("");
    setCompanyName("");
  };

  const getStageBadgeStyle = (stg: string) => {
    switch (stg) {
      case "Closed Won":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold";
      case "Negotiation":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold";
      case "Executive Approval":
        return "bg-purple-500/10 text-purple-300 border border-purple-500/30";
      case "Proposal Sent":
        return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
      default:
        return "bg-stone-800 text-stone-400 border border-stone-700";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Commercial Deal Opportunities & RFP Contracts
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Qualified B2B Deals, Annual Room Block Contracts & Revenue Pipeline Forecasts
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Commercial Opportunity</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Pipeline Opportunity Value</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">
              ${totalValue.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Active Deals Count</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{opportunities.length} Deals</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Contracted Room Nights</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {opportunities.reduce((acc, o) => acc + o.roomNights, 0).toLocaleString()} Nights
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Avg Deal Win Rate</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">75.0%</h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, companies, owners..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Deal Stages</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Executive Approval">Executive Approval</option>
            <option value="Closed Won">Closed Won</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Opportunity Name & Client</th>
                <th className="py-3.5 px-4">Deal Value</th>
                <th className="py-3.5 px-4">Deal Stage</th>
                <th className="py-3.5 px-4">Room Block</th>
                <th className="py-3.5 px-4">Close Probability</th>
                <th className="py-3.5 px-4">Account Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {filteredOpps.map((opp) => (
                <tr key={opp.id} className="hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-100">{opp.title}</div>
                    <div className="text-xs text-stone-400 flex items-center space-x-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>{opp.companyName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-amber-300">
                      ${opp.dealValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-500">Close: {opp.expectedCloseDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getStageBadgeStyle(opp.stage)}`}>
                      {opp.stage}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-stone-200 font-medium">{opp.roomNights} Room Nights</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-stone-950 rounded-full h-2 border border-stone-800 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-amber-300">{opp.probability}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-300 font-medium">
                    {opp.accountOwner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-xl p-6 space-y-4 text-stone-100">
            <h3 className="text-lg font-bold text-amber-300">Create Commercial Deal Opportunity</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                  placeholder="e.g. Wipro Annual Leadership Retreat"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Corporate Client *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                  placeholder="e.g. Wipro Technologies"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Deal Value ($)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Room Nights</label>
                  <input
                    type="number"
                    value={roomNights}
                    onChange={(e) => setRoomNights(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-amber-500 text-stone-950 rounded-lg"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
