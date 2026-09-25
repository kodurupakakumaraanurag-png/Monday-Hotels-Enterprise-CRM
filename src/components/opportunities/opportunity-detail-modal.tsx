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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-500/40 rounded-xl shadow-2xl text-stone-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {opportunity.id}
                </span>
                <h2 className="text-xl font-bold text-stone-100">{opportunity.title}</h2>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">Assigned Owner: <strong className="text-stone-200">{opportunity.accountOwner}</strong></p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial Header Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
          <div>
            <p className="text-xs text-stone-500">Expected Value</p>
            <p className="text-xl font-bold text-amber-300 mt-0.5">${opportunity.opportunityValue.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-stone-500">Win Probability</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{opportunity.probability}%</p>
          </div>

          <div>
            <p className="text-xs text-stone-500">Weighted Pipeline Value</p>
            <p className="text-xl font-bold text-purple-300 mt-0.5">${opportunity.weightedValue.toLocaleString()}</p>
          </div>

          <div>
            <p className="text-xs text-stone-500">Target Close Date</p>
            <p className="text-xl font-bold text-stone-100 mt-0.5">{opportunity.expectedCloseDate}</p>
          </div>
        </div>

        {/* Stage Advancement Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-amber-400 block">Pipeline Stage Movement</label>
          <div className="flex flex-wrap items-center gap-1.5">
            {PIPELINE_STAGES_CONFIG.map((stg) => (
              <button
                key={stg.id}
                onClick={() => handleStageSelect(stg.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition border ${
                  opportunity.stage === stg.id
                    ? "bg-amber-500 text-stone-950 border-amber-400 shadow-md"
                    : "bg-stone-950 text-stone-400 border-stone-800 hover:border-stone-700"
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Relationships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Related Corporate Account</span>
            </span>
            <p className="font-bold text-stone-100 text-sm">{opportunity.companyName}</p>
            {opportunity.companyId && <p className="text-xs text-stone-400">ID: {opportunity.companyId}</p>}
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Related Contact POC</span>
            </span>
            <p className="font-bold text-stone-100 text-sm">{opportunity.contactName}</p>
            <p className="text-xs text-stone-400">{opportunity.contactEmail}</p>
          </div>

          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold flex items-center space-x-1">
              <ClipboardList className="w-3.5 h-3.5 text-amber-500" />
              <span>Related Booking Enquiry</span>
            </span>
            <p className="font-bold text-amber-300 text-sm">{opportunity.bookingEnquiryNumber || "None Linked"}</p>
            <p className="text-xs text-stone-400">{opportunity.property}</p>
          </div>
        </div>

        {/* Activities & Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Opportunity Activity Log</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {opportunity.activities.map((act) => (
                <div key={act.id} className="bg-stone-900 p-2.5 rounded border border-stone-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="font-semibold text-amber-300">{act.user}</span>
                    <span className="text-[10px]">{act.createdAt}</span>
                  </div>
                  <p className="text-stone-300">{act.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider">Follow-up Action Tasks</h4>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="New task item..."
                className="flex-1 bg-stone-900 border border-stone-800 rounded px-2.5 py-1.5 text-xs text-stone-200"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-500 text-stone-950 text-xs font-bold rounded"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {opportunity.tasks.map((task) => (
                <div key={task.id} className="bg-stone-900 p-2.5 rounded border border-stone-800 text-xs flex items-center justify-between">
                  <span className="text-stone-200">{task.title}</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-stone-800">
          <button onClick={onClose} className="px-4 py-2 bg-stone-800 text-stone-200 text-xs font-semibold rounded-lg">
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
