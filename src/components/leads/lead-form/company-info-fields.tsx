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
    <div className="space-y-3.5 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-2">
        <Building2 className="w-4 h-4" />
        <span>1. Company & Industry Information</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 1. Company Name */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Company Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register("companyName")}
            placeholder="e.g. TechCorp Global Solutions"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.companyName && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.companyName.message}</p>
          )}
        </div>

        {/* 2. Industry Domain */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Industry Domain <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register("industryDomain")}
            placeholder="e.g. Technology & Software"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.industryDomain && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.industryDomain.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 3. Location / City */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Location / City <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register("location")}
            placeholder="e.g. Bengaluru, Karnataka, India"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.location && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.location.message}</p>
          )}
        </div>

        {/* 4. Website URL */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">Website URL</label>
          <input
            type="text"
            {...register("websiteUrl")}
            placeholder="https://company.com"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.websiteUrl && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.websiteUrl.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
