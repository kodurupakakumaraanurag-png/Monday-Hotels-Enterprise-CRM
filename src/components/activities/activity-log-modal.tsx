"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Activity, Phone, Mail, Users, FileText, Calendar, Eye } from "lucide-react";
import { activityLogSchema, ActivityLogFormValues, ActivityType } from "@/lib/validations/task-activity-schema";
import { logActivity } from "@/lib/services/task-activity-service";

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultEntityName?: string;
  defaultEntityId?: string;
}

export function ActivityLogModal({
  isOpen,
  onClose,
  onSuccess,
  defaultEntityName = "Reliance Enterprise Solutions",
  defaultEntityId = "CORP-101",
}: ActivityLogModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityLogFormValues>({
    resolver: zodResolver(activityLogSchema),
    defaultValues: {
      activityType: "CALL",
      title: "",
      description: "",
      loggedBy: "Priya Sharma",
      relatedEntity: defaultEntityName,
      relatedEntityId: defaultEntityId,
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: ActivityLogFormValues) => {
    logActivity(data);
    onSuccess();
    onClose();
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              Log Activity Touchpoint
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Activity Type *</label>
            <select
              {...register("activityType")}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E4D3B] font-bold focus:outline-none"
            >
              <option value="CALL">CALL (Telephone / Mobile Call)</option>
              <option value="EMAIL">EMAIL (Outbound / Inbound Email)</option>
              <option value="MEETING">MEETING (In-Person / Virtual Conference)</option>
              <option value="NOTE">NOTE (Internal Observations)</option>
              <option value="FOLLOW_UP">FOLLOW_UP (Re-engagement Action)</option>
              <option value="SITE_VISIT">SITE_VISIT (Property Tour / Venue Inspection)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Activity Summary Title *</label>
            <input
              {...register("title")}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              placeholder="e.g. Discovery Call with Reliance Board Secretariat"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Detailed Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              placeholder="Record exact discussion outcomes and next steps..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Logged By User</label>
              <input
                {...register("loggedBy")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Related Entity Target</label>
              <input
                {...register("relatedEntity")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-[#1E4D3B] hover:bg-[#163B2D] text-white rounded-lg shadow-sm"
            >
              Post Activity Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
