"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LeadFormData } from "@/lib/validations/lead-schema";
import { Target, Calendar, UserCheck, PhoneCall, Tag } from "lucide-react";

interface Props {
  register: UseFormRegister<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

export function PipelineAssignmentFields({ register, errors }: Props) {
  return (
    <div className="space-y-3.5 bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-4 text-[#1E293B]">
      <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B] border-b border-[#E2E8F0] pb-2">
        <Target className="w-4 h-4" />
        <span>5. Pipeline Status, Priority & Assignment</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* 13. Priority Level */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Priority Level <span className="text-red-500">*</span>
          </label>
          <select
            {...register("priorityLevel")}
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          >
            <option value="URGENT">Urgent Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* 14. Pipeline Status */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Pipeline Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register("pipelineStatus")}
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          >
            <option value="NEW">New Lead</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="QUOTATION">Quote Sent</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CONFIRMED">Confirmed Won</option>
            <option value="LOST">Closed Lost</option>
          </select>
        </div>

        {/* 26. Project Allocation Status */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Allocation Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register("projectAllocationStatus")}
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          >
            <option value="UNASSIGNED">Unassigned</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* 15. Next Action */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Next Action <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("nextAction")}
            placeholder="e.g. Schedule AV technical walk-through"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.nextAction && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.nextAction.message}</p>
          )}
        </div>

        {/* 17. Lead Source */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Lead Source <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("leadSource")}
            placeholder="e.g. Corporate B2B Outreach"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.leadSource && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.leadSource.message}</p>
          )}
        </div>

        {/* 18. Contact Method */}
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">
            Contact Method <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("contactMethod")}
            placeholder="e.g. Direct Phone / Email"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
          {errors.contactMethod && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.contactMethod.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">Assigned Sales Executive</label>
          <input
            type="text"
            {...register("assignedTo")}
            placeholder="e.g. Rahul Verma (Sales Exec)"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
        </div>

        <div>
          <label className="text-[#1E293B] font-semibold block mb-1">Target Property</label>
          <input
            type="text"
            {...register("targetProperty")}
            placeholder="e.g. Monday Silicon Heights, Bengaluru"
            className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
          />
        </div>
      </div>
    </div>
  );
}
