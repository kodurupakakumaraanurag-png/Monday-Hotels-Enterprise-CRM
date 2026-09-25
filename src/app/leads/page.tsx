"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  MOCK_LEADS,
  LeadItem,
  PipelineStatus,
  PriorityLevel,
  getScoreBadge,
  getPriorityStyle,
  getStatusStyle,
} from "@/lib/demo-data/leads-data";
import {
  Search,
  Filter,
  Plus,
  UserCheck,
  Building2,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Award,
  X,
  CheckCircle2,
  DollarSign,
  Download,
  AlertCircle
} from "lucide-react";

export default function LeadsPage() {
  const [leadsList, setLeadsList] = useState<LeadItem[]>(MOCK_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newPocName, setNewPocName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProperty, setNewProperty] = useState("Monday Silicon Heights, Bengaluru");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("HIGH");
  const [newBudget, setNewBudget] = useState(120000);
  const [newRoomNights, setNewRoomNights] = useState(200);

  // Filtered leads calculation
  const filteredLeads = leadsList.filter((lead) => {
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || lead.status === selectedStatus;
    const matchesPriority = selectedPriority === "ALL" || lead.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalValue = filteredLeads.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName || !newPocName || !newEmail) {
      alert("Please fill in company name, POC name, and email.");
      return;
    }

    const createdLead: LeadItem = {
      id: `LD-${Math.floor(8000 + Math.random() * 1000)}`,
      companyName: newCompanyName,
      industry: "Corporate Enterprise",
      location: "India",
      website: "https://example.com",
      contactPocName: newPocName,
      designation: "Corporate Travel Lead",
      phone: newPhone || "+91 99000 11223",
      email: newEmail,
      businessOverview: "New group booking inquiry submitted via Enterprise CRM Portal.",
      requirement: `${newRoomNights} Room Nights requested for executive retreat.`,
      priority: newPriority,
      status: "NEW",
      leadSource: "Direct Enterprise Portal",
      assignedTo: "Rahul Verma (Sales Exec)",
      targetProperty: newProperty,
      estimatedValue: Number(newBudget),
      roomNights: Number(newRoomNights),
      scores: {
        digitalPresence: 88,
        hiringActivity: 80,
        techStackFit: 85,
        fundingRevenue: 90,
        projectUrgency: 85,
        budgetClarity: 88,
        totalScore: 516,
      },
      createdAt: new Date().toISOString().split("T")[0],
      nextFollowUp: "Today (17:00)",
    };

    setLeadsList([createdLead, ...leadsList]);
    setShowAddModal(false);
    // Reset Form
    setNewCompanyName("");
    setNewPocName("");
    setNewEmail("");
    setNewPhone("");
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Commercial Sales Leads Engine"
        subtitle="Inbound Group Inquiries, Lead Scoring Matrix & Sales Pipeline Management"
        breadcrumbs={[{ label: "Commercial CRM" }, { label: "Sales Leads" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Lead</span>
            </button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Active Leads</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{leadsList.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +24% YoY Inbound Volume
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">${totalValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Across {filteredLeads.length} filtered deals
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Hot Prospects (S-Tier)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {leadsList.filter((l) => l.scores.totalScore >= 540).length}
          </div>
          <div className="text-[11px] text-purple-400 mt-1 font-semibold">
            Lead score &gt; 540 / 600
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Unassigned Leads</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {leadsList.filter((l) => l.assignedTo === "Unassigned").length}
          </div>
          <div className="text-[11px] text-rose-400 mt-1 font-semibold">
            Requires Manager SLA Assignment
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by company, POC name, ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Pipeline Stages</option>
            <option value="NEW">New Leads</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="QUOTATION">Quote Sent</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CONFIRMED">Confirmed Won</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Leads Main Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3 rounded-l-lg font-semibold">Lead ID & Company</th>
              <th className="py-3 px-3 font-semibold">Contact POC</th>
              <th className="py-3 px-3 font-semibold">Target Property</th>
              <th className="py-3 px-3 font-semibold text-center">Room Nights</th>
              <th className="py-3 px-3 font-semibold text-right">Est. Value ($)</th>
              <th className="py-3 px-3 font-semibold text-center">Lead Score</th>
              <th className="py-3 px-3 font-semibold text-center">Priority</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-3 rounded-r-lg text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No sales leads match your search filter criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const scoreBadge = getScoreBadge(lead.scores.totalScore);
                const priorityBadge = getPriorityStyle(lead.priority);
                const statusBadge = getStatusStyle(lead.status);

                return (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {lead.id}
                        </span>
                        <div>
                          <div className="font-bold text-slate-100">{lead.companyName}</div>
                          <div className="text-[11px] text-slate-400">{lead.industry}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{lead.contactPocName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[140px]">{lead.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300 font-medium">{lead.targetProperty}</td>

                    <td className="py-3.5 px-3 text-center font-bold text-slate-200">{lead.roomNights}</td>

                    <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400">
                      ${lead.estimatedValue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-extrabold text-amber-400 text-xs">{lead.scores.totalScore} / 600</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${scoreBadge.class}`}>
                          {scoreBadge.label}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${priorityBadge.class}`}>
                        {priorityBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => alert(`Opening detail inspector for ${lead.companyName} (${lead.id})`)}
                        className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create New Sales Lead</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Company / Event Name</label>
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Deloitte Leadership Forum"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Contact POC Name</label>
                  <input
                    type="text"
                    value={newPocName}
                    onChange={(e) => setNewPocName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">POC Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="anand@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Target Property</label>
                  <select
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Monday Silicon Heights, Bengaluru">Monday Silicon Heights, Bengaluru</option>
                    <option value="Monday Grand Palace, Delhi">Monday Grand Palace, Delhi</option>
                    <option value="Monday Luxury Suites, Mumbai">Monday Luxury Suites, Mumbai</option>
                    <option value="Monday Beach Resort, Goa">Monday Beach Resort, Goa</option>
                    <option value="Monday Heritage Palace, Jaipur">Monday Heritage Palace, Jaipur</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="URGENT">Urgent Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Est. Deal Value ($)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Room Nights</label>
                  <input
                    type="number"
                    value={newRoomNights}
                    onChange={(e) => setNewRoomNights(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow-md shadow-amber-500/10"
                >
                  Save Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
