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
    <div className="space-y-6 pb-12 font-sans text-[#1E293B]">
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
              className="flex items-center gap-1.5 bg-[#285943] hover:bg-[#1E4D3B] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New 26-Field Lead</span>
            </button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B766F] text-xs font-medium">
            <span>Total Enterprise Leads</span>
            <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#285943]">{leadsList.length}</div>
          <div className="text-[11px] text-[#2E8B57] mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +18.4% YoY Growth
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B766F] text-xs font-medium">
            <span>Active Pipeline Value</span>
            <div className="p-1.5 bg-[#DDE9E1] text-[#285943] rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#285943]">${totalPipelineValue.toLocaleString()}</div>
          <div className="text-[11px] text-[#6B766F] mt-1 font-medium">
            Across {filteredLeads.length} filtered deals
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B766F] text-xs font-medium">
            <span>High Scoring Leads (&ge;25/30)</span>
            <div className="p-1.5 bg-[#E9D7AE] text-[#1E293B] rounded-lg">
              <Sparkles className="w-4 h-4 text-[#285943]" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#285943]">
            {leadsList.filter((l) => l.totalLeadScore >= 25).length}
          </div>
          <div className="text-[11px] text-[#C9A15B] mt-1 font-semibold">
            High Conversion Probability
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#6B766F] text-xs font-medium">
            <span>Unassigned Leads</span>
            <div className="p-1.5 bg-rose-50 text-[#C95C5C] rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1E293B]">
            {leadsList.filter((l) => l.projectAllocationStatus === "UNASSIGNED").length}
          </div>
          <div className="text-[11px] text-[#C95C5C] mt-1 font-semibold">
            Requires Manager Assignment
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#285943] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by company, POC name, ID, or location..."
            className="w-full pl-9 pr-4 py-2 bg-[#F7F4EC] border border-[#E5E2D9] rounded-lg text-xs text-[#1E293B] placeholder-[#6B766F] focus:outline-none focus:border-[#285943]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F7F4EC] text-[#1E293B] border border-[#E5E2D9] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#285943]"
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
            className="bg-[#F7F4EC] text-[#1E293B] border border-[#E5E2D9] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#285943]"
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
            className="bg-[#F7F4EC] text-[#1E293B] border border-[#E5E2D9] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#285943]"
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
