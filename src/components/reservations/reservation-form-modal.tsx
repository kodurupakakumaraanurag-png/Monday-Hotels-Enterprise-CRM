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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-500/30 rounded-xl shadow-2xl text-stone-100 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-stone-100">
              {reservationToEdit
                ? `Edit Reservation (${reservationToEdit.reservationNumber})`
                : "Create New Room Reservation"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Warning Box */}
        {conflictError && (
          <div className="bg-rose-950/80 border border-rose-500/50 p-3.5 rounded-xl text-xs text-rose-200 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Room Booking Conflict Alert!</span>
            </div>
            <p className="leading-relaxed">{conflictError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Reservation Code *</label>
              <input
                {...register("reservationNumber")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
              {errors.reservationNumber && <p className="text-xs text-rose-400 mt-1">{errors.reservationNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Guest Name *</label>
              <input
                {...register("guest")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
              {errors.guest && <p className="text-xs text-rose-400 mt-1">{errors.guest.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Hotel Property *</label>
              <select
                {...register("property")}
                onChange={() => setConflictError(null)}
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
              <label className="block text-xs font-medium text-stone-300 mb-1">Assigned Room / Villa *</label>
              <input
                {...register("room")}
                onChange={() => setConflictError(null)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                placeholder="e.g. Presidential Sky Suite 1001"
              />
              {errors.room && <p className="text-xs text-rose-400 mt-1">{errors.room.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Check-in Date *</label>
              <input
                type="date"
                {...register("checkIn")}
                onChange={() => setConflictError(null)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Check-out Date *</label>
              <input
                type="date"
                {...register("checkOut")}
                onChange={() => setConflictError(null)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Nightly Rate ($) & Total ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  {...register("rate", { valueAsNumber: true })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                  placeholder="Daily Rate"
                />
                <input
                  type="number"
                  {...register("totalAmount", { valueAsNumber: true })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                  placeholder="Total Amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Reservation Status & Payment</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  {...register("reservationStatus")}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-2 text-xs text-stone-200"
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
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2 py-2 text-xs text-stone-200"
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
            <label className="block text-xs font-medium text-stone-300 mb-1">Special Requests & Notes</label>
            <textarea
              {...register("specialRequests")}
              rows={2}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              placeholder="Butler preferences, room temperature, dietary restriction notes..."
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
              {reservationToEdit ? "Update Reservation" : "Save Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
