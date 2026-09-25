"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getContactsByCompanyId,
  CorporateCompanyRecord,
} from "@/lib/services/corporate-service";
import { companySchema, CompanyFormData, CompanyStatus } from "@/lib/validations/corporate-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Search,
  Filter,
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  MapPin,
  Percent,
  X,
  ArrowUpRight,
  Edit2,
  Trash2,
  ShieldCheck,
  Award
} from "lucide-react";
import Link from "next/link";

export default function CorporatePage() {
  const [companies, setCompanies] = useState<CorporateCompanyRecord[]>(getCompanies());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CorporateCompanyRecord | null>(null);

  const refreshCompanies = () => {
    setCompanies([...getCompanies()]);
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.corporateCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;
    const matchesIndustry = selectedIndustry === "ALL" || c.industry.includes(selectedIndustry);

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const totalContractSpend = filteredCompanies.reduce((acc, curr) => acc + curr.totalSpend, 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      industry: "Technology & Software",
      website: "https://company.com",
      corporateCode: "CORP-2026-01",
      contractDiscountPct: 15,
      accountManager: "Priya Sharma (Sales Mgr)",
      address: "Business Park",
      city: "Bengaluru",
      country: "India",
      status: "ACTIVE",
    },
  });

  const handleCreateOrUpdate = (data: CompanyFormData) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, data);
    } else {
      createCompany(data);
    }
    refreshCompanies();
    setIsModalOpen(false);
    setEditingCompany(null);
    reset();
  };

  const handleEdit = (comp: CorporateCompanyRecord) => {
    setEditingCompany(comp);
    reset(comp);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this Corporate Account and un-link all associated contacts?")) {
      deleteCompany(id);
      refreshCompanies();
    }
  };

  const getStatusBadge = (status: CompanyStatus) => {
    switch (status) {
      case "VIP_ACCOUNT":
        return { label: "VIP Account", class: "bg-purple-500/20 text-purple-300 border-purple-400 font-extrabold" };
      case "ACTIVE":
        return { label: "Active Account", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold" };
      case "PROSPECT":
        return { label: "Prospect", class: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "INACTIVE":
        return { label: "Inactive", class: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <PageHeader
        title="Corporate Client Management"
        subtitle="B2B Corporate Account Portfolios, Discount Rate Agreements, Company Profiles & Key Account Managers"
        breadcrumbs={[{ label: "Commercial CRM" }, { label: "Corporate Clients" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingCompany(null);
                reset({
                  name: "",
                  industry: "Technology & Software",
                  website: "https://company.com",
                  corporateCode: `CORP-2026-${Math.floor(10 + Math.random() * 89)}`,
                  contractDiscountPct: 15,
                  accountManager: "Priya Sharma (Sales Mgr)",
                  address: "Commercial Center",
                  city: "Mumbai",
                  country: "India",
                  status: "ACTIVE",
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Corporate Account</span>
            </button>
          </div>
        }
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Corporate B2B Accounts</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{companies.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14.2% YoY Growth
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Contracted Spend Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">${totalContractSpend.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Total B2B Spend
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg Corporate Discount</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">18.8%</div>
          <div className="text-[11px] text-purple-400 mt-1 font-semibold">
            Negotiated Contract Rate
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>VIP Accounts</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {companies.filter((c) => c.status === "VIP_ACCOUNT").length}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">
            High Spend Tier
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
            placeholder="Search accounts by company name, corporate code, or city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="VIP_ACCOUNT">VIP Accounts</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="PROSPECT">Prospects</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Industries</option>
            <option value="Technology">Technology & Software</option>
            <option value="Banking">Banking & Financial</option>
            <option value="Pharmaceuticals">Pharmaceuticals</option>
            <option value="Consulting">Management Consulting</option>
          </select>
        </div>
      </div>

      {/* Corporate Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3 rounded-l-lg font-semibold">Corporate Code & Company</th>
              <th className="py-3 px-3 font-semibold">Industry & City</th>
              <th className="py-3 px-3 font-semibold">Account Manager</th>
              <th className="py-3 px-3 font-semibold text-center">Contract Discount</th>
              <th className="py-3 px-3 font-semibold text-right">Total B2B Spend ($)</th>
              <th className="py-3 px-3 font-semibold text-center">Contacts</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-3 rounded-r-lg text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No corporate accounts match your search query.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((comp) => {
                const statusBadge = getStatusBadge(comp.status);
                const linkedContacts = getContactsByCompanyId(comp.id);

                return (
                  <tr key={comp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {comp.corporateCode}
                        </span>
                        <div>
                          <Link href={`/corporate/${comp.id}`} className="font-bold text-slate-100 hover:text-amber-400 transition-colors">
                            {comp.name}
                          </Link>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{comp.website || "No Website"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{comp.industry}</div>
                      <div className="text-[11px] text-slate-400">{comp.city}, {comp.country}</div>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-300">{comp.accountManager}</td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {comp.contractDiscountPct}% Off
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400">
                      ${comp.totalSpend.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-amber-400">
                      {linkedContacts.length} Contacts
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded border ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/corporate/${comp.id}`}
                          className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
                          title="View Company Dossier & Contacts"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(comp)}
                          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(comp.id)}
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>{editingCompany ? "Edit Corporate Account" : "Create Corporate Account"}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Company Name *</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. TechCorp Global Solutions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
                {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Industry *</label>
                  <input
                    type="text"
                    {...register("industry")}
                    placeholder="e.g. Technology & Software"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Corporate Code *</label>
                  <input
                    type="text"
                    {...register("corporateCode")}
                    placeholder="CORP-TC-2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Discount Rate (%) *</label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("contractDiscountPct", { valueAsNumber: true })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Account Status *</label>
                  <select
                    {...register("status")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="VIP_ACCOUNT">VIP Account</option>
                    <option value="ACTIVE">Active Account</option>
                    <option value="PROSPECT">Prospect</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">City *</label>
                  <input
                    type="text"
                    {...register("city")}
                    placeholder="Bengaluru"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Country *</label>
                  <input
                    type="text"
                    {...register("country")}
                    placeholder="India"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Website URL</label>
                <input
                  type="text"
                  {...register("website")}
                  placeholder="https://company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Address *</label>
                <input
                  type="text"
                  {...register("address")}
                  placeholder="Street Address or Business Park"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Account Manager *</label>
                <input
                  type="text"
                  {...register("accountManager")}
                  placeholder="Priya Sharma (Sales Mgr)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
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
                  Save Corporate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
