"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  getCompanyById,
  getContactsByCompanyId,
  createContact,
  B2BContactRecord,
} from "@/lib/services/corporate-service";
import { getLeads } from "@/lib/services/lead-service";
import { contactSchema, ContactFormData } from "@/lib/validations/corporate-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Users,
  DollarSign,
  Globe,
  MapPin,
  ArrowLeft,
  Plus,
  Mail,
  Phone,
  BedDouble,
  ShieldCheck,
  Award,
  ArrowUpRight,
  X
} from "lucide-react";
import Link from "next/link";

export default function CorporateDetailPage() {
  const params = useParams();
  const companyId = params.id as string;
  const company = getCompanyById(companyId);

  const [activeTab, setActiveTab] = useState<"contacts" | "leads" | "bookings" | "notes">("contacts");
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  // Relational data lookups using foreign keys
  const linkedContacts = getContactsByCompanyId(companyId);
  const linkedLeads = getLeads().filter(
    (l) => l.companyName.toLowerCase().includes(company?.name.toLowerCase() || "")
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      companyId: companyId,
      firstName: "",
      lastName: "",
      email: "",
      phone: "+91 98000 11223",
      designation: "Executive Contact",
      contactType: "PRIMARY",
      isPrimaryContact: false,
    },
  });

  if (!company) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-200">Corporate Account Not Found</h2>
        <p className="text-xs text-slate-400">Account ID ({companyId}) does not exist in the CRM database.</p>
        <Link href="/corporate" className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Return to Corporate Directory
        </Link>
      </div>
    );
  }

  const handleAddContactSubmit = (data: ContactFormData) => {
    createContact(data);
    setShowAddContactModal(false);
    reset();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title={`${company.name} (${company.corporateCode})`}
        subtitle={`${company.industry} • ${company.city}, ${company.country}`}
        breadcrumbs={[
          { label: "Commercial CRM" },
          { label: "Corporate Clients", href: "/corporate" },
          { label: company.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/corporate"
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Accounts
            </Link>
          </div>
        }
      />

      {/* Hero Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {company.corporateCode}
            </span>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
              {company.contractDiscountPct}% Negotiated Discount
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              {company.status}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-100">{company.name}</h2>
          <p className="text-xs text-slate-400">
            Account Manager: <strong className="text-slate-200">{company.accountManager}</strong> • Address:{" "}
            <span className="text-slate-300">{company.address}, {company.city}</span>
          </p>
        </div>

        {/* Spend Overview Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center shrink-0 min-w-[200px]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Contract Spend</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">${company.totalSpend.toLocaleString()}</div>
          <div className="text-[11px] text-amber-400 font-semibold mt-1">{company.totalRoomNights} Room Nights</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-800 flex items-center gap-2 text-xs font-medium">
        {[
          { id: "contacts", label: `Associated B2B Contacts (${linkedContacts.length})` },
          { id: "leads", label: `Linked Sales Leads (${linkedLeads.length})` },
          { id: "bookings", label: "Booking History & Spend" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 border-b-2 transition-all font-semibold ${
              activeTab === tab.id
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Associated Contacts (Foreign Key Linked) */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">B2B Individual Contacts at {company.name}</h3>
            <button
              onClick={() => setShowAddContactModal(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Contact to Company
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedContacts.map((cnt) => (
              <div key={cnt.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {cnt.id}
                  </span>
                  {cnt.isPrimaryContact && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400">
                      Primary Contact
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{cnt.firstName} {cnt.lastName}</h4>
                  <p className="text-xs text-slate-400">{cnt.designation}</p>
                </div>

                <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{cnt.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{cnt.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Linked Leads */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Associated Sales Leads & RFPs</h3>
          <div className="space-y-3">
            {linkedLeads.map((lead) => (
              <div key={lead.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-100 text-sm">{lead.companyName}</div>
                  <p className="text-slate-400 mt-0.5">POC: {lead.contactPocName} • Target: {lead.targetProperty}</p>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-400">${lead.estimatedValue?.toLocaleString()}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {lead.pipelineStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">Add B2B Contact to {company.name}</h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleAddContactSubmit)} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">First Name *</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="e.g. Vikram"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Last Name *</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="e.g. Malhotra"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Designation / Role *</label>
                <input
                  type="text"
                  {...register("designation")}
                  placeholder="e.g. Corporate Travel Manager"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email *</label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="email@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone *</label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
