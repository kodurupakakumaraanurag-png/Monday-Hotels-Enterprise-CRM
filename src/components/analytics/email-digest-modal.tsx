"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Clock,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  Settings2,
  Calendar,
  Sparkles,
  AlertCircle,
  Bell,
  Play,
  Pause,
} from "lucide-react";
import {
  EmailDigestSubscription,
  getScheduledDigests,
  saveScheduledDigest,
  deleteScheduledDigest,
  toggleScheduledDigestStatus,
  generateEmailDigestHTML,
  ReportMetricSummary,
} from "@/lib/services/report-export-service";

interface EmailDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTabTitle: string;
  metrics: ReportMetricSummary[];
  tableHeaders: string[];
  tableRows: (string | number)[][];
}

export function EmailDigestModal({
  isOpen,
  onClose,
  activeTabTitle,
  metrics,
  tableHeaders,
  tableRows,
}: EmailDigestModalProps) {
  const [subscriptions, setSubscriptions] = useState<EmailDigestSubscription[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"NEW" | "MANAGEMENT" | "PREVIEW">("NEW");

  // Form State for New Subscription
  const [title, setTitle] = useState<string>(`Automated ${activeTabTitle} Executive Digest`);
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("WEEKLY");
  const [recipientEmails, setRecipientEmails] = useState<string>("gm-delhi@mondayhotels.com, sales-vp@mondayhotels.com");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Sync subscriptions list on load
  useEffect(() => {
    if (isOpen) {
      setSubscriptions(getScheduledDigests());
      setTitle(`Automated ${activeTabTitle} Executive Digest`);
    }
  }, [isOpen, activeTabTitle]);

  if (!isOpen) return null;

  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const emailsArr = recipientEmails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailsArr.length === 0) {
      setStatusMsg("Please enter at least one valid recipient email address.");
      return;
    }

    saveScheduledDigest({
      title,
      frequency,
      recipientEmails: emailsArr,
      metricsIncluded: metrics.map((m) => m.label),
      activeTab: activeTabTitle,
      status: "ACTIVE",
      lastSentAt: undefined,
    });

    setSubscriptions(getScheduledDigests());
    setStatusMsg("Automated Email Digest schedule saved successfully!");
    setTimeout(() => {
      setStatusMsg(null);
      setActiveSubTab("MANAGEMENT");
    }, 1200);
  };

  const handleDelete = (id: string) => {
    const updated = deleteScheduledDigest(id);
    setSubscriptions(updated);
  };

  const handleToggle = (id: string) => {
    const updated = toggleScheduledDigestStatus(id);
    setSubscriptions(updated);
  };

  const handleSendTestNow = () => {
    setStatusMsg("Test digest email dispatched successfully to " + recipientEmails);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const emailHtmlPreview = generateEmailDigestHTML(title, frequency, metrics, tableHeaders, tableRows);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative text-[#1E293B]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#E8F0EC] border border-[#A8C3B2] rounded-xl text-[#1E4D3B]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B]">Automated Email Digest Scheduler</h2>
              <p className="text-xs text-[#64748B]">Configure recurring email dispatches for key executive metrics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F6F0] rounded-lg text-[#64748B] hover:text-[#1E293B] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMsg && (
          <div className="bg-[#E8F0EC] border border-[#A8C3B2] text-[#1E4D3B] px-4 py-3 rounded-xl text-xs flex items-center justify-between font-semibold">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1E4D3B]" />
              <span>{statusMsg}</span>
            </div>
          </div>
        )}

        {/* Tab Selection Bar */}
        <div className="flex border-b border-[#E2E8F0] space-x-2 pb-2">
          <button
            onClick={() => setActiveSubTab("NEW")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-2 ${
              activeSubTab === "NEW" ? "bg-[#1E4D3B] text-white" : "bg-[#F8F6F0] text-[#1E293B] hover:bg-[#E8F0EC]"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Subscription</span>
          </button>
          <button
            onClick={() => setActiveSubTab("MANAGEMENT")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-2 ${
              activeSubTab === "MANAGEMENT" ? "bg-[#1E4D3B] text-white" : "bg-[#F8F6F0] text-[#1E293B] hover:bg-[#E8F0EC]"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Active Schedules ({subscriptions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("PREVIEW")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-2 ${
              activeSubTab === "PREVIEW" ? "bg-[#1E4D3B] text-white" : "bg-[#F8F6F0] text-[#1E293B] hover:bg-[#E8F0EC]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>HTML Email Preview</span>
          </button>
        </div>

        {/* Tab 1: Create New Digest */}
        {activeSubTab === "NEW" && (
          <form onSubmit={handleSaveSubscription} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E293B]">Digest Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E293B]">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B] cursor-pointer"
                >
                  <option value="DAILY">Daily (Every morning at 8:00 AM)</option>
                  <option value="WEEKLY">Weekly (Mondays at 9:00 AM)</option>
                  <option value="MONTHLY">Monthly (1st of every Month)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Recipient Email Addresses (Comma Separated)</label>
              <input
                type="text"
                value={recipientEmails}
                onChange={(e) => setRecipientEmails(e.target.value)}
                required
                placeholder="gm@mondayhotels.com, sales-vp@mondayhotels.com"
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              />
            </div>

            {/* Selected Metrics Summary */}
            <div className="bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-[#1E293B] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1E4D3B]" />
                <span>Auto-Captured KPI Metrics to Include:</span>
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {metrics.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#1E293B] text-[11px] font-semibold rounded-lg"
                  >
                    {m.label}: <strong className="text-[#1E4D3B]">{m.value}</strong>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleSendTestNow}
                className="px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8F6F0] text-[#1E293B] text-xs font-bold rounded-xl flex items-center space-x-2 transition"
              >
                <Send className="w-3.5 h-3.5 text-[#1E4D3B]" />
                <span>Send Test Email Now</span>
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1E4D3B] hover:bg-[#163B2D] text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition"
              >
                <Clock className="w-4 h-4" />
                <span>Schedule Recurring Digest</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Manage Active Schedules */}
        {activeSubTab === "MANAGEMENT" && (
          <div className="space-y-3">
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-[#64748B] text-xs">No email digest schedules configured yet.</div>
            ) : (
              subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#1E293B] text-sm">{sub.title}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          sub.status === "ACTIVE"
                            ? "bg-[#E8F0EC] border border-[#A8C3B2] text-[#1E4D3B]"
                            : "bg-amber-100 border border-amber-300 text-amber-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">
                      Frequency: <strong>{sub.frequency}</strong> • Recipients: {sub.recipientEmails.join(", ")}
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Last Sent: {sub.lastSentAt || "Pending next schedule"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleToggle(sub.id)}
                      className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8F6F0] text-[#1E293B] rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      {sub.status === "ACTIVE" ? <Pause className="w-3.5 h-3.5 text-[#1E4D3B]" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{sub.status === "ACTIVE" ? "Pause" : "Resume"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded-lg text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: HTML Email Preview */}
        {activeSubTab === "PREVIEW" && (
          <div className="space-y-3">
            <div className="text-xs text-[#64748B] flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#1E4D3B]" />
              <span>Live rendered HTML Email payload sent to executive recipients:</span>
            </div>
            <div
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 max-h-[400px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: emailHtmlPreview }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
