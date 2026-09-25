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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-500/30 rounded-xl shadow-2xl text-stone-100 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-100">
              {opportunityToEdit
                ? `Edit Commercial Opportunity (${opportunityToEdit.id})`
                : "Create Commercial Deal Opportunity"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-stone-300 mb-1">Opportunity Title *</label>
              <input
                {...register("title")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. Reliance Tech Leadership Summit 2026"
              />
              {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Related Corporate Company *</label>
              <input
                {...register("companyName")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. Reliance Enterprise Solutions"
              />
              {errors.companyName && <p className="text-xs text-rose-400 mt-1">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Related Contact POC *</label>
              <input
                {...register("contactName")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
              {errors.contactName && <p className="text-xs text-rose-400 mt-1">{errors.contactName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Contact Email *</label>
              <input
                {...register("contactEmail")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                placeholder="contact@company.com"
              />
              {errors.contactEmail && <p className="text-xs text-rose-400 mt-1">{errors.contactEmail.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Related Booking Enquiry Ref</label>
              <input
                {...register("bookingEnquiryNumber")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. ENQ-2026-101"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Pipeline Stage *</label>
              <select
                {...register("stage")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
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
              <label className="block text-xs font-medium text-stone-300 mb-1">Assigned Sales Executive *</label>
              <input
                {...register("accountOwner")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                placeholder="e.g. Vikram Malhotra"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Target Property *</label>
              <select
                {...register("property")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              >
                <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
                <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
                <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
                <option value="Monday Hotels Tech Hub Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
                <option value="Monday Hotels Capital View New Delhi">Monday Hotels Capital View New Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Expected Deal Value ($) *</label>
              <input
                type="number"
                {...register("opportunityValue", { valueAsNumber: true })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Win Probability (%) & Weighted Value</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  {...register("probability", { valueAsNumber: true })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                  placeholder="Probability %"
                />
                <div className="bg-stone-950 border border-amber-500/30 rounded-lg px-3 py-2 text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span>Weighted:</span>
                  <span>${computedWeightedValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Expected Close Date *</label>
              <input
                type="date"
                {...register("expectedCloseDate")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Room Nights</label>
              <input
                type="number"
                {...register("roomNights", { valueAsNumber: true })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Notes / Scope Summary</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              placeholder="RFP requirements, room block terms, competitor quotes..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 rounded-lg shadow-md"
            >
              {opportunityToEdit ? "Update Opportunity" : "Save Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
