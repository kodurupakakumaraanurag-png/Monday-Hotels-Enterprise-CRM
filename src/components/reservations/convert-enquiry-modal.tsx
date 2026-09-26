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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E293B]">
                Convert Enquiry to Confirmed Reservation
              </h2>
              <p className="text-xs text-[#64748B]">Ref: {enquiry.enquiryNumber}</p>
            </div>
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

        <div className="bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Guest Name</span>
            <span className="font-bold text-[#1E293B]">{enquiry.guest}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Target Property</span>
            <span className="font-semibold text-[#1E4D3B]">{enquiry.property}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Dates & Guests</span>
            <span className="text-[#1E293B] font-medium">
              {enquiry.checkInDate} to {enquiry.checkOutDate} ({enquiry.numberOfGuests} Guests)
            </span>
          </div>
        </div>

        <form onSubmit={handleConvert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
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
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              placeholder="e.g. Presidential Sky Suite 1001, Villa 12"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Daily Nightly Rate ($) *</label>
              <input
                type="number"
                required
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Booking Channel / Source</label>
              <input
                type="text"
                value={bookingSource}
                onChange={(e) => setBookingSource(e.target.value)}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Special Concierge Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              placeholder="Butler requests, pillow choices, dietary preferences..."
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
              className="px-4 py-2 text-xs font-semibold bg-[#1E4D3B] hover:bg-[#163B2D] text-white rounded-lg shadow-sm"
            >
              Confirm & Convert to Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
