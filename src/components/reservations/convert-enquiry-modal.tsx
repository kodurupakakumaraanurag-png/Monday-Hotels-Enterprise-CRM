"use client";

import React, { useState } from "react";
import { X, ArrowRightLeft, AlertTriangle, CheckCircle2, Bed, Calendar, Building2, DollarSign } from "lucide-react";
import { convertEnquiryToReservation, BookingEnquiry, RoomConflictResult } from "@/lib/services/reservation-service";

interface ConvertEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  enquiry: BookingEnquiry | null;
}

export function ConvertEnquiryModal({
  isOpen,
  onClose,
  onSuccess,
  enquiry,
}: ConvertEnquiryModalProps) {
  const [room, setRoom] = useState("Presidential Sky Suite 1001");
  const [rate, setRate] = useState(3700);
  const [bookingSource, setBookingSource] = useState("Corporate Direct");
  const [specialRequests, setSpecialRequests] = useState("");
  const [conflictError, setConflictError] = useState<string | null>(null);

  React.useEffect(() => {
    if (enquiry) {
      setRoom(
        enquiry.roomType.includes("Suite")
          ? `${enquiry.roomType} 1001`
          : `${enquiry.roomType} Room 304`
      );
      setRate(Math.round(enquiry.estimatedValue / 5) || 2500);
      setBookingSource(enquiry.source || "Corporate Direct");
      setSpecialRequests(enquiry.notes || "");
      setConflictError(null);
    }
  }, [enquiry]);

  if (!isOpen || !enquiry) return null;

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const result = convertEnquiryToReservation(
      enquiry.id,
      room,
      Number(rate),
      bookingSource,
      specialRequests
    );

    if (result.conflict && result.conflict.hasConflict) {
      setConflictError(result.conflict.message || "Booking Conflict Detected!");
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-xl shadow-2xl text-stone-100 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-300">
                Convert Enquiry to Confirmed Reservation
              </h2>
              <p className="text-xs text-stone-400">Ref: {enquiry.enquiryNumber}</p>
            </div>
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

        <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Guest Name</span>
            <span className="font-bold text-stone-100">{enquiry.guest}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Target Property</span>
            <span className="font-medium text-amber-300">{enquiry.property}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Dates & Guests</span>
            <span className="text-stone-200 font-medium">
              {enquiry.checkInDate} to {enquiry.checkOutDate} ({enquiry.numberOfGuests} Guests)
            </span>
          </div>
        </div>

        <form onSubmit={handleConvert} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Assign Specific Room / Villa *
            </label>
            <input
              type="text"
              required
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setConflictError(null);
              }}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. Presidential Sky Suite 1001, Villa 12"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Daily Nightly Rate ($) *</label>
              <input
                type="number"
                required
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Booking Channel / Source</label>
              <input
                type="text"
                value={bookingSource}
                onChange={(e) => setBookingSource(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Special Concierge Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              placeholder="Butler requests, pillow choices, dietary preferences..."
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
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 rounded-lg shadow-md"
            >
              Confirm & Convert to Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
