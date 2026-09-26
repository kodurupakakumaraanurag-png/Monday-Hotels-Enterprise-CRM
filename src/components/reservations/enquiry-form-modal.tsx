"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ClipboardList, UserCheck, Building2, Plus } from "lucide-react";
import { bookingEnquirySchema, BookingEnquiryFormValues, enquiryStatusEnum } from "@/lib/validations/reservation-schema";
import { createEnquiry, updateEnquiry, BookingEnquiry } from "@/lib/services/reservation-service";

interface EnquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  enquiryToEdit?: BookingEnquiry;
}

export function EnquiryFormModal({
  isOpen,
  onClose,
  onSuccess,
  enquiryToEdit,
}: EnquiryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingEnquiryFormValues>({
    resolver: zodResolver(bookingEnquirySchema),
    defaultValues: enquiryToEdit
      ? {
          enquiryNumber: enquiryToEdit.enquiryNumber,
          guest: enquiryToEdit.guest,
          corporateClient: enquiryToEdit.corporateClient || "",
          property: enquiryToEdit.property,
          checkInDate: enquiryToEdit.checkInDate,
          checkOutDate: enquiryToEdit.checkOutDate,
          numberOfGuests: enquiryToEdit.numberOfGuests,
          roomType: enquiryToEdit.roomType,
          source: enquiryToEdit.source,
          estimatedValue: enquiryToEdit.estimatedValue,
          assignedStaff: enquiryToEdit.assignedStaff,
          status: enquiryToEdit.status,
          notes: enquiryToEdit.notes || "",
        }
      : {
          enquiryNumber: `ENQ-2026-${Math.floor(100 + Math.random() * 900)}`,
          guest: "",
          corporateClient: "",
          property: "Monday Hotels Grand Royale Mumbai",
          checkInDate: "2026-11-10",
          checkOutDate: "2026-11-15",
          numberOfGuests: 2,
          roomType: "Executive Club Suite",
          source: "Corporate Direct",
          estimatedValue: 12500,
          assignedStaff: "Priya Sharma",
          status: "NEW",
          notes: "",
        },
  });

  React.useEffect(() => {
    if (enquiryToEdit) {
      reset({
        enquiryNumber: enquiryToEdit.enquiryNumber,
        guest: enquiryToEdit.guest,
        corporateClient: enquiryToEdit.corporateClient || "",
        property: enquiryToEdit.property,
        checkInDate: enquiryToEdit.checkInDate,
        checkOutDate: enquiryToEdit.checkOutDate,
        numberOfGuests: enquiryToEdit.numberOfGuests,
        roomType: enquiryToEdit.roomType,
        source: enquiryToEdit.source,
        estimatedValue: enquiryToEdit.estimatedValue,
        assignedStaff: enquiryToEdit.assignedStaff,
        status: enquiryToEdit.status,
        notes: enquiryToEdit.notes || "",
      });
    }
  }, [enquiryToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: BookingEnquiryFormValues) => {
    if (enquiryToEdit) {
      updateEnquiry(enquiryToEdit.id, data);
    } else {
      createEnquiry(data);
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              {enquiryToEdit ? `Edit Booking Enquiry (${enquiryToEdit.enquiryNumber})` : "Log Inbound Booking Enquiry"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Enquiry Code *</label>
              <input
                {...register("enquiryNumber")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              />
              {errors.enquiryNumber && <p className="text-xs text-red-500 mt-1">{errors.enquiryNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Guest Name / Contact *</label>
              <input
                {...register("guest")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
              {errors.guest && <p className="text-xs text-red-500 mt-1">{errors.guest.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Corporate Company (Optional)</label>
              <input
                {...register("corporateClient")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Reliance Enterprise Solutions"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Target Property *</label>
              <select
                {...register("property")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              >
                <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
                <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
                <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
                <option value="Monday Hotels Tech Hub Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
                <option value="Monday Hotels Capital View New Delhi">Monday Hotels Capital View New Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Check-in Date *</label>
              <input
                type="date"
                {...register("checkInDate")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Check-out Date *</label>
              <input
                type="date"
                {...register("checkOutDate")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Room Type *</label>
              <input
                {...register("roomType")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                placeholder="e.g. Presidential Sky Suite"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Guests Count & Estimated Value ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  {...register("numberOfGuests", { valueAsNumber: true })}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                  placeholder="Guests"
                />
                <input
                  type="number"
                  {...register("estimatedValue", { valueAsNumber: true })}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                  placeholder="Value ($)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Booking Source & Staff</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  {...register("source")}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs text-[#1E293B]"
                >
                  <option value="Corporate Direct">Corporate Direct</option>
                  <option value="Website Direct">Website Direct</option>
                  <option value="Call Center">Call Center</option>
                  <option value="OTA Concierge">OTA Concierge</option>
                </select>
                <input
                  {...register("assignedStaff")}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs text-[#1E293B]"
                  placeholder="Staff Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Enquiry Status</label>
              <select
                {...register("status")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="QUOTATION">QUOTATION</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="LOST">LOST</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Notes / Requirements</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              placeholder="Enter specific guest preferences or group booking details..."
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
              {enquiryToEdit ? "Update Enquiry" : "Save Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
