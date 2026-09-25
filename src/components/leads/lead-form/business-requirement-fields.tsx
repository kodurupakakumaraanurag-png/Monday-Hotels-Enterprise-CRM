"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LeadFormData } from "@/lib/validations/lead-schema";
import { FileText, AlertCircle, Target, Award } from "lucide-react";

interface Props {
  register: UseFormRegister<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

export function BusinessRequirementFields({ register, errors }: Props) {
  return (
    <div className="space-y-3.5 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-2">
        <FileText className="w-4 h-4" />
        <span>3. Business Requirements & Friction Scope</span>
      </div>

      {/* 9. Business Overview */}
      <div className="text-xs">
        <label className="text-slate-300 font-medium block mb-1">
          Business Overview <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={2}
          {...register("businessOverview")}
          placeholder="Summary of client's enterprise operations & event background..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
        />
        {errors.businessOverview && (
          <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.businessOverview.message}</p>
        )}
      </div>

      {/* 10. Problem / Friction */}
      <div className="text-xs">
        <label className="text-slate-300 font-medium block mb-1">
          Problem / Friction <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={2}
          {...register("problemFriction")}
          placeholder="What pain point or operational friction is the client attempting to solve?"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
        />
        {errors.problemFriction && (
          <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.problemFriction.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 11. Project Requirement */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Project Requirement <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={2}
            {...register("projectRequirement")}
            placeholder="e.g. 450 Room Nights + Main Ballroom & 4 Breakout Halls"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.projectRequirement && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.projectRequirement.message}</p>
          )}
        </div>

        {/* 12. Placement Opportunity */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Placement Opportunity <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={2}
            {...register("placementOpportunity")}
            placeholder="e.g. Preferred corporate rate contract across 5 flagship hotels"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.placementOpportunity && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.placementOpportunity.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
