"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Sparkles,
  SlidersHorizontal,
  Utensils,
  Thermometer,
  Bed,
  Layers,
  FileText,
  Plus,
  Clock,
  UserCheck,
  ShieldCheck,
  Send,
  MessageSquare,
  Award,
} from "lucide-react";
import {
  getGuestById,
  addGuestNote,
  GuestProfile,
} from "@/lib/services/guest-service";
import { GuestFormModal } from "@/components/guests/guest-form-modal";

export default function GuestDossierPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params?.id as string;

  const [guest, setGuest] = useState<GuestProfile | undefined>(() =>
    getGuestById(guestId)
  );

  const [activeTab, setActiveTab] = useState<"preferences" | "stays" | "notes" | "spend">("preferences");
  
  // Note Form
  const [noteCategory, setNoteCategory] = useState<"Concierge" | "Housekeeping" | "F&B" | "General">("Concierge");
  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Priya Sharma (Chief Concierge)");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!guest) {
    return (
      <div className="p-12 text-center text-stone-400 space-y-4">
        <h2 className="text-xl font-bold text-stone-200">Guest Profile Not Found</h2>
        <p>No guest dossier registered under reference code `{guestId}`.</p>
        <Link
          href="/guests"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Guest Directory</span>
        </Link>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      addGuestNote(guest.id, noteCategory, noteText, noteAuthor);
      setGuest({ ...getGuestById(guest.id)! });
      setNoteText("");
    } catch (err) {
      console.error(err);
    }
  };

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case "Black Diamond":
        return "bg-stone-900 border border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20";
      case "Platinum":
        return "bg-slate-800 border border-cyan-400/60 text-cyan-200";
      case "Gold":
        return "bg-amber-950/80 border border-amber-500/50 text-amber-300";
      default:
        return "bg-stone-800 border border-stone-600 text-stone-300";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Back Button */}
      <div>
        <Link
          href="/guests"
          className="inline-flex items-center space-x-2 text-xs font-medium text-stone-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Guest Directory</span>
        </Link>
      </div>

      {/* Header Profile Dossier Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-900/60 border border-amber-500/50 flex items-center justify-center font-bold text-amber-300 text-3xl shadow-xl">
              {guest.firstName[0]}
              {guest.lastName[0]}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-100">
                  {guest.firstName} {guest.lastName}
                </h1>
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${getTierBadgeStyle(
                    guest.vipTier
                  )}`}
                >
                  <Crown className="w-4 h-4" />
                  <span>{guest.vipTier} VIP</span>
                </span>
                <span className="text-xs bg-stone-800 text-stone-400 px-2.5 py-1 rounded-full border border-stone-700">
                  ID: {guest.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>{guest.email}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{guest.phone}</span>
                </span>
                {guest.corporateCompanyName && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1.5 text-amber-300">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Corporate Account: {guest.corporateCompanyName}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 lg:flex-none px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-lg text-sm font-medium transition"
            >
              Edit Dossier
            </button>

            <button
              onClick={() => setActiveTab("notes")}
              className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Concierge Note</span>
            </button>
          </div>
        </div>

        {/* LTV & Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <p className="text-xs text-stone-500">Total Lifetime Spend</p>
            <p className="text-xl font-bold text-amber-300 mt-1">
              ${guest.lifetimeSpend.toLocaleString()}
            </p>
          </div>

          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <p className="text-xs text-stone-500">Average Daily Rate (ADR)</p>
            <p className="text-xl font-bold text-stone-100 mt-1">
              ${guest.averageDailyRate} / night
            </p>
          </div>

          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <p className="text-xs text-stone-500">Total Stays / Nights</p>
            <p className="text-xl font-bold text-stone-100 mt-1">
              {guest.totalStays} Stays ({guest.totalNights} Nights)
            </p>
          </div>

          <div className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
            <p className="text-xs text-stone-500">Last Stay Date</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {guest.lastStayDate || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "preferences"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Personalization & Room Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab("stays")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "stays"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Stay History Timeline ({guest.stayHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "notes"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Concierge & Staff Notes ({guest.notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("spend")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "spend"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Spend Breakdown</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room & Stay Specs */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Bed className="w-4 h-4 text-amber-500" />
              <span>Room & Physical Preferences</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Preferred Property</span>
                <span className="font-semibold text-stone-200">{guest.preferredProperty}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Preferred Room Type</span>
                <span className="font-semibold text-stone-200">{guest.preferredRoomType}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Pillow Type</span>
                <span className="font-semibold text-amber-300">{guest.pillowType || "Standard"}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-stone-800/60">
                <span className="text-stone-400">Floor & Location</span>
                <span className="font-semibold text-stone-200">{guest.floorPreference || "Any"}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-stone-400 flex items-center space-x-1">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span>Room Climate Control</span>
                </span>
                <span className="font-semibold text-cyan-300">{guest.temperatureSetting || "21°C"}</span>
              </div>
            </div>
          </div>

          {/* F&B & Special Requests */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Utensils className="w-4 h-4 text-amber-500" />
              <span>Dining, Celebrations & Special Instructions</span>
            </h3>

            <div className="space-y-4 text-sm">
              <div className="bg-stone-950 p-3.5 rounded-lg border border-stone-800 space-y-1">
                <p className="text-xs text-stone-500 font-medium">Dietary Restrictions & Allergies</p>
                <p className="text-stone-200 font-medium">{guest.dietaryRestrictions || "None specified"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <p className="text-xs text-stone-500">Anniversary</p>
                  <p className="text-stone-200 font-medium mt-0.5">{guest.anniversary || "Not recorded"}</p>
                </div>
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                  <p className="text-xs text-stone-500">Birthday</p>
                  <p className="text-stone-200 font-medium mt-0.5">{guest.birthday || "Not recorded"}</p>
                </div>
              </div>

              <div className="bg-amber-950/20 p-3.5 rounded-lg border border-amber-500/30 space-y-1">
                <p className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Special VIP Butler Instructions</span>
                </p>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {guest.specialRequests || "No custom requests recorded."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stay History Tab */}
      {activeTab === "stays" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-semibold text-amber-400">Historical Reservations Timeline</h3>
          {guest.stayHistory.length === 0 ? (
            <p className="text-stone-500 text-sm py-4">No completed stay records logged in current system.</p>
          ) : (
            <div className="space-y-3">
              {guest.stayHistory.map((stay) => (
                <div
                  key={stay.id}
                  className="bg-stone-950 border border-stone-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-stone-100">{stay.propertyName}</span>
                      <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                        {stay.reservationCode}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      Room Type: <span className="text-stone-200 font-medium">{stay.roomType}</span>
                    </p>
                    <p className="text-xs text-stone-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>
                        {stay.checkIn} to {stay.checkOut}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-300">${stay.totalAmount.toLocaleString()}</p>
                    <span className="inline-block mt-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                      {stay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Log Front Desk / Concierge Note</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-stone-400 mb-1">Department Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="Concierge">Concierge</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="F&B">F&B Dining</option>
                  <option value="General">General Duty Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Author Name / Title</label>
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Note Details *</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                placeholder="Enter detailed guest observations..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-semibold rounded-lg text-xs shadow-md transition"
              >
                Post Note
              </button>
            </div>
          </form>

          {/* Note List Timeline */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-200">Staff Note History</h3>

            <div className="space-y-3">
              {guest.notes.map((note) => (
                <div key={note.id} className="bg-stone-950 border border-stone-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-500/10 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                        {note.category}
                      </span>
                      <span className="text-stone-300 font-medium">{note.author}</span>
                    </div>
                    <span className="text-stone-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{note.createdAt}</span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spend Breakdown Tab */}
      {activeTab === "spend" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-amber-400">Revenue Allocation Breakdown</h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <p className="text-xs text-stone-400">Room Revenue</p>
              <p className="text-xl font-bold text-amber-300 mt-1">
                ${guest.spendBreakdown.room.toLocaleString()}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <p className="text-xs text-stone-400">Food & Beverage (F&B)</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                ${guest.spendBreakdown.fnb.toLocaleString()}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <p className="text-xs text-stone-400">Spa & Wellness</p>
              <p className="text-xl font-bold text-purple-400 mt-1">
                ${guest.spendBreakdown.spa.toLocaleString()}
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <p className="text-xs text-stone-400">Ancillary Extras</p>
              <p className="text-xl font-bold text-blue-400 mt-1">
                ${guest.spendBreakdown.extras.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <GuestFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => setGuest({ ...getGuestById(guest.id)! })}
        guestToEdit={guest}
      />
    </div>
  );
}
