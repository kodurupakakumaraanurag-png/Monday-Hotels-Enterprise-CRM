"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LeadFormData } from "@/lib/validations/lead-schema";
import { User, Mail, Phone, BadgeCheck } from "lucide-react";

interface Props {
  register: UseFormRegister<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

export function ContactPocFields({ register, errors }: Props) {
  return (
    <div className="space-y-3.5 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-slate-800/80 pb-2">
        <User className="w-4 h-4" />
        <span>2. Contact POC & Individual Details</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 5. Contact POC Name */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Contact POC Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register("contactPocName")}
            placeholder="e.g. Sunil Nair"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.contactPocName && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.contactPocName.message}</p>
          )}
        </div>

        {/* 6. Designation / Role */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Designation / Role <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register("designation")}
            placeholder="e.g. VP Corporate Events & Travel"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.designation && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.designation.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* 7. Phone Number */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Phone Number <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            {...register("phone")}
            placeholder="+91 98765 43210"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.phone && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.phone.message}</p>
          )}
        </div>

        {/* 8. Email Address */}
        <div>
          <label className="text-slate-300 font-medium block mb-1">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="poc@company.com"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
          {errors.email && (
            <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
