"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  MOCK_RESERVATIONS,
  ReservationItem,
  ReservationStatus,
  getReservationStatusBadge,
  getPaymentBadge,
  getVIPTierBadge,
} from "@/lib/demo-data/reservations-data";
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  BedDouble,
  CreditCard,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Clock,
  X,
  Building2,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  User
} from "lucide-react";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>(MOCK_RESERVATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProperty, setSelectedProperty] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Reservation Form State
  const [newGuestName, setNewGuestName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProperty, setNewProperty] = useState("Monday Grand Palace, Delhi");
  const [newRoomType, setNewRoomType] = useState("Executive Suite");
  const [newCheckIn, setNewCheckIn] = useState("2026-10-05");
  const [newCheckOut, setNewCheckOut] = useState("2026-10-09");
  const [newTotalAmount, setNewTotalAmount] = useState(2800);

  // Filtered reservations calculation
  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || res.status === selectedStatus;
    const matchesProp = selectedProperty === "ALL" || res.property.includes(selectedProperty);

    return matchesSearch && matchesStatus && matchesProp;
  });

  const totalBookedValue = filteredReservations.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Status Action Handlers
  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newEmail) {
      alert("Please enter guest name and email.");
      return;
    }

    const createdRes: ReservationItem = {
      id: `res-${Math.floor(100 + Math.random() * 900)}`,
      code: `RES-2026-${Math.floor(800 + Math.random() * 100)}`,
      property: newProperty,
      guestName: newGuestName,
      email: newEmail,
      phone: newPhone || "+91 98000 11223",
      roomType: newRoomType,
      roomNumber: `Room ${Math.floor(300 + Math.random() * 500)}`,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      adultsCount: 2,
      childrenCount: 0,
      totalAmount: Number(newTotalAmount),
      depositAmount: Number(newTotalAmount),
      status: "CONFIRMED",
      paymentStatus: "PAID",
      vipTier: "PLATINUM",
      specialRequests: "Created via Enterprise Reservations Manager.",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setReservations([createdRes, ...reservations]);
    setShowAddModal(false);
    setNewGuestName("");
    setNewEmail("");
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Reservations & Room Inventory Operations"
        subtitle="Guest Stay Bookings, Live Check-in Schedule, Room Assignment & Payment Guarantees"
        breadcrumbs={[{ label: "Core Operations" }, { label: "Reservations" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Booking</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Active Bookings</span>
            <CalendarDays className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{reservations.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +8.4% YoY Booking Growth
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Checked-In Guests</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {reservations.filter((r) => r.status === "CHECKED_IN").length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            Active Room Occupancy
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Booked Revenue Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">${totalBookedValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Guaranteed via PMS Integration
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pending Guarantees</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {reservations.filter((r) => r.status === "PENDING").length}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">
            Awaiting Pre-Authorization
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reservation code, guest name, or room number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Reservation Statuses</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending Guarantee</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Portfolio Hotels</option>
            <option value="Delhi">Monday Grand Palace</option>
            <option value="Mumbai">Monday Luxury Suites</option>
            <option value="Goa">Monday Beach Resort</option>
            <option value="Jaipur">Monday Heritage Palace</option>
            <option value="Bengaluru">Monday Silicon Heights</option>
          </select>
        </div>
      </div>

      {/* Main Reservations Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3 rounded-l-lg font-semibold">Booking Code & Guest</th>
              <th className="py-3 px-3 font-semibold">Property & Assigned Room</th>
              <th className="py-3 px-3 font-semibold text-center">Dates (Check-In / Out)</th>
              <th className="py-3 px-3 font-semibold text-center">Payment Status</th>
              <th className="py-3 px-3 font-semibold text-right">Total Amount ($)</th>
              <th className="py-3 px-3 font-semibold text-center">Reservation Status</th>
              <th className="py-3 px-3 rounded-r-lg text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No reservations match your filter query.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => {
                const statusBadge = getReservationStatusBadge(res.status);
                const paymentBadge = getPaymentBadge(res.paymentStatus);
                const vipBadge = getVIPTierBadge(res.vipTier);

                return (
                  <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {res.code}
                        </span>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{res.guestName}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border ${vipBadge.class}`}>
                              {vipBadge.label}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{res.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{res.property}</div>
                      <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>{res.roomNumber} ({res.roomType})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="font-semibold text-slate-200">{res.checkInDate}</div>
                      <div className="text-[10px] text-slate-400">to {res.checkOutDate}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${paymentBadge.class}`}>
                        {paymentBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400">
                      ${res.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right space-x-1">
                      {res.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleStatusChange(res.id, "CHECKED_IN")}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded text-[11px] font-bold transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {res.status === "CHECKED_IN" && (
                        <button
                          onClick={() => handleStatusChange(res.id, "CHECKED_OUT")}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded text-[11px] font-bold transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                      <button
                        onClick={() => alert(`Viewing full reservation dossier for ${res.code}`)}
                        className="p-1 text-slate-400 hover:text-slate-200"
                        title="View Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* New Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>New Reservation Wizard</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Guest Full Name</label>
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Vikramaditya Roy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Guest Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Property</label>
                  <select
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Monday Grand Palace, Delhi">Monday Grand Palace, Delhi</option>
                    <option value="Monday Luxury Suites, Mumbai">Monday Luxury Suites, Mumbai</option>
                    <option value="Monday Beach Resort, Goa">Monday Beach Resort, Goa</option>
                    <option value="Monday Heritage Palace, Jaipur">Monday Heritage Palace, Jaipur</option>
                    <option value="Monday Silicon Heights, Bengaluru">Monday Silicon Heights, Bengaluru</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Room Category</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                    <option value="Deluxe Ocean Villa">Deluxe Ocean Villa</option>
                    <option value="Heritage Royal Suite">Heritage Royal Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Check-In</label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Check-Out</label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Total Rate ($)</label>
                  <input
                    type="number"
                    value={newTotalAmount}
                    onChange={(e) => setNewTotalAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow-md shadow-amber-500/10"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
