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
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
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
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No enterprise leads found.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const priorityBadge = getPriorityStyle(lead.priorityLevel);
                const statusBadge = getStatusStyle(lead.pipelineStatus);
                const scoreColor = getScoreColor(lead.totalLeadScore);

                return (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {lead.id}
                        </span>
                        <div>
                          <Link href={`/leads/${lead.id}`} className="font-bold text-slate-100 hover:text-amber-400 transition-colors">
                            {lead.companyName}
                          </Link>
                          <div className="text-[11px] text-slate-400">{lead.industryDomain}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{lead.contactPocName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate max-w-[130px]">{lead.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300 font-medium">{lead.targetProperty || "Monday Hotels"}</td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block font-extrabold text-xs px-2.5 py-0.5 rounded border ${scoreColor}`}>
                        {lead.totalLeadScore} / 30
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${priorityBadge.class}`}>
                        {priorityBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {lead.projectAllocationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
                          title="View 26-Field Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
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
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
        <div>
          Showing {sortedLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, sortedLeads.length)} of {sortedLeads.length} leads
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page <strong className="text-slate-200">{currentPage}</strong> of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
