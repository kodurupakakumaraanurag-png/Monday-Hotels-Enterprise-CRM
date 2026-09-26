"use client";

import React, { useState, useMemo } from "react";
import {
  Kanban,
  Plus,
  Building2,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Bed,
  TrendingUp,
  Percent,
  Award,
  Filter,
  FileText,
} from "lucide-react";
import {
  getEnterpriseOpportunities,
  updateOpportunityStage,
  getPipelineMetrics,
  PIPELINE_STAGES_CONFIG,
  EnterpriseOpportunity,
} from "@/lib/services/opportunity-service";
import { PipelineStageType } from "@/lib/validations/opportunity-schema";
import { OpportunityFormModal } from "@/components/opportunities/opportunity-form-modal";
import { OpportunityDetailModal } from "@/components/opportunities/opportunity-detail-modal";

export default function PipelinePage() {
  const [opportunities, setOpportunities] = useState<EnterpriseOpportunity[]>(() =>
    getEnterpriseOpportunities()
  );
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState("ALL");
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDetailOpp, setSelectedDetailOpp] = useState<EnterpriseOpportunity | null>(null);

  const refreshOpportunities = () => {
    setOpportunities([...getEnterpriseOpportunities()]);
  };

  const filteredOpps = useMemo(() => {
    return selectedPropertyFilter === "ALL"
      ? opportunities
      : opportunities.filter((o) => o.property.includes(selectedPropertyFilter));
  }, [opportunities, selectedPropertyFilter]);

  const metrics = useMemo(() => getPipelineMetrics(filteredOpps), [filteredOpps]);

  const handleStageMove = (id: string, direction: "NEXT" | "PREV") => {
    const opp = opportunities.find((o) => o.id === id);
    if (!opp) return;

    const currentIdx = PIPELINE_STAGES_CONFIG.findIndex((s) => s.id === opp.stage);
    if (direction === "NEXT" && currentIdx < PIPELINE_STAGES_CONFIG.length - 1) {
      updateOpportunityStage(id, PIPELINE_STAGES_CONFIG[currentIdx + 1].id);
      refreshOpportunities();
    } else if (direction === "PREV" && currentIdx > 0) {
      updateOpportunityStage(id, PIPELINE_STAGES_CONFIG[currentIdx - 1].id);
      refreshOpportunities();
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedOppId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStageType) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedOppId;
    if (id) {
      updateOpportunityStage(id, targetStage);
      refreshOpportunities();
      setDraggedOppId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto text-[#1E293B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-[#DDE9E1] border border-[#A8C3B2] rounded-lg text-[#285943]">
              <Kanban className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
              Enterprise Sales Pipeline Kanban
            </h1>
          </div>
          <p className="text-sm text-[#6B766F]">
            8-Stage Commercial Sales Funnel, Weighted Deal Forecasts & Velocity Tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPropertyFilter}
            onChange={(e) => setSelectedPropertyFilter(e.target.value)}
            className="bg-white border border-[#E5E2D9] text-[#1E293B] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#285943] cursor-pointer shadow-sm"
          >
            <option value="ALL">All Portfolio Properties</option>
            <option value="Mumbai">Monday Hotels Grand Royale Mumbai</option>
            <option value="Goa">Monday Hotels Resort & Spa Goa</option>
            <option value="Udaipur">Monday Hotels Palace Udaipur</option>
            <option value="Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
          </select>

          <button
            onClick={() => setIsFormModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#285943] hover:bg-[#1E4D3B] text-white font-semibold rounded-lg text-sm shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B766F] font-medium">Total Pipeline Value</p>
            <h3 className="text-2xl font-bold text-[#285943] mt-1">
              ${metrics.totalValue.toLocaleString()}
            </h3>
            <p className="text-xs text-[#6B766F] mt-1">{metrics.totalCount} Active Deals</p>
          </div>
          <div className="p-3 bg-[#DDE9E1] border border-[#A8C3B2] rounded-xl text-[#285943]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B766F] font-medium">Weighted Pipeline Value</p>
            <h3 className="text-2xl font-bold text-[#1E4D3B] mt-1">
              ${metrics.totalWeightedValue.toLocaleString()}
            </h3>
            <p className="text-xs text-[#285943] font-semibold mt-1">Value × Win Probability</p>
          </div>
          <div className="p-3 bg-[#DDE9E1] border border-[#A8C3B2] rounded-xl text-[#285943]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B766F] font-medium">Win Conversion Rate</p>
            <h3 className="text-2xl font-bold text-[#2E8B57] mt-1">
              {metrics.conversionRate}
            </h3>
            <p className="text-xs text-[#2E8B57] font-semibold mt-1">Confirmed & Completed Deals</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#2E8B57]">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B766F] font-medium">Average Deal Value</p>
            <h3 className="text-2xl font-bold text-[#1E293B] mt-1">
              ${metrics.averageOpportunityValue.toLocaleString()}
            </h3>
            <p className="text-xs text-[#6B766F] mt-1">Per Opportunity</p>
          </div>
          <div className="p-3 bg-[#E9D7AE] border border-[#C9A15B] rounded-xl text-[#1E293B]">
            <Percent className="w-6 h-6 text-[#285943]" />
          </div>
        </div>
      </div>

      {/* 8 Kanban Stage Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 items-start overflow-x-auto pb-6">
        {PIPELINE_STAGES_CONFIG.map((stage) => {
          const stageDeals = filteredOpps.filter((o) => o.stage === stage.id);
          const stageValue = stageDeals.reduce((acc, o) => acc + o.opportunityValue, 0);
          const stageWeighted = stageDeals.reduce((acc, o) => acc + o.weightedValue, 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="bg-white border border-[#E5E2D9] rounded-xl p-3 flex flex-col space-y-3 min-w-[210px] min-h-[480px] shadow-sm"
            >
              {/* Stage Header */}
              <div className="border-b border-[#E5E2D9] pb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#DDE9E1] text-[#1E4D3B] border border-[#A8C3B2]">
                    {stage.label}
                  </span>
                  <span className="text-xs text-[#6B766F] font-mono font-bold">{stageDeals.length}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#285943] font-bold">${(stageValue / 1000).toFixed(0)}k</span>
                  <span className="text-[#C9A15B] font-semibold" title="Weighted Value">
                    W: ${(stageWeighted / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 flex-1">
                {stageDeals.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#E5E2D9] rounded-lg flex items-center justify-center text-[10px] text-[#6B766F] text-center px-2 bg-[#F7F4EC]">
                    Drag or move deals here
                  </div>
                ) : (
                  stageDeals.map((opp) => {
                    const currentIdx = PIPELINE_STAGES_CONFIG.findIndex((s) => s.id === opp.stage);

                    return (
                      <div
                        key={opp.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, opp.id)}
                        className="bg-[#F7F4EC] border border-[#E5E2D9] hover:border-[#285943]/60 rounded-xl p-3 space-y-2.5 shadow-sm transition group cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-[#1E4D3B] font-bold bg-[#DDE9E1] px-1.5 py-0.5 rounded border border-[#A8C3B2]">
                            {opp.id}
                          </span>
                          <span className="text-[#2E8B57] font-bold">{opp.probability}% Win</span>
                        </div>

                        <div>
                          <h4
                            onClick={() => setSelectedDetailOpp(opp)}
                            className="text-xs font-bold text-[#1E293B] group-hover:text-[#285943] transition cursor-pointer leading-snug line-clamp-2"
                          >
                            {opp.title}
                          </h4>
                          <p className="text-[11px] text-[#6B766F] flex items-center space-x-1 mt-1 truncate">
                            <Building2 className="w-3 h-3 text-[#285943] shrink-0" />
                            <span className="truncate">{opp.companyName}</span>
                          </p>
                        </div>

                        <div className="bg-white p-2 rounded border border-[#E5E2D9] space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[#6B766F]">Total:</span>
                            <span className="font-extrabold text-[#285943]">
                              ${opp.opportunityValue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#6B766F]">
                            <span>Weighted:</span>
                            <span className="font-semibold text-[#1E4D3B]">
                              ${opp.weightedValue.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#6B766F]">
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3 text-[#285943]" />
                            <span className="truncate max-w-[80px]">{opp.accountOwner}</span>
                          </span>
                          <span className="font-medium text-[#1E293B]">{opp.roomNights} Nights</span>
                        </div>

                        {/* Stage Controls */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#E5E2D9] text-[10px]">
                          <button
                            disabled={currentIdx === 0}
                            onClick={() => handleStageMove(opp.id, "PREV")}
                            className="p-1 text-[#6B766F] hover:text-[#1E293B] disabled:opacity-20"
                            title="Previous Stage"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedDetailOpp(opp)}
                            className="text-[#285943] hover:text-[#1E4D3B] font-bold"
                          >
                            Dossier
                          </button>

                          <button
                            disabled={currentIdx === PIPELINE_STAGES_CONFIG.length - 1}
                            onClick={() => handleStageMove(opp.id, "NEXT")}
                            className="p-1 text-[#285943] hover:text-[#1E4D3B] font-bold disabled:opacity-20"
                            title="Next Stage"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
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

      {/* Modals */}
      <OpportunityFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={refreshOpportunities}
      />

      <OpportunityDetailModal
        isOpen={!!selectedDetailOpp}
        onClose={() => setSelectedDetailOpp(null)}
        onUpdate={refreshOpportunities}
        opportunity={selectedDetailOpp}
      />
    </div>
  );
}
