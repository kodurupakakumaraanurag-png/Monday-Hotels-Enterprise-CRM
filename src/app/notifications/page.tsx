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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-[#1E293B]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Enterprise Notification Center</h1>
            <p className="text-sm text-[#64748B]">Real-Time Operational Alerts, SLA Warnings & VIP Check-In Events</p>
          </div>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-white hover:bg-[#F8F6F0] border border-[#E2E8F0] text-[#1E4D3B] text-xs font-semibold rounded-lg shadow-sm transition"
        >
          Mark All as Read
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-3 shadow-sm">
        {items.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg border transition flex items-start justify-between ${
              n.read
                ? "bg-[#F8F6F0]/60 border-[#E2E8F0] opacity-75"
                : "bg-white border-[#C5A059]/40 shadow-sm"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-[#E8F0EC] text-[#1E4D3B] font-bold px-2 py-0.5 rounded border border-[#A8C3B2]">
                  {n.type}
                </span>
                <h4 className="font-semibold text-[#1E293B] text-sm">{n.title}</h4>
              </div>
              <p className="text-xs text-[#64748B]">{n.message}</p>
            </div>

            <span className="text-xs text-[#64748B] flex items-center space-x-1 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>{n.timestamp}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
