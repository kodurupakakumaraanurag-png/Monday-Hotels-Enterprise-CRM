"use client";

import React, { useState, useMemo } from "react";
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
  User,
  Edit2,
  Trash2,
  Award,
} from "lucide-react";
import {
  getEnterpriseOpportunities,
  deleteEnterpriseOpportunity,
  updateOpportunityStage,
  getPipelineMetrics,
  PIPELINE_STAGES_CONFIG,
  EnterpriseOpportunity,
} from "@/lib/services/opportunity-service";
import { PipelineStageType } from "@/lib/validations/opportunity-schema";
import { OpportunityFormModal } from "@/components/opportunities/opportunity-form-modal";
import { OpportunityDetailModal } from "@/components/opportunities/opportunity-detail-modal";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<EnterpriseOpportunity[]>(() =>
    getEnterpriseOpportunities()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [selectedProperty, setSelectedProperty] = useState("ALL");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [opportunityToEdit, setOpportunityToEdit] = useState<EnterpriseOpportunity | undefined>(undefined);
  const [selectedDetailOpp, setSelectedDetailOpp] = useState<EnterpriseOpportunity | null>(null);

  const refreshOpportunities = () => {
    setOpportunities([...getEnterpriseOpportunities()]);
  };

  const filteredOpps = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.accountOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = selectedStage === "ALL" || opp.stage === selectedStage;
      const matchesProperty = selectedProperty === "ALL" || opp.property === selectedProperty;

      return matchesSearch && matchesStage && matchesProperty;
    });
  }, [opportunities, searchQuery, selectedStage, selectedProperty]);

  const metrics = useMemo(() => getPipelineMetrics(filteredOpps), [filteredOpps]);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete opportunity "${title}"?`)) {
      deleteEnterpriseOpportunity(id);
      refreshOpportunities();
    }
  };

  const getStageBadgeStyle = (stg: string) => {
    const found = PIPELINE_STAGES_CONFIG.find((s) => s.id === stg);
    return found ? found.badge : "bg-stone-800 text-stone-300 border border-stone-700";
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
              Commercial Opportunities Directory
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Enterprise Deal List, Weighted Valuation Engine (`weighted_value = opportunity_value × probability`) & Stage Lifecycle
          </p>
        </div>

        <button
          onClick={() => {
            setOpportunityToEdit(undefined);
            setIsFormModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Commercial Opportunity</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Pipeline Value</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">
              ${metrics.totalValue.toLocaleString()}
            </h3>
            <p className="text-xs text-stone-400 mt-1">{metrics.totalCount} Opportunities</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-stone-400 font-medium">Weighted Pipeline Value</p>
            <h3 className="text-2xl font-bold text-purple-300 mt-1">
              ${metrics.totalWeightedValue.toLocaleString()}
            </h3>
            <p className="text-xs text-purple-400 mt-1">Value × Win Probability</p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-stone-400 font-medium">Win Conversion Rate</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{metrics.conversionRate}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-stone-400 font-medium">Average Opportunity Value</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">
              ${metrics.averageOpportunityValue.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
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
            placeholder="Search deals, company, contact, owner..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
            >
              <option value="ALL">All 8 Pipeline Stages</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="QUOTATION">QUOTATION</option>
              <option value="NEGOTIATION">NEGOTIATION</option>
              <option value="CONFIRMED">CONFIRMED (Won)</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="LOST">LOST</option>
            </select>
          </div>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
          >
            <option value="ALL">All Properties</option>
            <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
            <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
            <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Opportunity & Related Client</th>
                <th className="py-3.5 px-4">Expected Value</th>
                <th className="py-3.5 px-4">Weighted Value</th>
                <th className="py-3.5 px-4">Stage & Probability</th>
                <th className="py-3.5 px-4">Sales Owner</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {filteredOpps.map((opp) => (
                <tr key={opp.id} className="hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {opp.id}
                      </span>
                      <button
                        onClick={() => setSelectedDetailOpp(opp)}
                        className="font-semibold text-stone-100 hover:text-amber-300 transition text-left"
                      >
                        {opp.title}
                      </button>
                    </div>
                    <div className="text-xs text-stone-400 flex items-center space-x-3 mt-1">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-amber-500" />
                        <span>{opp.companyName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-stone-500" />
                        <span>{opp.contactName}</span>
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-amber-300">${opp.opportunityValue.toLocaleString()}</div>
                    <div className="text-xs text-stone-500">Close: {opp.expectedCloseDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-purple-300">${opp.weightedValue.toLocaleString()}</div>
                    <div className="text-xs text-purple-400/80">{opp.probability}% Weighted</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={opp.stage}
                      onChange={(e) => {
                        updateOpportunityStage(opp.id, e.target.value as PipelineStageType);
                        refreshOpportunities();
                      }}
                      className={`text-xs rounded px-2.5 py-1 font-semibold focus:outline-none ${getStageBadgeStyle(opp.stage)}`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="QUOTATION">QUOTATION</option>
                      <option value="NEGOTIATION">NEGOTIATION</option>
                      <option value="CONFIRMED">CONFIRMED (Won)</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-300 font-medium">
                    {opp.accountOwner}
                    <div className="text-stone-500 text-[11px]">{opp.roomNights} Room Nights</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedDetailOpp(opp)}
                        className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                        title="View Full Opportunity Dossier"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setOpportunityToEdit(opp);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id, opp.title)}
                        className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <OpportunityFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={refreshOpportunities}
        opportunityToEdit={opportunityToEdit}
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
