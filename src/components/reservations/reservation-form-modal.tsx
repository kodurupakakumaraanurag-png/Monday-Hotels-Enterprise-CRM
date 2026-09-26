"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Calendar, Bed, DollarSign, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  reservationSchema,
  ReservationFormValues,
} from "@/lib/validations/reservation-schema";
import {
  createReservation,
  updateReservation,
  Reservation,
} from "@/lib/services/reservation-service";

interface ReservationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reservationToEdit?: Reservation;
}

export function ReservationFormModal({
  isOpen,
  onClose,
  onSuccess,
  reservationToEdit,
}: ReservationFormModalProps) {
  const [conflictError, setConflictError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: reservationToEdit
      ? {
          reservationNumber: reservationToEdit.reservationNumber,
          guest: reservationToEdit.guest,
          property: reservationToEdit.property,
          room: reservationToEdit.room,
          checkIn: reservationToEdit.checkIn,
          checkOut: reservationToEdit.checkOut,
          numberOfGuests: reservationToEdit.numberOfGuests,
          rate: reservationToEdit.rate,
          totalAmount: reservationToEdit.totalAmount,
          paymentStatus: reservationToEdit.paymentStatus,
          reservationStatus: reservationToEdit.reservationStatus,
          bookingSource: reservationToEdit.bookingSource,
          specialRequests: reservationToEdit.specialRequests || "",
          notes: reservationToEdit.notes || "",
        }
      : {
          reservationNumber: `RES-2026-${Math.floor(500 + Math.random() * 499)}`,
          guest: "",
          property: "Monday Hotels Grand Royale Mumbai",
          room: "Presidential Sky Suite 1001",
          checkIn: "2026-11-10",
          checkOut: "2026-11-15",
          numberOfGuests: 2,
          rate: 3500,
          totalAmount: 17500,
          paymentStatus: "PENDING",
          reservationStatus: "CONFIRMED",
          bookingSource: "Direct Website",
          specialRequests: "",
          notes: "",
        },
  });

  useEffect(() => {
    if (reservationToEdit) {
      reset({
        reservationNumber: reservationToEdit.reservationNumber,
        guest: reservationToEdit.guest,
        property: reservationToEdit.property,
        room: reservationToEdit.room,
        checkIn: reservationToEdit.checkIn,
        checkOut: reservationToEdit.checkOut,
        numberOfGuests: reservationToEdit.numberOfGuests,
        rate: reservationToEdit.rate,
        totalAmount: reservationToEdit.totalAmount,
        paymentStatus: reservationToEdit.paymentStatus,
        reservationStatus: reservationToEdit.reservationStatus,
        bookingSource: reservationToEdit.bookingSource,
        specialRequests: reservationToEdit.specialRequests || "",
        notes: reservationToEdit.notes || "",
      });
      setConflictError(null);
    }
  }, [reservationToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: ReservationFormValues) => {
    setConflictError(null);

    if (reservationToEdit) {
      const res = updateReservation(reservationToEdit.id, data);
      if (res.conflict && res.conflict.hasConflict) {
        setConflictError(res.conflict.message || "Booking Conflict Detected!");
        return;
      }
    } else {
      const res = createReservation(data);
      if (res.conflict && res.conflict.hasConflict) {
        setConflictError(res.conflict.message || "Booking Conflict Detected!");
        return;
      }
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              {reservationToEdit
                ? `Edit Reservation (${reservationToEdit.reservationNumber})`
                : "Create New Room Reservation"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Warning Box */}
        {conflictError && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs text-red-800 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Room Booking Conflict Alert!</span>
            </div>
            <p className="leading-relaxed">{conflictError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Reservation Code *</label>
              <input
                {...register("reservationNumber")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
              {errors.reservationNumber && <p className="text-xs text-red-500 mt-1">{errors.reservationNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Guest Name *</label>
              <input
                {...register("guest")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
              {errors.guest && <p className="text-xs text-red-500 mt-1">{errors.guest.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Hotel Property *</label>
              <select
                {...register("property")}
                onChange={() => setConflictError(null)}
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
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Assigned Room / Villa *</label>
              <input
                {...register("room")}
                onChange={() => setConflictError(null)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                placeholder="e.g. Presidential Sky Suite 1001"
              />
              {errors.room && <p className="text-xs text-red-500 mt-1">{errors.room.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Check-in Date *</label>
              <input
                type="date"
                {...register("checkIn")}
                onChange={() => setConflictError(null)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Check-out Date *</label>
              <input
                type="date"
                {...register("checkOut")}
                onChange={() => setConflictError(null)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Nightly Rate ($) & Total ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  {...register("rate", { valueAsNumber: true })}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                  placeholder="Daily Rate"
                />
                <input
                  type="number"
                  {...register("totalAmount", { valueAsNumber: true })}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                  placeholder="Total Amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Reservation Status & Payment</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  {...register("reservationStatus")}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs text-[#1E293B]"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CHECKED_IN">CHECKED_IN</option>
                  <option value="CHECKED_OUT">CHECKED_OUT</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="NO_SHOW">NO_SHOW</option>
                </select>
                <select
                  {...register("paymentStatus")}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-2 py-2 text-xs text-[#1E293B]"
                >
                  <option value="PAID">PAID</option>
                  <option value="PARTIAL">PARTIAL</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Special Requests & Notes</label>
            <textarea
              {...register("specialRequests")}
              rows={2}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              placeholder="Butler preferences, room temperature, dietary restriction notes..."
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
              {reservationToEdit ? "Update Reservation" : "Save Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
