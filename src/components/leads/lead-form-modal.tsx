"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadFormData } from "@/lib/validations/lead-schema";
import { CompanyInfoFields } from "./lead-form/company-info-fields";
import { ContactPocFields } from "./lead-form/contact-poc-fields";
import { BusinessRequirementFields } from "./lead-form/business-requirement-fields";
import { LeadScoringFields } from "./lead-form/lead-scoring-fields";
import { PipelineAssignmentFields } from "./lead-form/pipeline-assignment-fields";
import { X, Save, Plus, ShieldCheck } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  initialData?: Partial<LeadFormData>;
  title?: string;
}

export function LeadFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = "Create New Enterprise Lead",
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      companyName: initialData?.companyName || "",
      industryDomain: initialData?.industryDomain || "Technology & Software",
      location: initialData?.location || "Bengaluru, India",
      websiteUrl: initialData?.websiteUrl || "",
      contactPocName: initialData?.contactPocName || "",
      designation: initialData?.designation || "VP Corporate Travel",
      phone: initialData?.phone || "+91 98000 11223",
      email: initialData?.email || "",
      businessOverview: initialData?.businessOverview || "Enterprise client inquiry for group accommodation & event spaces.",
      problemFriction: initialData?.problemFriction || "Need high-speed fiber internet and dedicated event manager.",
      projectRequirement: initialData?.projectRequirement || "300 Room Nights + Main Ballroom",
      placementOpportunity: initialData?.placementOpportunity || "Preferred corporate group contract",
      priorityLevel: initialData?.priorityLevel || "HIGH",
      pipelineStatus: initialData?.pipelineStatus || "NEW",
      nextAction: initialData?.nextAction || "Contact client POC to verify requirements",
      leadSource: initialData?.leadSource || "Corporate B2B Outreach",
      contactMethod: initialData?.contactMethod || "Phone / Email",
      digitalPresenceScore: initialData?.digitalPresenceScore ?? 4,
      hiringActivityScore: initialData?.hiringActivityScore ?? 4,
      techStackFitScore: initialData?.techStackFitScore ?? 4,
      fundingRevenueScore: initialData?.fundingRevenueScore ?? 4,
      projectUrgencyScore: initialData?.projectUrgencyScore ?? 4,
      budgetClarityScore: initialData?.budgetClarityScore ?? 4,
      projectAllocationStatus: initialData?.projectAllocationStatus || "ASSIGNED",
      assignedTo: initialData?.assignedTo || "Rahul Verma (Sales Exec)",
      targetProperty: initialData?.targetProperty || "Monday Silicon Heights, Bengaluru",
      estimatedValue: initialData?.estimatedValue || 120000,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto text-[#1E293B]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#1E4D3B]" />
              <span>{title}</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Complete the 26-field Monday Hotels enterprise lead structure with automated scoring logic
            </p>
          </div>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#1E293B] p-1.5 rounded-lg bg-[#F8F6F0]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Sections */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CompanyInfoFields register={register} errors={errors} />
          <ContactPocFields register={register} errors={errors} />
          <BusinessRequirementFields register={register} errors={errors} />
          <LeadScoringFields register={register} watch={watch} errors={errors} />
          <PipelineAssignmentFields register={register} errors={errors} />

          {/* Form Actions Footer */}
          <div className="pt-4 flex items-center justify-between border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <ShieldCheck className="w-4 h-4 text-[#1E4D3B]" />
              <span>Zod Validated • 26 Fields Schema Compliant</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8F6F0] text-[#1E293B] rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#1E4D3B] hover:bg-[#163B2D] text-white rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Enterprise Lead</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
