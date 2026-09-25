"use client";

import React from "react";
import { Activity, Clock, User, Building2, Crown, FileText, CheckCircle2 } from "lucide-react";

interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  category: "B2B Sales" | "Guest Experience" | "Revenue" | "Security";
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "ACT-01",
    timestamp: "10 mins ago",
    user: "Vikram Malhotra",
    role: "Corporate Sales Director",
    action: "Closed Won RFP Opportunity ($145,000)",
    entity: "Reliance Tech Leadership Summit 2026",
    category: "B2B Sales",
  },
  {
    id: "ACT-02",
    timestamp: "25 mins ago",
    user: "Priya Sharma",
    role: "Hotel General Manager",
    action: "Upgraded VIP Loyalty Tier to Black Diamond",
    entity: "Dr. Vikramaditya Singhania",
    category: "Guest Experience",
  },
  {
    id: "ACT-03",
    timestamp: "1 hour ago",
    user: "Ayesha Mukherjee",
    role: "Revenue Manager",
    action: "Adjusted Weekend Suite Yield Rates (+8.5%)",
    entity: "Monday Hotels Grand Royale Mumbai",
    category: "Revenue",
  },
  {
    id: "ACT-04",
    timestamp: "3 hours ago",
    user: "Anurag Kodurupa",
    role: "Super Admin",
    action: "Enforced Multi-Factor Authentication (MFA)",
    entity: "Staff Security Policy #88",
    category: "Security",
  },
];

export default function ActivitiesPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      <div className="flex items-center space-x-3 border-b border-stone-800 pb-5">
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-100">Unified System Activity Stream</h1>
          <p className="text-sm text-stone-400">Real-Time Enterprise Mutation Log & Staff Audit Activity</p>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4 shadow-xl">
        <div className="space-y-4">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="bg-stone-950 border border-stone-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-amber-500/10 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    {act.category}
                  </span>
                  <span className="text-stone-300 font-medium">{act.user}</span>
                  <span className="text-stone-500">({act.role})</span>
                </div>
                <h4 className="font-semibold text-stone-100 text-sm mt-1">{act.action}</h4>
                <p className="text-xs text-amber-300">{act.entity}</p>
              </div>

              <div className="text-xs text-stone-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
