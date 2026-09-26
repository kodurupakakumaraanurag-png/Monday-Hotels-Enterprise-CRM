"use client";

import React from "react";
import { X, TrendingUp, DollarSign, Calendar, Bed, Building2, AlertTriangle, ShieldCheck, Tag, Clock, Award } from "lucide-react";
import { CalculatedGuestIntelligence, SEGMENT_RULES_DOCUMENTATION } from "@/lib/services/guest-retention-service";

interface GuestRetentionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestIntel: CalculatedGuestIntelligence | null;
}

export function GuestRetentionDetailModal({
  isOpen,
  onClose,
  guestIntel,
}: GuestRetentionDetailModalProps) {
  if (!isOpen || !guestIntel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#1E293B]">{guestIntel.guestName}</h2>
              <span className="text-xs bg-[#E8F0EC] text-[#1E4D3B] px-2.5 py-0.5 rounded border border-[#A8C3B2] font-semibold">
                {guestIntel.vipTier} VIP
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">{guestIntel.email} • {guestIntel.phone}</p>
          </div>

          <button onClick={onClose} className="p-1.5 text-[#64748B] hover:text-[#1E293B] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculated Metrics Grid (Strictly from Reservation Data) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Calculated Reservation Metrics
            </h3>
            <span className="text-[10px] text-[#1E4D3B] font-bold bg-[#E8F0EC] px-2 py-0.5 rounded border border-[#A8C3B2]">
              Deterministic Historical Calculation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F6F0] p-4 rounded-xl border border-[#E2E8F0] text-xs">
            <div>
              <p className="text-[#64748B]">Total Stays</p>
              <p className="text-lg font-bold text-[#1E293B] mt-0.5">{guestIntel.totalStays} Stays</p>
            </div>
            <div>
              <p className="text-[#64748B]">Total Nights</p>
              <p className="text-lg font-bold text-[#1E293B] mt-0.5">{guestIntel.totalNights} Nights</p>
            </div>
            <div>
              <p className="text-[#64748B]">Cumulative Spend</p>
              <p className="text-lg font-bold text-[#1E4D3B] mt-0.5">${guestIntel.totalSpending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#64748B]">Avg Booking Value</p>
              <p className="text-lg font-bold text-emerald-600 mt-0.5">${guestIntel.averageBookingValue.toLocaleString()}</p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <p className="text-[#64748B]">First Stay Date</p>
              <p className="font-semibold text-[#1E293B] mt-0.5">{guestIntel.firstStayDate}</p>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]">
              <p className="text-[#64748B]">Last Stay Date</p>
              <p className="font-semibold text-[#1E293B] mt-0.5">{guestIntel.lastStayDate}</p>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]">
              <p className="text-[#64748B]">Days Inactive</p>
              <p className={`font-bold mt-0.5 ${guestIntel.daysSinceLastStay > 120 ? "text-red-600" : "text-emerald-600"}`}>
                {guestIntel.daysSinceLastStay} Days
              </p>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]">
              <p className="text-[#64748B]">Stay Frequency</p>
              <p className="font-semibold text-purple-700 mt-0.5">
                {guestIntel.bookingFrequencyDays > 0 ? `Every ${guestIntel.bookingFrequencyDays} days` : "Single Stay"}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Segment Tags & Rules */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Evaluated Customer Segments
          </h3>
          <div className="space-y-2">
            {guestIntel.segments.map((seg) => {
              const rule = SEGMENT_RULES_DOCUMENTATION[seg];
              return (
                <div key={seg} className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E2E8F0] flex items-start space-x-3 text-xs">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border shrink-0 bg-white border-[#E2E8F0] text-[#1E293B]`}>
                    {rule.label} ({seg})
                  </span>
                  <p className="text-[#1E293B] text-xs leading-relaxed font-medium">{rule.rule}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Linked Reservation Stay History */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">
            Linked Reservation History ({guestIntel.reservations.length})
          </h3>
          {guestIntel.reservations.length === 0 ? (
            <p className="text-[#64748B] text-xs py-2">No active reservation records found in primary booking table.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {guestIntel.reservations.map((res) => (
                <div key={res.id} className="bg-[#F8F6F0] p-3 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1E4D3B]">{res.reservationNumber}</span>
                    <span className="text-[#64748B] ml-2">{res.property} • {res.room}</span>
                    <p className="text-[#64748B] text-[11px] mt-0.5">{res.checkIn} to {res.checkOut}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">${res.totalAmount.toLocaleString()}</span>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{res.reservationStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <span>Estimation Label: <strong>Deterministic Reservation Heuristics</strong></span>
          <button onClick={onClose} className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#1E293B] text-xs font-semibold rounded-lg hover:bg-[#F8F6F0]">
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
