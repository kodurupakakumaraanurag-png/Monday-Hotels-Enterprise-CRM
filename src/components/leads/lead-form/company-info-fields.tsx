"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LeadFormData } from "@/lib/validations/lead-schema";
import { Building2, Globe, MapPin, Briefcase } from "lucide-react";

interface Props {
  register: UseFormRegister<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

export function CompanyInfoFields({ register, errors }: Props) {
  return (
    <div className="space-y-3.5 bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-4 text-[#1E293B]">
      <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B] border-b border-[#E2E8F0] pb-2">
        <Building2 className="w-4 h-4" />
        <span>1. Company & Industry Information</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 1. Company Name */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("companyName")}
            placeholder="e.g. TechCorp Global Solutions"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.companyName && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.companyName.message}</p>
          )}
        </div>

        {/* 2. Industry Domain */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Industry Domain <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("industryDomain")}
            placeholder="e.g. Technology & Software"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.industryDomain && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.industryDomain.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 3. Location / City */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Location / City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="e.g. Bengaluru, Karnataka, India"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.location && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.location.message}</p>
          )}
        </div>

        {/* 4. Website URL */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">Website URL</label>
          <input
            type="text"
            {...register("websiteUrl")}
            placeholder="https://company.com"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.websiteUrl && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.websiteUrl.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
