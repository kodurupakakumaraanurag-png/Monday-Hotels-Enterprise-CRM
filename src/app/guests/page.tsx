"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Plus,
  Crown,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Heart,
  Grid,
  List as ListIcon,
  ShieldCheck,
  Edit2,
  Trash2,
  FileText,
} from "lucide-react";
import {
  getGuests,
  deleteGuest,
  getGuestRetentionMetrics,
  GuestProfile,
} from "@/lib/services/guest-service";
import { GuestFormModal } from "@/components/guests/guest-form-modal";

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestProfile[]>(() => getGuests());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVipTier, setSelectedVipTier] = useState<string>("ALL");
  const [selectedProperty, setSelectedProperty] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<GuestProfile | undefined>(undefined);

  const refreshGuests = () => {
    setGuests([...getGuests()]);
  };

  const metrics = useMemo(() => getGuestRetentionMetrics(), [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const fullName = `${g.firstName} ${g.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        g.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier =
        selectedVipTier === "ALL" || g.vipTier === selectedVipTier;

      const matchesProperty =
        selectedProperty === "ALL" || g.preferredProperty === selectedProperty;

      return matchesSearch && matchesTier && matchesProperty;
    });
  }, [guests, searchQuery, selectedVipTier, selectedProperty]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the Guest CRM database?`)) {
      deleteGuest(id);
      refreshGuests();
    }
  };

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case "Black Diamond":
        return "bg-stone-900 border border-amber-400 text-amber-300 shadow-md shadow-amber-500/20";
      case "Platinum":
        return "bg-slate-800 border border-cyan-400/60 text-cyan-200";
      case "Gold":
        return "bg-amber-950/80 border border-amber-500/50 text-amber-300";
      case "Silver":
        return "bg-stone-800 border border-stone-600 text-stone-300";
      default:
        return "bg-stone-800/50 text-stone-400 border border-stone-700";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Guest 360° Profiles & VIP Loyalty CRM
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Comprehensive Guest Profiles, Tailored Personalization Preferences & High-Touch Concierge Operations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/guest-retention"
            className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-sm font-medium transition"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Retention Analytics</span>
          </Link>

          <button
            onClick={() => {
              setGuestToEdit(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create VIP Guest</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Guest Base</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{metrics.totalGuestBase}</h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
              <span>+1,240 this quarter</span>
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900/80 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">VIP Tier Members</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">{metrics.vipMembersCount}</h3>
            <p className="text-xs text-amber-400 mt-1">Black Diamond & Platinum</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Crown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Repeat Guest Ratio</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{metrics.repeatGuestRatio}</h3>
            <p className="text-xs text-emerald-400/90 mt-1">Multi-stay loyalists</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Average Guest LTV</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">${metrics.averageLTV.toLocaleString()}</h3>
            <p className="text-xs text-stone-400 mt-1">Lifetime Spend Per Guest</p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guests by name, email, phone..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <select
              value={selectedVipTier}
              onChange={(e) => setSelectedVipTier(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All VIP Tiers</option>
              <option value="Black Diamond">Black Diamond</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Preferred Hotels</option>
            <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
            <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
            <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
            <option value="Monday Hotels Tech Hub Bengaluru">Monday Hotels Tech Hub Bengaluru</option>
            <option value="Monday Hotels Capital View New Delhi">Monday Hotels Capital View New Delhi</option>
          </select>

          {/* Toggle Grid/Table View */}
          <div className="flex items-center bg-stone-950 border border-stone-800 rounded-lg p-1 space-x-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === "table" ? "bg-amber-500/20 text-amber-300" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded text-xs transition ${
                viewMode === "grid" ? "bg-amber-500/20 text-amber-300" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guest Directory Display */}
      {viewMode === "table" ? (
        <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Guest Credentials</th>
                  <th className="py-3.5 px-4">VIP Loyalty Tier</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Stays / Nights</th>
                  <th className="py-3.5 px-4">Preferred Hotel & Room</th>
                  <th className="py-3.5 px-4">High-Touch Preference</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-sm">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-stone-500">
                      No guest profiles found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-stone-800/40 transition group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-900/40 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-sm">
                            {guest.firstName[0]}
                            {guest.lastName[0]}
                          </div>
                          <div>
                            <Link
                              href={`/guests/${guest.id}`}
                              className="font-semibold text-stone-100 group-hover:text-amber-300 transition flex items-center space-x-1.5"
                            >
                              <span>
                                {guest.firstName} {guest.lastName}
                              </span>
                            </Link>
                            <div className="flex items-center space-x-3 text-xs text-stone-400 mt-0.5">
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-stone-500" />
                                <span>{guest.email}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-stone-500" />
                                <span>{guest.phone}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getTierBadgeStyle(
                            guest.vipTier
                          )}`}
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>{guest.vipTier}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-amber-300">
                          ${guest.lifetimeSpend.toLocaleString()}
                        </div>
                        <div className="text-xs text-stone-400">ADR: ${guest.averageDailyRate}/n</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-stone-200 font-medium">
                          {guest.totalStays} Stays
                        </div>
                        <div className="text-xs text-stone-400">{guest.totalNights} Nights Total</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-medium text-stone-200 flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate max-w-[200px]">{guest.preferredProperty}</span>
                        </div>
                        <div className="text-xs text-stone-400 mt-0.5 truncate max-w-[200px]">
                          {guest.preferredRoomType}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs text-stone-300 italic truncate max-w-[220px]">
                          {guest.dietaryRestrictions || guest.pillowType || "No preferences logged"}
                        </div>
                        {guest.corporateCompanyName && (
                          <span className="inline-block mt-1 text-[10px] bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded border border-stone-700">
                            {guest.corporateCompanyName}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/guests/${guest.id}`}
                            className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                            title="View Guest 360 Dossier"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {
                              setGuestToEdit(guest);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id, `${guest.firstName} ${guest.lastName}`)}
                            className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete Guest Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-xl p-5 space-y-4 transition shadow-lg group relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-900/50 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-lg">
                    {guest.firstName[0]}
                    {guest.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-100 text-base group-hover:text-amber-300 transition">
                      {guest.firstName} {guest.lastName}
                    </h3>
                    <p className="text-xs text-stone-400">{guest.email}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getTierBadgeStyle(
                    guest.vipTier
                  )}`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{guest.vipTier}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-stone-950/60 p-3 rounded-lg border border-stone-800">
                <div>
                  <p className="text-stone-500">Lifetime Spend</p>
                  <p className="font-semibold text-amber-300 text-sm mt-0.5">
                    ${guest.lifetimeSpend.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Total Stays</p>
                  <p className="font-semibold text-stone-200 text-sm mt-0.5">
                    {guest.totalStays} ({guest.totalNights} Nights)
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-300">
                <p className="flex items-center space-x-1.5 text-stone-400">
                  <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{guest.preferredProperty}</span>
                </p>
                <p className="flex items-center space-x-1.5 text-stone-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{guest.preferredRoomType}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <Link
                  href={`/guests/${guest.id}`}
                  className="font-medium text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>View 360° Profile Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setGuestToEdit(guest);
                      setIsModalOpen(true);
                    }}
                    className="p-1 text-stone-400 hover:text-stone-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(guest.id, `${guest.firstName} ${guest.lastName}`)}
                    className="p-1 text-stone-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <GuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshGuests}
        guestToEdit={guestToEdit}
      />
    </div>
  );
}
