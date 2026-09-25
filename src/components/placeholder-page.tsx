import React from "react";
import { PageHeader, BreadcrumbItem } from "@/components/layout/page-header";
import { LucideIcon, ArrowUpRight, Clock, Layers, Sparkles, Plus } from "lucide-react";

interface QuickStat {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  phaseTarget: string;
  breadcrumbs: BreadcrumbItem[];
  stats?: QuickStat[];
  features?: string[];
}

export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
  phaseTarget,
  breadcrumbs,
  stats = [
    { label: "Active Records", value: "1,248", change: "+12.4%", isPositive: true },
    { label: "Pending Approvals", value: "14", change: "-2.1%", isPositive: true },
    { label: "Pipeline Value", value: "$840,500", change: "+8.6%", isPositive: true },
    { label: "CSAT Score", value: "4.8/5", change: "+0.3", isPositive: true },
  ],
  features = [
    "Real-time database integration via Supabase PostgreSQL",
    "Role-based staff permissions & action audit tracking",
    "Interactive filtering, sorting, and pagination tables",
    "Exportable reporting & PDF contract generator",
  ],
}: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        actions={
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-xs rounded-lg shadow-md shadow-amber-500/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create {title.replace(/s$/, "")}</span>
          </button>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{stat.label}</span>
              {stat.change && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                    stat.isPositive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Module Content Card Placeholder */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-6 lg:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-inner">
            <Icon className="w-7 h-7" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
            <Clock className="w-3 h-3" /> Scheduled for {phaseTarget}
          </span>

          <h2 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
            {title} Module Foundation Ready
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            The layout shell and routing structure for <strong className="text-slate-200">{title}</strong> are successfully established in Phase 1. Complete business logic and Supabase integration will be implemented in <strong className="text-amber-400">{phaseTarget}</strong>.
          </p>

          {/* Module Capabilities List */}
          <div className="w-full text-left bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 sm:p-5 mb-6">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Planned Module Features
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-400">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Phase 1 Infrastructure Active • Monday Hotels Enterprise CRM
          </div>
        </div>
      </div>
    </div>
  );
}
