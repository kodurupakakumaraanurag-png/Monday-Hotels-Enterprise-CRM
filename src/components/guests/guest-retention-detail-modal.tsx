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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-500/40 rounded-xl shadow-2xl text-stone-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-amber-300">{guestIntel.guestName}</h2>
              <span className="text-xs bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded border border-stone-700">
                {guestIntel.vipTier} VIP
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">{guestIntel.email} • {guestIntel.phone}</p>
          </div>

          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calculated Metrics Grid (Strictly from Reservation Data) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Calculated Reservation Metrics
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Deterministic Historical Calculation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs">
            <div>
              <p className="text-stone-500">Total Stays</p>
              <p className="text-lg font-bold text-stone-100 mt-0.5">{guestIntel.totalStays} Stays</p>
            </div>
            <div>
              <p className="text-stone-500">Total Nights</p>
              <p className="text-lg font-bold text-stone-100 mt-0.5">{guestIntel.totalNights} Nights</p>
            </div>
            <div>
              <p className="text-stone-500">Cumulative Spend</p>
              <p className="text-lg font-bold text-amber-300 mt-0.5">${guestIntel.totalSpending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-stone-500">Avg Booking Value</p>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">${guestIntel.averageBookingValue.toLocaleString()}</p>
            </div>

            <div className="pt-2 border-t border-stone-800/80">
              <p className="text-stone-500">First Stay Date</p>
              <p className="font-semibold text-stone-300 mt-0.5">{guestIntel.firstStayDate}</p>
            </div>
            <div className="pt-2 border-t border-stone-800/80">
              <p className="text-stone-500">Last Stay Date</p>
              <p className="font-semibold text-stone-300 mt-0.5">{guestIntel.lastStayDate}</p>
            </div>
            <div className="pt-2 border-t border-stone-800/80">
              <p className="text-stone-500">Days Inactive</p>
              <p className={`font-bold mt-0.5 ${guestIntel.daysSinceLastStay > 120 ? "text-rose-400" : "text-emerald-400"}`}>
                {guestIntel.daysSinceLastStay} Days
              </p>
            </div>
            <div className="pt-2 border-t border-stone-800/80">
              <p className="text-stone-500">Stay Frequency</p>
              <p className="font-semibold text-purple-300 mt-0.5">
                {guestIntel.bookingFrequencyDays > 0 ? `Every ${guestIntel.bookingFrequencyDays} days` : "Single Stay"}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Segment Tags & Rules */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Evaluated Customer Segments
          </h3>
          <div className="space-y-2">
            {guestIntel.segments.map((seg) => {
              const rule = SEGMENT_RULES_DOCUMENTATION[seg];
              return (
                <div key={seg} className="bg-stone-950 p-3 rounded-lg border border-stone-800 flex items-start space-x-3 text-xs">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border shrink-0 ${rule.color}`}>
                    {rule.label} ({seg})
                  </span>
                  <p className="text-stone-300 text-xs leading-relaxed">{rule.rule}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Linked Reservation Stay History */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Linked Reservation History ({guestIntel.reservations.length})
          </h3>
          {guestIntel.reservations.length === 0 ? (
            <p className="text-stone-500 text-xs py-2">No active reservation records found in primary booking table.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {guestIntel.reservations.map((res) => (
                <div key={res.id} className="bg-stone-950 p-3 rounded-lg border border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-300">{res.reservationNumber}</span>
                    <span className="text-stone-400 ml-2">{res.property} • {res.room}</span>
                    <p className="text-stone-500 text-[11px] mt-0.5">{res.checkIn} to {res.checkOut}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">${res.totalAmount.toLocaleString()}</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">{res.reservationStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-stone-800 text-xs text-stone-500">
          <span>Estimation Label: <strong>Deterministic Reservation Heuristics</strong></span>
          <button onClick={onClose} className="px-4 py-2 bg-stone-800 text-stone-200 text-xs font-semibold rounded-lg">
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
