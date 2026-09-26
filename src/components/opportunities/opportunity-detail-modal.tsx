"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  TrendingUp,
  Building2,
  User,
  Mail,
  Phone,
  ClipboardList,
  Calendar,
  Bed,
  DollarSign,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  EnterpriseOpportunity,
  addOpportunityTask,
  updateOpportunityStage,
  getOpportunityById,
  PIPELINE_STAGES_CONFIG,
} from "@/lib/services/opportunity-service";
import { PipelineStageType } from "@/lib/validations/opportunity-schema";

interface OpportunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  opportunity: EnterpriseOpportunity | null;
}

export function OpportunityDetailModal({
  isOpen,
  onClose,
  onUpdate,
  opportunity,
}: OpportunityDetailModalProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("2026-10-10");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("High");

  if (!isOpen || !opportunity) return null;

  const handleStageSelect = (newStage: PipelineStageType) => {
    updateOpportunityStage(opportunity.id, newStage);
    onUpdate();
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addOpportunityTask(opportunity.id, taskTitle, taskDueDate, taskPriority);
    onUpdate();
    setTaskTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-[#1E4D3B] font-bold bg-[#E8F0EC] px-2 py-0.5 rounded border border-[#A8C3B2]">
                  {opportunity.id}
                </span>
                <h2 className="text-xl font-bold text-[#1E293B]">{opportunity.title}</h2>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">Assigned Owner: <strong className="text-[#1E293B]">{opportunity.accountOwner}</strong></p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial Header Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0]">
          <div>
            <p className="text-xs text-[#64748B]">Expected Value</p>
            <p className="text-xl font-bold text-[#1E4D3B] mt-0.5">${opportunity.opportunityValue.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-[#64748B]">Win Probability</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">{opportunity.probability}%</p>
          </div>

          <div>
            <p className="text-xs text-[#64748B]">Weighted Pipeline Value</p>
            <p className="text-xl font-bold text-purple-700 mt-0.5">${opportunity.weightedValue.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-[#64748B]">Target Close Date</p>
            <p className="text-xl font-bold text-[#1E293B] mt-0.5">{opportunity.expectedCloseDate}</p>
          </div>
        </div>

        {/* Stage Advancement Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1E4D3B] block">Pipeline Stage Movement</label>
          <div className="flex flex-wrap items-center gap-1.5">
            {PIPELINE_STAGES_CONFIG.map((stg) => (
              <button
                key={stg.id}
                onClick={() => handleStageSelect(stg.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition border ${
                  opportunity.stage === stg.id
                    ? "bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm"
                    : "bg-[#F8F6F0] text-[#1E293B] border-[#E2E8F0] hover:bg-[#E8F0EC]"
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Relationships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-[#1E4D3B]" />
              <span>Related Corporate Account</span>
            </span>
            <p className="font-bold text-[#1E293B] text-sm">{opportunity.companyName}</p>
            {opportunity.companyId && <p className="text-xs text-[#64748B]">ID: {opportunity.companyId}</p>}
          </div>

          <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-[#1E4D3B]" />
              <span>Related Contact POC</span>
            </span>
            <p className="font-bold text-[#1E293B] text-sm">{opportunity.contactName}</p>
            <p className="text-xs text-[#64748B]">{opportunity.contactEmail}</p>
          </div>

          <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold flex items-center space-x-1">
              <ClipboardList className="w-3.5 h-3.5 text-[#1E4D3B]" />
              <span>Related Booking Enquiry</span>
            </span>
            <p className="font-bold text-[#1E4D3B] text-sm">{opportunity.bookingEnquiryNumber || "None Linked"}</p>
            <p className="text-xs text-[#64748B]">{opportunity.property}</p>
          </div>
        </div>

        {/* Activities & Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities */}
          <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Opportunity Activity Log</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {opportunity.activities.map((act) => (
                <div key={act.id} className="bg-white p-2.5 rounded border border-[#E2E8F0] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span className="font-semibold text-[#1E4D3B]">{act.user}</span>
                    <span className="text-[10px]">{act.createdAt}</span>
                  </div>
                  <p className="text-[#1E293B]">{act.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Follow-up Action Tasks</h4>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="New task item..."
                className="flex-1 bg-white border border-[#E2E8F0] rounded px-2.5 py-1.5 text-xs text-[#1E293B]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#1E4D3B] text-white text-xs font-semibold rounded"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {opportunity.tasks.map((task) => (
                <div key={task.id} className="bg-white p-2.5 rounded border border-[#E2E8F0] text-xs flex items-center justify-between">
                  <span className="text-[#1E293B] font-medium">{task.title}</span>
                  <span className="text-[10px] bg-[#E8F0EC] text-[#1E4D3B] px-2 py-0.5 rounded border border-[#A8C3B2]">
                    {task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-xs font-semibold rounded-lg shadow-sm hover:bg-[#F8F6F0]">
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
