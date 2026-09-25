"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  MOCK_ENQUIRIES,
  BookingEnquiryItem,
  EnquiryStatus,
} from "@/lib/demo-data/reservations-data";
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
  BedDouble,
  ArrowUpRight,
  CheckCircle2,
  X,
  Mail,
  Phone
} from "lucide-react";

export default function BookingEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<BookingEnquiryItem[]>(MOCK_ENQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProperty, setSelectedProperty] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Enquiry Form State
  const [newGuestName, setNewGuestName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProperty, setNewProperty] = useState("Monday Beach Resort, Goa");
  const [newRooms, setNewRooms] = useState(25);
  const [newBudget, setNewBudget] = useState(35000);

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.enquiryCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || enq.status === selectedStatus;
    const matchesProp = selectedProperty === "ALL" || enq.property.includes(selectedProperty);

    return matchesSearch && matchesStatus && matchesProp;
  });

  const totalValue = filteredEnquiries.reduce((acc, curr) => acc + curr.estimatedBudget, 0);

  const handleConvert = (id: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "CONFIRMED", slaTimeLeft: "Completed" } : e))
    );
    alert("Enquiry successfully converted to confirmed reservation!");
  };

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newEmail) {
      alert("Please fill in guest name and email.");
      return;
    }

    const created: BookingEnquiryItem = {
      id: `enq-${Math.floor(200 + Math.random() * 800)}`,
      enquiryCode: `ENQ-2026-${Math.floor(900 + Math.random() * 99)}`,
      property: newProperty,
      guestName: newGuestName,
      email: newEmail,
      phone: "+91 98000 55443",
      checkInDate: "2026-11-20",
      checkOutDate: "2026-11-25",
      roomsRequested: Number(newRooms),
      guestsCount: Number(newRooms) * 2,
      estimatedBudget: Number(newBudget),
      specialRequests: "Submitted via CRM Booking Portal.",
      status: "NEW",
      slaTimeLeft: "45 mins remaining",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setEnquiries([created, ...enquiries]);
    setShowAddModal(false);
    setNewGuestName("");
    setNewEmail("");
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Booking Enquiries & SLA Queue"
        subtitle="Incoming Reservation Inquiries, Web Form Requests, Group Rates & SLA Countdown Timers"
        breadcrumbs={[{ label: "Core Operations" }, { label: "Booking Enquiries" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Enquiry</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Inbound Enquiries</span>
            <ClipboardList className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{enquiries.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +15.0% Inbound Growth
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg SLA Response Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">18 mins</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            -4 mins faster than target SLA
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">44.8%</div>
          <div className="text-[11px] text-blue-400 mt-1 font-semibold">
            Enquiry to Confirmed Booking
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Est. Enquiry Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">${totalValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Active Group Quotations
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
            placeholder="Search by enquiry code, guest name, or company..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Enquiry Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="QUOTATION">Quotation Sent</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="CONFIRMED">Confirmed</option>
          </select>

          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Properties</option>
            <option value="Goa">Monday Beach Resort</option>
            <option value="Jaipur">Monday Heritage Palace</option>
            <option value="Mumbai">Monday Luxury Suites</option>
            <option value="Delhi">Monday Grand Palace</option>
            <option value="Bengaluru">Monday Silicon Heights</option>
          </select>
        </div>
      </div>

      {/* Main Enquiries Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3 rounded-l-lg font-semibold">Enquiry Code & Guest</th>
              <th className="py-3 px-3 font-semibold">Target Property</th>
              <th className="py-3 px-3 font-semibold text-center">Room Count</th>
              <th className="py-3 px-3 font-semibold text-center">Stay Dates</th>
              <th className="py-3 px-3 font-semibold text-right">Est. Budget ($)</th>
              <th className="py-3 px-3 font-semibold text-center">SLA Timer</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-3 rounded-r-lg text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No booking enquiries match your filter parameters.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {enq.enquiryCode}
                      </span>
                      <div>
                        <div className="font-bold text-slate-100">{enq.guestName}</div>
                        <div className="text-[11px] text-slate-400">{enq.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-200 font-medium">{enq.property}</td>

                  <td className="py-3.5 px-3 text-center font-bold text-slate-100">{enq.roomsRequested} Rooms</td>

                  <td className="py-3.5 px-3 text-center text-slate-300">
                    {enq.checkInDate} to {enq.checkOutDate}
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400">
                    ${enq.estimatedBudget.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      {enq.slaTimeLeft}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                      enq.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    }`}>
                      {enq.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right space-x-1">
                    {enq.status !== "CONFIRMED" && (
                      <button
                        onClick={() => handleConvert(enq.id)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[11px] font-bold transition-colors shadow-sm"
                      >
                        Convert
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Reviewing enquiry ${enq.enquiryCode}`)}
                      className="p-1 text-slate-400 hover:text-slate-200"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Enquiry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Log Inbound Booking Enquiry</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Guest / Company Name</label>
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Oracle APAC Forum"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="contact@oracle.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Property</label>
                  <select
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Monday Beach Resort, Goa">Monday Beach Resort, Goa</option>
                    <option value="Monday Heritage Palace, Jaipur">Monday Heritage Palace, Jaipur</option>
                    <option value="Monday Luxury Suites, Mumbai">Monday Luxury Suites, Mumbai</option>
                    <option value="Monday Grand Palace, Delhi">Monday Grand Palace, Delhi</option>
                    <option value="Monday Silicon Heights, Bengaluru">Monday Silicon Heights, Bengaluru</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Rooms Requested</label>
                  <input
                    type="number"
                    value={newRooms}
                    onChange={(e) => setNewRooms(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Estimated Budget ($)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
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
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
