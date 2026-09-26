"use client";

import React, { useState } from "react";
import { CompleteLeadRecord } from "@/lib/services/lead-service";
import { getPriorityStyle, getStatusStyle } from "@/lib/demo-data/leads-data";
import {
  ArrowUpRight,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  Building2,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";

interface Props {
  leads: CompleteLeadRecord[];
  onEdit: (lead: CompleteLeadRecord) => void;
  onDelete: (id: string) => void;
}

export function LeadTable({ leads, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState<"score" | "company" | "date">("score");
  const [sortAsc, setSortAsc] = useState(false);

  // Sorting
  const sortedLeads = [...leads].sort((a, b) => {
    if (sortField === "score") {
      return sortAsc ? a.totalLeadScore - b.totalLeadScore : b.totalLeadScore - a.totalLeadScore;
    }
    if (sortField === "company") {
      return sortAsc
        ? a.companyName.localeCompare(b.companyName)
        : b.companyName.localeCompare(a.companyName);
    }
    if (sortField === "date") {
      return sortAsc
        ? (a.dateAdded || "").localeCompare(b.dateAdded || "")
        : (b.dateAdded || "").localeCompare(a.dateAdded || "");
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;
  const paginatedLeads = sortedLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field: "score" | "company" | "date") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 26) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 20) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    if (score >= 15) return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    return "text-slate-400 bg-slate-500/10 border-slate-500/30";
  };

  return (
    <div className="bg-white border border-[#E5E2D9] rounded-xl p-5 shadow-sm space-y-4 text-[#1E293B]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E2D9] text-[11px] uppercase tracking-wider text-[#6B766F] bg-[#F7F4EC]">
              <th className="py-3 px-3 rounded-l-lg font-semibold cursor-pointer" onClick={() => toggleSort("company")}>
                <div className="flex items-center gap-1">
                  <span>Lead ID & Company</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold">Contact POC</th>
              <th className="py-3 px-3 font-semibold">Target Property</th>
              <th className="py-3 px-3 font-semibold text-center cursor-pointer" onClick={() => toggleSort("score")}>
                <div className="flex items-center justify-center gap-1">
                  <span>Lead Score (/30)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold text-center">Priority</th>
              <th className="py-3 px-3 font-semibold text-center">Pipeline Status</th>
              <th className="py-3 px-3 font-semibold text-center">Allocation</th>
              <th className="py-3 px-3 rounded-r-lg text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2D9] text-xs">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#6B766F]">
                  No enterprise leads found.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const priorityBadge = getPriorityStyle(lead.priorityLevel);
                const statusBadge = getStatusStyle(lead.pipelineStatus);

                return (
                  <tr key={lead.id} className="hover:bg-[#F7F4EC]/60 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#1E4D3B] bg-[#DDE9E1] px-1.5 py-0.5 rounded border border-[#A8C3B2]">
                          {lead.id}
                        </span>
                        <div>
                          <Link href={`/leads/${lead.id}`} className="font-bold text-[#1E293B] hover:text-[#285943] transition-colors">
                            {lead.companyName}
                          </Link>
                          <div className="text-[11px] text-[#6B766F]">{lead.industryDomain}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#1E293B]">{lead.contactPocName}</div>
                      <div className="text-[11px] text-[#6B766F] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-[#285943]" />
                        <span className="truncate max-w-[130px]">{lead.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#1E293B] font-medium">{lead.targetProperty || "Monday Hotels"}</td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block font-extrabold text-xs px-2.5 py-0.5 rounded bg-[#DDE9E1] text-[#1E4D3B] border border-[#A8C3B2]">
                        {lead.totalLeadScore} / 30
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#E9D7AE] text-[#1E293B] border border-[#C9A15B]">
                        {priorityBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#DDE9E1] text-[#285943] border border-[#A8C3B2]">
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block text-[10px] font-semibold text-[#1E293B] bg-[#F7F4EC] border border-[#E5E2D9] px-2 py-0.5 rounded">
                        {lead.projectAllocationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="p-1.5 text-[#285943] hover:bg-[#DDE9E1] rounded transition-colors"
                          title="View 26-Field Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 text-[#6B766F] hover:text-[#1E293B] hover:bg-[#F7F4EC] rounded transition-colors"
                          title="Edit Lead"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete lead ${lead.companyName} (${lead.id})?`)) {
                              onDelete(lead.id);
                            }
                          }}
                          className="p-1.5 text-[#6B766F] hover:text-[#C95C5C] hover:bg-rose-50 rounded transition-colors"
                          title="Archive Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E2D9] pt-3 text-xs text-[#6B766F]">
        <div>
          Showing {sortedLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, sortedLeads.length)} of {sortedLeads.length} leads
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-1.5 rounded-lg bg-[#F7F4EC] border border-[#E5E2D9] text-[#1E293B] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#DDE9E1]"
          >
            <ChevronLeft className="w-4 h-4 text-[#285943]" />
          </button>
          <span>
            Page <strong className="text-[#1E293B]">{currentPage}</strong> of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-1.5 rounded-lg bg-[#F7F4EC] border border-[#E5E2D9] text-[#1E293B] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#DDE9E1]"
          >
            <ChevronRight className="w-4 h-4 text-[#285943]" />
          </button>
        </div>
      </div>
    </div>
  );
}
