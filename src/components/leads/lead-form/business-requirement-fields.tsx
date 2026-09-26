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
    <div className="space-y-3.5 bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-4 text-[#1E293B]">
      <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B] border-b border-[#E2E8F0] pb-2">
        <FileText className="w-4 h-4" />
        <span>3. Business Requirements & Friction Scope</span>
      </div>

      {/* 9. Business Overview */}
      <div className="text-xs">
        <label className="text-[#1E293B] font-semibold block mb-1">
          Business Overview <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={2}
          {...register("businessOverview")}
          placeholder="Summary of client's enterprise operations & event background..."
          className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
        />
        {errors.businessOverview && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.businessOverview.message}</p>
        )}
      </div>

      {/* 10. Problem / Friction */}
      <div className="text-xs">
        <label className="text-[#1E293B] font-semibold block mb-1">
          Problem / Friction <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={2}
          {...register("problemFriction")}
          placeholder="What pain point or operational friction is the client attempting to solve?"
          className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
        />
        {errors.problemFriction && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.problemFriction.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 11. Project Requirement */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Project Requirement <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            {...register("projectRequirement")}
            placeholder="e.g. 450 Room Nights + Main Ballroom & 4 Breakout Halls"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.projectRequirement && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.projectRequirement.message}</p>
          )}
        </div>

        {/* 12. Placement Opportunity */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Placement Opportunity <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            {...register("placementOpportunity")}
            placeholder="e.g. Preferred corporate rate contract across 5 flagship hotels"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.placementOpportunity && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.placementOpportunity.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
