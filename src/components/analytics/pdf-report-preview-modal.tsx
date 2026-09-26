"use client";

import React, { useState } from "react";
import { X, Printer, FileText, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { generatePDFPrint, PrintableReportData } from "@/lib/services/report-export-service";

interface PDFReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: PrintableReportData;
}

export function PDFReportPreviewModal({ isOpen, onClose, reportData }: PDFReportPreviewModalProps) {
  const [notes, setNotes] = useState<string>(
    "Portfolio yield performance continues on a strong upward trajectory in Q3 2026. Corporate account acquisition in Gurgaon & Cyber City boosted RevPAR by +14.2% YoY."
  );
  const [includeNotes, setIncludeNotes] = useState<boolean>(true);

  if (!isOpen) return null;

  const handlePrintPDF = () => {
    generatePDFPrint({
      ...reportData,
      executiveNotes: includeNotes ? notes : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative text-[#1E293B]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#E8F0EC] border border-[#A8C3B2] rounded-xl text-[#1E4D3B]">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#1E293B]">Print & PDF Report Generator</h2>
              <p className="text-xs text-[#64748B]">Customize layout, executive commentary, and generate official document</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#F8F6F0] rounded-lg text-[#64748B] hover:text-[#1E293B] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Container */}
        <div className="space-y-4">
          <div className="bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-5 space-y-4 font-sans">
            {/* Report Banner Preview */}
            <div className="flex flex-col sm:flex-row justify-between border-b border-[#A8C3B2] pb-3 gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-[#1E4D3B] text-white px-2 py-0.5 rounded tracking-wider">
                  MONDAY HOTELS ENTERPRISE
                </span>
                <h3 className="text-lg font-bold text-[#1E293B] mt-1">{reportData.title}</h3>
                <p className="text-xs text-[#64748B]">{reportData.subtitle || "Executive Portfolio Summary"}</p>
              </div>
              <div className="text-left sm:text-right text-xs text-[#64748B] space-y-0.5">
                <div>
                  <span className="text-[#64748B]">Range: </span>
                  <span className="font-semibold text-[#1E293B]">{reportData.dateRange}</span>
                </div>
                <div>
                  <span className="text-[#64748B]">Generated: </span>
                  <span className="font-semibold text-[#1E293B]">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* KPI Cards Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reportData.metrics.map((m, idx) => (
                <div key={idx} className="bg-white border border-[#E2E8F0] rounded-lg p-3">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">{m.label}</div>
                  <div className="text-lg font-extrabold text-[#1E4D3B] mt-0.5">{m.value}</div>
                  {m.subtext && <div className="text-[10px] text-[#64748B] truncate mt-0.5">{m.subtext}</div>}
                </div>
              ))}
            </div>

            {/* Data Rows Preview Info */}
            <div className="flex items-center justify-between text-xs text-[#64748B] bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#1E4D3B]" />
                <span>
                  Includes <strong>{reportData.tableRows.length}</strong> record rows across{" "}
                  <strong>{reportData.tableHeaders.length}</strong> data columns.
                </span>
              </div>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Print
              </span>
            </div>
          </div>

          {/* Executive Commentary Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1E293B] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#1E4D3B]" />
                <span>Include Executive Commentary in PDF Header</span>
              </label>
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="w-4 h-4 accent-[#1E4D3B] rounded cursor-pointer"
              />
            </div>
            {includeNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B] transition"
                placeholder="Add custom notes or summary analysis for executive distribution..."
              />
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-[#E2E8F0] pt-4">
          <div className="text-xs text-[#64748B] flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#1E4D3B]" />
            <span>Generates clean landscape document formatted for board presentation & PDF export</span>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8F6F0] text-[#1E293B] rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePrintPDF}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-[#1E4D3B] hover:bg-[#163B2D] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Generate & Print PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
