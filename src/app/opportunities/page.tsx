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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-[#1E293B]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E2D9] pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-[#DDE9E1] border border-[#A8C3B2] rounded-lg text-[#285943]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
              Commercial Opportunities Directory
            </h1>
          </div>
          <p className="text-sm text-[#6B766F]">
            Enterprise Deal List, Weighted Valuation Engine (`weighted_value = opportunity_value × probability`) & Stage Lifecycle
          </p>
        </div>

        <button
          onClick={() => {
            setOpportunityToEdit(undefined);
            setIsFormModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#285943] hover:bg-[#1E4D3B] text-white font-semibold rounded-lg text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Commercial Opportunity</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B766F] font-medium">Total Pipeline Value</p>
            <h3 className="text-2xl font-bold text-[#285943] mt-1">
              ${metrics.totalValue.toLocaleString()}
            </h3>
            <p className="text-xs text-[#6B766F] mt-1">{metrics.totalCount} Opportunities</p>
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
            <h3 className="text-2xl font-bold text-[#2E8B57] mt-1">{metrics.conversionRate}</h3>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#2E8B57]">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-[#6B766F] font-medium">Average Opportunity Value</p>
            <h3 className="text-2xl font-bold text-[#1E293B] mt-1">
              ${metrics.averageOpportunityValue.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-[#E9D7AE] border border-[#C9A15B] rounded-xl text-[#1E293B]">
            <Percent className="w-6 h-6 text-[#285943]" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5E2D9] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#285943]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, company, contact, owner..."
            className="w-full bg-[#F7F4EC] border border-[#E5E2D9] rounded-lg pl-9 pr-4 py-2 text-sm text-[#1E293B] placeholder-[#6B766F] focus:outline-none focus:border-[#285943]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#285943]" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-[#F7F4EC] border border-[#E5E2D9] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none"
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
            className="bg-[#F7F4EC] border border-[#E5E2D9] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none"
          >
            <option value="ALL">All Properties</option>
            <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
            <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
            <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E5E2D9] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2D9] bg-[#F7F4EC] text-[#6B766F] text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Opportunity & Related Client</th>
                <th className="py-3.5 px-4">Expected Value</th>
                <th className="py-3.5 px-4">Weighted Value</th>
                <th className="py-3.5 px-4">Stage & Probability</th>
                <th className="py-3.5 px-4">Sales Owner</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2D9] text-sm">
              {filteredOpps.map((opp) => (
                <tr key={opp.id} className="hover:bg-[#F7F4EC]/60 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-[#1E4D3B] bg-[#DDE9E1] px-2 py-0.5 rounded border border-[#A8C3B2]">
                        {opp.id}
                      </span>
                      <button
                        onClick={() => setSelectedDetailOpp(opp)}
                        className="font-semibold text-[#1E293B] hover:text-[#285943] transition text-left"
                      >
                        {opp.title}
                      </button>
                    </div>
                    <div className="text-xs text-[#6B766F] flex items-center space-x-3 mt-1">
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-[#285943]" />
                        <span>{opp.companyName}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-[#6B766F]" />
                        <span>{opp.contactName}</span>
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#285943]">${opp.opportunityValue.toLocaleString()}</div>
                    <div className="text-xs text-[#6B766F]">Close: {opp.expectedCloseDate}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1E4D3B]">${opp.weightedValue.toLocaleString()}</div>
                    <div className="text-xs text-[#285943] font-semibold">{opp.probability}% Weighted</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={opp.stage}
                      onChange={(e) => {
                        updateOpportunityStage(opp.id, e.target.value as PipelineStageType);
                        refreshOpportunities();
                      }}
                      className="text-xs rounded px-2.5 py-1 font-semibold focus:outline-none bg-[#DDE9E1] text-[#1E4D3B] border border-[#A8C3B2]"
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

                  <td className="py-3.5 px-4 text-xs text-[#1E293B] font-medium">
                    {opp.accountOwner}
                    <div className="text-[#6B766F] text-[11px]">{opp.roomNights} Room Nights</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedDetailOpp(opp)}
                        className="p-1.5 text-[#285943] hover:bg-[#DDE9E1] rounded-lg transition"
                        title="View Full Opportunity Dossier"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setOpportunityToEdit(opp);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 text-[#6B766F] hover:text-[#1E293B] hover:bg-[#F7F4EC] rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(opp.id, opp.title)}
                        className="p-1.5 text-[#6B766F] hover:text-[#C95C5C] hover:bg-rose-50 rounded-lg transition"
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
