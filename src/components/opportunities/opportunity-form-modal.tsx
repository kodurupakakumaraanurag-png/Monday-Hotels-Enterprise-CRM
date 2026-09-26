"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, TrendingUp, Building2, User, Percent, DollarSign, Calendar, Bed } from "lucide-react";
import { opportunitySchema, OpportunityFormValues } from "@/lib/validations/opportunity-schema";
import {
  createEnterpriseOpportunity,
  updateEnterpriseOpportunity,
  EnterpriseOpportunity,
} from "@/lib/services/opportunity-service";

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  opportunityToEdit?: EnterpriseOpportunity;
}

export function OpportunityFormModal({
  isOpen,
  onClose,
  onSuccess,
  opportunityToEdit,
}: OpportunityFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: opportunityToEdit
      ? {
          title: opportunityToEdit.title,
          companyName: opportunityToEdit.companyName,
          companyId: opportunityToEdit.companyId || "",
          contactName: opportunityToEdit.contactName,
          contactEmail: opportunityToEdit.contactEmail,
          contactPhone: opportunityToEdit.contactPhone || "",
          bookingEnquiryNumber: opportunityToEdit.bookingEnquiryNumber || "",
          opportunityValue: opportunityToEdit.opportunityValue,
          probability: opportunityToEdit.probability,
          stage: opportunityToEdit.stage,
          expectedCloseDate: opportunityToEdit.expectedCloseDate,
          accountOwner: opportunityToEdit.accountOwner,
          property: opportunityToEdit.property,
          roomNights: opportunityToEdit.roomNights,
          notes: opportunityToEdit.notes || "",
        }
      : {
          title: "",
          companyName: "Reliance Enterprise Solutions",
          companyId: "CORP-101",
          contactName: "Dr. Vikramaditya Singhania",
          contactEmail: "v.singhania@singhaniagroup.com",
          contactPhone: "+91 98200 11223",
          bookingEnquiryNumber: "ENQ-2026-101",
          opportunityValue: 150000,
          probability: 60,
          stage: "QUOTATION",
          expectedCloseDate: "2026-11-15",
          accountOwner: "Vikram Malhotra",
          property: "Monday Hotels Grand Royale Mumbai",
          roomNights: 400,
          notes: "",
        },
  });

  const watchValue = watch("opportunityValue") || 0;
  const watchProb = watch("probability") || 0;
  const computedWeightedValue = Math.round(Number(watchValue) * (Number(watchProb) / 100));

  useEffect(() => {
    if (opportunityToEdit) {
      reset({
        title: opportunityToEdit.title,
        companyName: opportunityToEdit.companyName,
        companyId: opportunityToEdit.companyId || "",
        contactName: opportunityToEdit.contactName,
        contactEmail: opportunityToEdit.contactEmail,
        contactPhone: opportunityToEdit.contactPhone || "",
        bookingEnquiryNumber: opportunityToEdit.bookingEnquiryNumber || "",
        opportunityValue: opportunityToEdit.opportunityValue,
        probability: opportunityToEdit.probability,
        stage: opportunityToEdit.stage,
        expectedCloseDate: opportunityToEdit.expectedCloseDate,
        accountOwner: opportunityToEdit.accountOwner,
        property: opportunityToEdit.property,
        roomNights: opportunityToEdit.roomNights,
        notes: opportunityToEdit.notes || "",
      });
    }
  }, [opportunityToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: OpportunityFormValues) => {
    if (opportunityToEdit) {
      updateEnterpriseOpportunity(opportunityToEdit.id, data);
    } else {
      createEnterpriseOpportunity(data);
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              {opportunityToEdit
                ? `Edit Commercial Opportunity (${opportunityToEdit.id})`
                : "Create Commercial Deal Opportunity"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Opportunity Title *</label>
              <input
                {...register("title")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Reliance Tech Leadership Summit 2026"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Related Corporate Company *</label>
              <input
                {...register("companyName")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Reliance Enterprise Solutions"
              />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Related Contact POC *</label>
              <input
                {...register("contactName")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
              {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Contact Email *</label>
              <input
                {...register("contactEmail")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="contact@company.com"
              />
              {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Related Booking Enquiry Ref</label>
              <input
                {...register("bookingEnquiryNumber")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. ENQ-2026-101"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Pipeline Stage *</label>
              <select
                {...register("stage")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Assigned Sales Executive *</label>
              <input
                {...register("accountOwner")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                placeholder="e.g. Vikram Malhotra"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Target Property *</label>
              <select
                {...register("property")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              >
                <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
                <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
                <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
                <option value="Monday Hotels Tech Hub Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
                <option value="Monday Hotels Capital View New Delhi">Monday Hotels Capital View New Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Expected Deal Value ($) *</label>
              <input
                type="number"
                {...register("opportunityValue", { valueAsNumber: true })}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Win Probability (%) & Weighted Value</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  {...register("probability", { valueAsNumber: true })}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                  placeholder="Probability %"
                />
                <div className="bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg px-3 py-2 text-xs font-bold text-[#1E4D3B] flex items-center justify-between">
                  <span>Weighted:</span>
                  <span>${computedWeightedValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Expected Close Date *</label>
              <input
                type="date"
                {...register("expectedCloseDate")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Room Nights</label>
              <input
                type="number"
                {...register("roomNights", { valueAsNumber: true })}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Notes / Scope Summary</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              placeholder="RFP requirements, room block terms, competitor quotes..."
            />
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
              {opportunityToEdit ? "Update Opportunity" : "Save Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
