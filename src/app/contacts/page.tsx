"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  getContacts,
  getCompanies,
  createContact,
  updateContact,
  deleteContact,
  B2BContactRecord,
} from "@/lib/services/corporate-service";
import { contactSchema, ContactFormData, ContactType } from "@/lib/validations/corporate-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building2,
  X,
  Edit2,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<B2BContactRecord[]>(getContacts());
  const companies = getCompanies();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCompany, setSelectedCompany] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<B2BContactRecord | null>(null);

  const refreshContacts = () => {
    setContacts([...getContacts()]);
  };

  const filteredContacts = contacts.filter((cnt) => {
    const fullName = `${cnt.firstName} ${cnt.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      cnt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "ALL" || cnt.contactType === selectedType;
    const matchesComp = selectedCompany === "ALL" || cnt.companyId === selectedCompany;

    return matchesSearch && matchesType && matchesComp;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      companyId: companies[0]?.id || "COMP-101",
      firstName: "",
      lastName: "",
      email: "",
      phone: "+91 98000 11223",
      designation: "Corporate Manager",
      contactType: "PRIMARY",
      isPrimaryContact: true,
      notes: "",
    },
  });

  const handleCreateOrUpdate = (data: ContactFormData) => {
    if (editingContact) {
      updateContact(editingContact.id, data);
    } else {
      createContact(data);
    }
    refreshContacts();
    setIsModalOpen(false);
    setEditingContact(null);
    reset();
  };

  const handleEdit = (cnt: B2BContactRecord) => {
    setEditingContact(cnt);
    reset(cnt);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this B2B Contact record?")) {
      deleteContact(id);
      refreshContacts();
    }
  };

  const getTypeBadge = (type: ContactType) => {
    switch (type) {
      case "PRIMARY":
        return { label: "Primary Contact", class: "bg-amber-500/20 text-amber-300 border-amber-400 font-bold" };
      case "BILLING":
        return { label: "Billing & Finance", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "EVENT_PLANNER":
        return { label: "Event Planner", class: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
      case "EXECUTIVE":
        return { label: "Executive / C-Suite", class: "bg-sky-500/10 text-sky-400 border-sky-500/30" };
      default:
        return { label: "General Contact", class: "bg-slate-800 text-slate-300 border-slate-700" };
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="B2B Contact Directory"
        subtitle="Individual Corporate Representatives, Decision Makers, Event Planners & Billing POCs"
        breadcrumbs={[{ label: "Commercial CRM" }, { label: "Contacts" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingContact(null);
                reset({
                  companyId: companies[0]?.id || "COMP-101",
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "+91 98000 11223",
                  designation: "Corporate Manager",
                  contactType: "PRIMARY",
                  isPrimaryContact: false,
                  notes: "",
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New B2B Contact</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total B2B Contacts</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{contacts.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +16.5% YoY Contact Growth
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Primary Decision Makers</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {contacts.filter((c) => c.isPrimaryContact || c.contactType === "PRIMARY").length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            Key Corporate Account POCs
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Companies Represented</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{companies.length}</div>
          <div className="text-[11px] text-purple-400 mt-1 font-semibold">
            Active Accounts
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
            placeholder="Search contacts by name, email, designation, or company..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Contact Types</option>
            <option value="PRIMARY">Primary Contact</option>
            <option value="EXECUTIVE">Executive / C-Suite</option>
            <option value="EVENT_PLANNER">Event Planner</option>
            <option value="BILLING">Billing & Finance</option>
          </select>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3 rounded-l-lg font-semibold">Contact Name & Role</th>
              <th className="py-3 px-3 font-semibold">Email & Phone</th>
              <th className="py-3 px-3 font-semibold">Associated Company</th>
              <th className="py-3 px-3 font-semibold text-center">Contact Type</th>
              <th className="py-3 px-3 rounded-r-lg text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No B2B contacts match your search query.
                </td>
              </tr>
            ) : (
              filteredContacts.map((cnt) => {
                const typeBadge = getTypeBadge(cnt.contactType);

                return (
                  <tr key={cnt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {cnt.id}
                        </span>
                        <div>
                          <div className="font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{cnt.firstName} {cnt.lastName}</span>
                            {cnt.isPrimaryContact && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{cnt.designation}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>{cnt.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cnt.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <Link
                        href={`/corporate/${cnt.companyId}`}
                        className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{cnt.companyName}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded border ${typeBadge.class}`}>
                        {typeBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(cnt)}
                          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cnt.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{editingContact ? "Edit B2B Contact" : "Create B2B Contact"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Associated Company *</label>
                <select
                  {...register("companyId")}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.corporateCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">First Name *</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    placeholder="e.g. Sunil"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  {errors.firstName && <p className="text-[11px] text-rose-400 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Last Name *</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    placeholder="e.g. Nair"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  {errors.lastName && <p className="text-[11px] text-rose-400 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Designation / Role *</label>
                <input
                  type="text"
                  {...register("designation")}
                  placeholder="e.g. VP Corporate Travel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="poc@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Contact Type *</label>
                  <select
                    {...register("contactType")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="PRIMARY">Primary Contact</option>
                    <option value="EXECUTIVE">Executive / C-Suite</option>
                    <option value="EVENT_PLANNER">Event Planner</option>
                    <option value="BILLING">Billing & Finance</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                    <input type="checkbox" {...register("isPrimaryContact")} className="rounded border-slate-800 bg-slate-950" />
                    <span>Primary Account POC</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shadow-md shadow-amber-500/10"
                >
                  Save B2B Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
