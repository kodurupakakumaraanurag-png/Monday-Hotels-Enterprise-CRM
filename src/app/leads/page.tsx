"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  CompleteLeadRecord,
} from "@/lib/services/lead-service";
import { LeadFormData } from "@/lib/validations/lead-schema";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadFormModal } from "@/components/leads/lead-form-modal";
import {
  Search,
  Plus,
  UserCheck,
  DollarSign,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Download,
  Filter
} from "lucide-react";

export default function LeadsPage() {
  const [leadsList, setLeadsList] = useState<CompleteLeadRecord[]>(getLeads());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedAllocation, setSelectedAllocation] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<CompleteLeadRecord | null>(null);

  // Refresh data from service
  const refreshLeads = () => {
    setLeadsList([...getLeads()]);
  };

  // Filtered leads
  const filteredLeads = leadsList.filter((lead) => {
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || lead.pipelineStatus === selectedStatus;
    const matchesPriority = selectedPriority === "ALL" || lead.priorityLevel === selectedPriority;
    const matchesAlloc = selectedAllocation === "ALL" || lead.projectAllocationStatus === selectedAllocation;

    return matchesSearch && matchesStatus && matchesPriority && matchesAlloc;
  });

  const totalPipelineValue = filteredLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  const handleCreateOrUpdate = (data: LeadFormData) => {
    if (editingLead) {
      updateLead(editingLead.id, data);
    } else {
      createLead(data);
    }
    refreshLeads();
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleEditClick = (lead: CompleteLeadRecord) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    deleteLead(id);
    refreshLeads();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Enterprise Lead Management Module"
        subtitle="26-Field Monday Hotels Lead Architecture, Automated Scoring Engine (Max 30) & Sales Funnel"
        breadcrumbs={[{ label: "Commercial CRM" }, { label: "Sales Leads" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingLead(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New 26-Field Lead</span>
            </button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Enterprise Leads</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{leadsList.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18.4% YoY Growth
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">${totalPipelineValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Across {filteredLeads.length} filtered deals
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>High Scoring Leads (&ge;25/30)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {leadsList.filter((l) => l.totalLeadScore >= 25).length}
          </div>
          <div className="text-[11px] text-purple-400 mt-1 font-semibold">
            High Conversion Probability
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Unassigned Leads</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {leadsList.filter((l) => l.projectAllocationStatus === "UNASSIGNED").length}
          </div>
          <div className="text-[11px] text-rose-400 mt-1 font-semibold">
            Requires Manager Assignment
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by company, POC name, ID, or location..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters */}
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
            <option value="LOST">Closed Lost</option>
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

          <select
            value={selectedAllocation}
            onChange={(e) => setSelectedAllocation(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Allocations</option>
            <option value="UNASSIGNED">Unassigned</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {/* Main Table with Sorting & Pagination */}
      <LeadTable
        leads={filteredLeads}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Reusable Lead Modal with Zod Validation */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingLead || undefined}
        title={editingLead ? `Edit Lead: ${editingLead.companyName}` : "Create New 26-Field Enterprise Lead"}
      />
    </div>
  );
}
