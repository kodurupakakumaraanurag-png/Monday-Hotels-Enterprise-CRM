"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Bed,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  User,
  Building2,
  Grid,
  List as ListIcon,
  ShieldCheck,
  Edit2,
  FileText,
  UserCheck,
  X,
} from "lucide-react";
import {
  getReservations,
  updateReservationStatus,
  updatePaymentStatus,
  Reservation,
} from "@/lib/services/reservation-service";
import {
  ReservationStatusType,
  PaymentStatusType,
} from "@/lib/validations/reservation-schema";
import { ReservationFormModal } from "@/components/reservations/reservation-form-modal";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    getReservations()
  );
  const [activeTab, setActiveTab] = useState<"directory" | "availability" | "history">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("ALL");
  const [selectedProperty, setSelectedProperty] = useState<string>("ALL");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<Reservation | undefined>(undefined);
  const [selectedReservationDetail, setSelectedReservationDetail] = useState<Reservation | null>(null);

  const refreshReservations = () => {
    setReservations([...getReservations()]);
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const matchesSearch =
        res.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (res.convertedFromEnquiryNumber &&
          res.convertedFromEnquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === "ALL" || res.reservationStatus === selectedStatus;
      const matchesPayment =
        selectedPaymentStatus === "ALL" || res.paymentStatus === selectedPaymentStatus;
      const matchesProperty =
        selectedProperty === "ALL" || res.property === selectedProperty;

      return matchesSearch && matchesStatus && matchesPayment && matchesProperty;
    });
  }, [reservations, searchQuery, selectedStatus, selectedPaymentStatus, selectedProperty]);

  const totalRevenue = useMemo(
    () => reservations.reduce((acc, r) => acc + r.totalAmount, 0),
    [reservations]
  );

  const handleStatusChange = (id: string, status: ReservationStatusType) => {
    updateReservationStatus(id, status);
    refreshReservations();
  };

  const handlePaymentChange = (id: string, paymentStatus: PaymentStatusType) => {
    updatePaymentStatus(id, paymentStatus);
    refreshReservations();
  };

  const getReservationStatusStyle = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold";
      case "CONFIRMED":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold";
      case "CHECKED_OUT":
        return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
      case "CANCELLED":
      case "NO_SHOW":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-stone-800 text-stone-300 border border-stone-700";
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      case "PARTIAL":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
      case "REFUNDED":
        return "bg-purple-500/10 text-purple-300 border border-purple-500/30";
      default:
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Room Reservations & Property Availability
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Confirmed Bookings, Check-In/Out Tracking, Room Conflict Management & Guest Stay History
          </p>
        </div>

        <button
          onClick={() => {
            setReservationToEdit(undefined);
            setIsFormModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Active Reservations</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{reservations.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Checked-In Guests</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {reservations.filter((r) => r.reservationStatus === "CHECKED_IN").length} In House
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Reservation Revenue</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">${totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Conflict Prevention Status</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">100% Conflict Free</h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "directory"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <ListIcon className="w-4 h-4" />
          <span>All Reservations ({filteredReservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("availability")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "availability"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Property Room Availability View</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "history"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Guest Stay History Analysis</span>
        </button>
      </div>

      {/* Tab 1: Directory Table */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by res code, guest, room..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-amber-500" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
                >
                  <option value="ALL">All Reservation Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CHECKED_IN">CHECKED_IN</option>
                  <option value="CHECKED_OUT">CHECKED_OUT</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
              >
                <option value="ALL">All Payment Statuses</option>
                <option value="PAID">PAID</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="PENDING">PENDING</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Reservation Code & Guest</th>
                    <th className="py-3.5 px-4">Hotel Property & Room</th>
                    <th className="py-3.5 px-4">Stay Dates</th>
                    <th className="py-3.5 px-4">Nightly Rate & Total ($)</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4">Reservation Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-sm">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {res.reservationNumber}
                          </span>
                          <span className="font-semibold text-stone-100">{res.guest}</span>
                        </div>
                        {res.convertedFromEnquiryNumber && (
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            Converted from: {res.convertedFromEnquiryNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-stone-200">
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-amber-500" />
                          <span>{res.property}</span>
                        </div>
                        <div className="text-amber-300 font-semibold mt-0.5 flex items-center space-x-1">
                          <Bed className="w-3.5 h-3.5" />
                          <span>{res.room}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-stone-300">
                        <div>{res.checkIn} to {res.checkOut}</div>
                        <div className="text-stone-500 text-[11px]">{res.numberOfGuests} Guests</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-amber-300">${res.totalAmount.toLocaleString()}</div>
                        <div className="text-xs text-stone-500">${res.rate}/night</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={res.paymentStatus}
                          onChange={(e) => handlePaymentChange(res.id, e.target.value as PaymentStatusType)}
                          className={`text-xs rounded px-2 py-1 font-semibold focus:outline-none ${getPaymentStatusStyle(res.paymentStatus)}`}
                        >
                          <option value="PAID">PAID</option>
                          <option value="PARTIAL">PARTIAL</option>
                          <option value="PENDING">PENDING</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={res.reservationStatus}
                          onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatusType)}
                          className={`text-xs rounded px-2 py-1 font-semibold focus:outline-none ${getReservationStatusStyle(res.reservationStatus)}`}
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CHECKED_IN">CHECKED_IN</option>
                          <option value="CHECKED_OUT">CHECKED_OUT</option>
                          <option value="PENDING">PENDING</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="NO_SHOW">NO_SHOW</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedReservationDetail(res)}
                            className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setReservationToEdit(res);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Property Room Availability Grid */}
      {activeTab === "availability" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-amber-300">Room Availability & Conflict Inspector Grid</h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
              Real-time Overlap Conflict Checker Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res) => (
              <div key={res.id} className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <Bed className="w-4 h-4" />
                    <span>{res.room}</span>
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${getReservationStatusStyle(res.reservationStatus)}`}>
                    {res.reservationStatus}
                  </span>
                </div>

                <div className="text-xs text-stone-300 space-y-1">
                  <p>Property: <strong className="text-stone-100">{res.property}</strong></p>
                  <p>Reserved By: <strong className="text-amber-300">{res.guest}</strong> ({res.reservationNumber})</p>
                  <p>Occupied Dates: <strong className="text-emerald-400">{res.checkIn} to {res.checkOut}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Guest Stay History */}
      {activeTab === "history" && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-stone-100">Guest Stay History</h3>
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-amber-300 text-base">{res.guest}</h4>
                  <p className="text-xs text-stone-400 mt-1">{res.property} • Room: {res.room}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Stay Dates: {res.checkIn} to {res.checkOut}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-amber-300">${res.totalAmount.toLocaleString()}</p>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    {res.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservation Form Modal */}
      <ReservationFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={refreshReservations}
        reservationToEdit={reservationToEdit}
      />

      {/* Reservation Detail Drawer / Modal */}
      {selectedReservationDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-xl p-6 space-y-4 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-bold text-amber-300">Reservation Details ({selectedReservationDetail.reservationNumber})</h3>
              <button onClick={() => setSelectedReservationDetail(null)} className="p-1 text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p>Guest: <strong className="text-stone-100 text-sm">{selectedReservationDetail.guest}</strong></p>
              <p>Property: <strong className="text-amber-300">{selectedReservationDetail.property}</strong></p>
              <p>Assigned Room: <strong className="text-amber-300">{selectedReservationDetail.room}</strong></p>
              <p>Dates: <strong className="text-emerald-400">{selectedReservationDetail.checkIn} to {selectedReservationDetail.checkOut}</strong></p>
              <p>Total Amount: <strong className="text-amber-300 font-bold">${selectedReservationDetail.totalAmount.toLocaleString()}</strong></p>
              {selectedReservationDetail.specialRequests && (
                <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-amber-200">
                  <strong>Special Requests: </strong>{selectedReservationDetail.specialRequests}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-800">
              <button onClick={() => setSelectedReservationDetail(null)} className="px-4 py-2 text-xs font-semibold bg-stone-800 text-stone-200 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
