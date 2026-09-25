"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  MOCK_LEADS,
  LeadItem,
  PipelineStatus,
  getPriorityStyle,
  getScoreBadge,
} from "@/lib/demo-data/leads-data";
import {
  Kanban,
  Plus,
  Building2,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  BedDouble,
  ArrowRight,
  TrendingUp,
  Filter
} from "lucide-react";

const STAGES: { id: PipelineStatus; title: string; color: string; border: string }[] = [
  { id: "NEW", title: "New Leads", color: "bg-slate-800 text-slate-200", border: "border-slate-700" },
  { id: "CONTACTED", title: "Contacted", color: "bg-blue-500/10 text-blue-400", border: "border-blue-500/30" },
  { id: "QUALIFIED", title: "Qualified", color: "bg-purple-500/10 text-purple-400", border: "border-purple-500/30" },
  { id: "QUOTATION", title: "Quotation Sent", color: "bg-amber-500/10 text-amber-400", border: "border-amber-500/30" },
  { id: "NEGOTIATION", title: "Negotiation", color: "bg-sky-500/10 text-sky-400", border: "border-sky-500/30" },
  { id: "CONFIRMED", title: "Confirmed Won", color: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/30" },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<LeadItem[]>(MOCK_LEADS);
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState("ALL");

  const filteredDeals = selectedPropertyFilter === "ALL"
    ? deals
    : deals.filter((d) => d.targetProperty.includes(selectedPropertyFilter));

  const totalPipelineValue = filteredDeals.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  // Advance deal to next pipeline stage
  const moveStage = (dealId: string, direction: "NEXT" | "PREV") => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const currentIdx = STAGES.findIndex((s) => s.id === d.status);
        if (direction === "NEXT" && currentIdx < STAGES.length - 1) {
          return { ...d, status: STAGES[currentIdx + 1].id };
        }
        if (direction === "PREV" && currentIdx > 0) {
          return { ...d, status: STAGES[currentIdx - 1].id };
        }
        return d;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Commercial Sales Pipeline Kanban"
        subtitle="Visual Lead Funnel, Deal Velocity, Stage Tracking & Value Distribution"
        breadcrumbs={[{ label: "Commercial CRM" }, { label: "Sales Pipeline" }]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedPropertyFilter}
              onChange={(e) => setSelectedPropertyFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Properties (5)</option>
              <option value="Bengaluru">Monday Silicon Heights</option>
              <option value="Delhi">Monday Grand Palace</option>
              <option value="Mumbai">Monday Luxury Suites</option>
              <option value="Goa">Monday Beach Resort</option>
              <option value="Jaipur">Monday Heritage Palace</option>
            </select>

            <div className="bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-bold text-amber-400">
              Total Pipeline: ${totalPipelineValue.toLocaleString()}
            </div>
          </div>
        }
      />

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.status === stage.id);
          const stageValue = stageDeals.reduce((acc, curr) => acc + curr.estimatedValue, 0);

          return (
            <div
              key={stage.id}
              className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-3 min-w-[240px] flex flex-col space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="space-y-0.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border inline-block ${stage.color} ${stage.border}`}>
                    {stage.title}
                  </span>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {stageDeals.length} {stageDeals.length === 1 ? "Deal" : "Deals"}
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400">
                  ${(stageValue / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Deal Cards Stack */}
              <div className="space-y-3 min-h-[350px]">
                {stageDeals.length === 0 ? (
                  <div className="h-32 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[11px] text-slate-500">
                    No active deals in this stage
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const priority = getPriorityStyle(deal.priority);
                    const scoreBadge = getScoreBadge(deal.scores.totalScore);
                    const currentStageIdx = STAGES.findIndex((s) => s.id === deal.status);

                    return (
                      <div
                        key={deal.id}
                        className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 space-y-2.5 shadow-md transition-all group"
                      >
                        {/* Header ID & Priority */}
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {deal.id}
                          </span>
                          <span className={`font-bold px-1.5 py-0.5 rounded border ${priority.class}`}>
                            {priority.label}
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                            {deal.companyName}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{deal.targetProperty}</p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[11px]">
                          <div className="font-extrabold text-emerald-400">
                            ${deal.estimatedValue.toLocaleString()}
                          </div>
                          <div className="text-slate-400 flex items-center gap-1 font-medium">
                            <BedDouble className="w-3 h-3 text-slate-500" />
                            {deal.roomNights} Nights
                          </div>
                        </div>

                        {/* Stage Movement Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                          <button
                            disabled={currentStageIdx === 0}
                            onClick={() => moveStage(deal.id, "PREV")}
                            className="p-1 text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <span className="text-slate-500 font-mono font-semibold">{deal.scores.totalScore} pts</span>

                          <button
                            disabled={currentStageIdx === STAGES.length - 1}
                            onClick={() => moveStage(deal.id, "NEXT")}
                            className="p-1 text-amber-400 hover:text-amber-300 font-bold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-0.5"
                            title="Advance stage →"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
