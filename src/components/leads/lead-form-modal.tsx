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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>{title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete the 26-field Monday Hotels enterprise lead structure with automated scoring logic
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-950">
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
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zod Validated • 26 Fields Schema Compliant</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5 cursor-pointer"
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
