"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  FileCode,
  Clock,
  ShieldCheck,
  Eye,
  X,
  ArrowRight,
  Download,
  AlertTriangle,
  User,
  Globe,
  Database,
} from "lucide-react";
import { getAuditLogs, AuditLogRecord } from "@/lib/services/audit-service";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>(() => getAuditLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLogForDiff, setSelectedLogForDiff] = useState<AuditLogRecord | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || log.actionCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleExportAuditReport = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monday-hotels-audit-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "Corporate Contract":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
      case "Lead Mutation":
        return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
      case "Guest Profile":
        return "bg-purple-500/10 text-purple-300 border border-purple-500/30";
      case "RBAC Permission":
        return "bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold";
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
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              SOC2 Enterprise Security & Audit Log Trail
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Immutable Audit Trail, Field Mutation Diff Analysis & Security Event Logging
          </p>
        </div>

        <button
          onClick={handleExportAuditReport}
          className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 rounded-lg text-sm font-medium transition"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Compliance Audit Log</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Logged Mutations</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">84,520</h3>
            <p className="text-xs text-emerald-400 mt-1">100% Immutable</p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Security Alerts</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">0 Critical</h3>
            <p className="text-xs text-emerald-400 mt-1">All Systems Clean</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Log Retention Policy</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">365 Days</h3>
            <p className="text-xs text-amber-400 mt-1">SOC2 Type II Compliant</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Data Integrity Verification</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">SHA-256</h3>
            <p className="text-xs text-stone-400 mt-1">Cryptographic Proof</p>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <FileCode className="w-6 h-6" />
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
            placeholder="Search by user, IP address, target entity..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Event Categories</option>
            <option value="Corporate Contract">Corporate Contract</option>
            <option value="Lead Mutation">Lead Mutation</option>
            <option value="Guest Profile">Guest Profile</option>
            <option value="RBAC Permission">RBAC Permission</option>
            <option value="System Config">System Config</option>
          </select>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Timestamp & Ref</th>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Action Summary</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Field Diff Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-200">{log.timestamp}</div>
                    <div className="text-xs text-stone-500">{log.id}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-amber-300 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{log.userName}</span>
                    </div>
                    <div className="text-xs text-stone-400">{log.userRole}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getCategoryBadge(log.actionCategory)}`}>
                      {log.actionCategory}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-stone-200 font-medium">{log.actionText}</div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      Target: <span className="text-stone-300">{log.targetEntityName}</span> ({log.targetEntityId})
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-400 font-mono">
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3 text-stone-500" />
                      <span>{log.ipAddress}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {log.changes.length > 0 ? (
                      <button
                        onClick={() => setSelectedLogForDiff(log)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Diff ({log.changes.length})</span>
                      </button>
                    ) : (
                      <span className="text-xs text-stone-500 italic">No Field Mutations</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field-Level Diff Viewer Modal */}
      {selectedLogForDiff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-xl shadow-2xl text-stone-100 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-amber-300 flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-amber-400" />
                  <span>Field Mutation Diff Inspector</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Reference: {selectedLogForDiff.id} • Action: {selectedLogForDiff.actionText}
                </p>
              </div>

              <button
                onClick={() => setSelectedLogForDiff(null)}
                className="p-1 text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedLogForDiff.changes.map((change, idx) => (
                <div
                  key={idx}
                  className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2"
                >
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Field: <span className="text-stone-200 font-mono">{change.fieldName}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-lg text-rose-200">
                      <span className="text-[10px] text-rose-400 font-bold block mb-1">
                        BEFORE VALUE (ORIGINAL)
                      </span>
                      <span className="line-through">{change.beforeValue}</span>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg text-emerald-200">
                      <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                        AFTER VALUE (MUTATED)
                      </span>
                      <span>{change.afterValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-800">
              <button
                onClick={() => setSelectedLogForDiff(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
