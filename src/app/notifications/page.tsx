"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Crown, DollarSign, Clock } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "Deal" | "VIP" | "SLA" | "System";
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NTF-01",
    title: "High-Value RFP Contract Closed",
    message: "Reliance Enterprise Solutions approved $145,000 corporate agreement.",
    timestamp: "10 mins ago",
    read: false,
    type: "Deal",
  },
  {
    id: "NTF-02",
    title: "Black Diamond VIP Arrival Alert",
    message: "Dr. Vikramaditya Singhania checked into Presidential Sky Suite.",
    timestamp: "30 mins ago",
    read: false,
    type: "VIP",
  },
  {
    id: "NTF-03",
    title: "SLA Warning: Unassigned Lead",
    message: "HCL Tech Ltd lead requires staff assignment within 15 mins.",
    timestamp: "1 hour ago",
    read: true,
    type: "SLA",
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-100">Enterprise Notification Center</h1>
            <p className="text-sm text-stone-400">Real-Time Operational Alerts, SLA Warnings & VIP Check-In Events</p>
          </div>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold rounded-lg"
        >
          Mark All as Read
        </button>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3 shadow-xl">
        {items.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg border transition flex items-start justify-between ${
              n.read
                ? "bg-stone-950/40 border-stone-800/60 opacity-70"
                : "bg-stone-950 border-amber-500/30 shadow-md"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-amber-500/10 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                  {n.type}
                </span>
                <h4 className="font-semibold text-stone-100 text-sm">{n.title}</h4>
              </div>
              <p className="text-xs text-stone-300">{n.message}</p>
            </div>

            <span className="text-xs text-stone-500 flex items-center space-x-1 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{n.timestamp}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
