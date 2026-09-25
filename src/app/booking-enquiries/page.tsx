"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Clock,
  Building2,
  DollarSign,
  TrendingUp,
  User,
  CheckCircle2,
  ArrowRightLeft,
  XCircle,
  Edit2,
  Phone,
  Mail,
} from "lucide-react";
import {
  getEnquiries,
  updateEnquiryStatus,
  assignEnquiryStaff,
  BookingEnquiry,
} from "@/lib/services/reservation-service";
import { EnquiryStatusType } from "@/lib/validations/reservation-schema";
import { EnquiryFormModal } from "@/components/reservations/enquiry-form-modal";
import { ConvertEnquiryModal } from "@/components/reservations/convert-enquiry-modal";

export default function BookingEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>(() => getEnquiries());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProperty, setSelectedProperty] = useState<string>("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [enquiryToEdit, setEnquiryToEdit] = useState<BookingEnquiry | undefined>(undefined);
  const [enquiryToConvert, setEnquiryToConvert] = useState<BookingEnquiry | null>(null);

  const refreshEnquiries = () => {
    setEnquiries([...getEnquiries()]);
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.enquiryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.corporateClient && enq.corporateClient.toLowerCase().includes(searchQuery.toLowerCase())) ||
      enq.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || enq.status === selectedStatus;
    const matchesProperty = selectedProperty === "ALL" || enq.property === selectedProperty;

    return matchesSearch && matchesStatus && matchesProperty;
  });

  const totalValue = filteredEnquiries.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const handleStatusChange = (id: string, newStatus: EnquiryStatusType) => {
    updateEnquiryStatus(id, newStatus);
    refreshEnquiries();
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold";
      case "NEW":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold";
      case "QUOTATION":
      case "NEGOTIATION":
        return "bg-purple-500/10 text-purple-300 border border-purple-500/30";
      case "CANCELLED":
      case "LOST":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
      default:
        return "bg-stone-800 text-stone-300 border border-stone-700";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Booking Enquiries & SLA Queue
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Inbound Reservation Inquiries, Web Form Requests, Group Quotations & Conversion Workflows
          </p>
        </div>

        <button
          onClick={() => {
            setEnquiryToEdit(undefined);
            setIsAddModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Inbound Enquiry</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Inbound Enquiries</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{enquiries.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Enquiry Pipeline Value</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">${totalValue.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Confirmed Conversions</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {enquiries.filter((e) => e.status === "CONFIRMED").length} Confirmed
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Avg Response SLA</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">18 mins</h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, guest name, company..."
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
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="QUOTATION">QUOTATION</option>
              <option value="NEGOTIATION">NEGOTIATION</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
          >
            <option value="ALL">All Properties</option>
            <option value="Monday Hotels Grand Royale Mumbai">Monday Hotels Grand Royale Mumbai</option>
            <option value="Monday Hotels Resort & Spa Goa">Monday Hotels Resort & Spa Goa</option>
            <option value="Monday Hotels Palace Udaipur">Monday Hotels Palace Udaipur</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Ref & Guest Name</th>
                <th className="py-3.5 px-4">Target Property</th>
                <th className="py-3.5 px-4">Stay Dates & Guests</th>
                <th className="py-3.5 px-4">Est. Value ($)</th>
                <th className="py-3.5 px-4">Assigned Staff</th>
                <th className="py-3.5 px-4">Status Lifecycle</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {enq.enquiryNumber}
                      </span>
                      <span className="font-semibold text-stone-100">{enq.guest}</span>
                    </div>
                    {enq.corporateClient && (
                      <div className="text-xs text-stone-400 mt-1 flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-amber-500" />
                        <span>{enq.corporateClient}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-stone-200">
                    {enq.property}
                    <div className="text-stone-400 text-[11px]">{enq.roomType}</div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-300">
                    <div>{enq.checkInDate} to {enq.checkOutDate}</div>
                    <div className="text-stone-500 text-[11px]">{enq.numberOfGuests} Guests</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-amber-300">
                    ${enq.estimatedValue.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-300">
                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{enq.assignedStaff}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatusType)}
                      className={`text-xs rounded px-2 py-1 font-semibold focus:outline-none ${getStatusBadgeStyle(enq.status)}`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUALIFIED">QUALIFIED</option>
                      <option value="QUOTATION">QUOTATION</option>
                      <option value="NEGOTIATION">NEGOTIATION</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {enq.status !== "CONFIRMED" && (
                        <button
                          onClick={() => setEnquiryToConvert(enq)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-bold text-xs rounded-lg shadow transition"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Convert to Reservation</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEnquiryToEdit(enq);
                          setIsAddModalOpen(true);
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

      {/* Modals */}
      <EnquiryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={refreshEnquiries}
        enquiryToEdit={enquiryToEdit}
      />

      <ConvertEnquiryModal
        isOpen={!!enquiryToConvert}
        onClose={() => setEnquiryToConvert(null)}
        onSuccess={refreshEnquiries}
        enquiry={enquiryToConvert}
      />
    </div>
  );
}
