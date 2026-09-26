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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-100">Print & PDF Report Generator</h2>
              <p className="text-xs text-stone-400">Customize layout, executive commentary, and generate official document</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Container */}
        <div className="space-y-4">
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4 font-sans">
            {/* Report Banner Preview */}
            <div className="flex flex-col sm:flex-row justify-between border-b border-amber-500/40 pb-3 gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-stone-950 px-2 py-0.5 rounded tracking-wider">
                  MONDAY HOTELS ENTERPRISE
                </span>
                <h3 className="text-lg font-bold text-stone-100 mt-1">{reportData.title}</h3>
                <p className="text-xs text-stone-400">{reportData.subtitle || "Executive Portfolio Summary"}</p>
              </div>
              <div className="text-left sm:text-right text-xs text-stone-400 space-y-0.5">
                <div>
                  <span className="text-stone-500">Range: </span>
                  <span className="font-semibold text-stone-200">{reportData.dateRange}</span>
                </div>
                <div>
                  <span className="text-stone-500">Generated: </span>
                  <span className="font-semibold text-stone-200">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* KPI Cards Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reportData.metrics.map((m, idx) => (
                <div key={idx} className="bg-stone-900 border border-stone-800 rounded-lg p-3">
                  <div className="text-[10px] uppercase font-bold text-stone-400">{m.label}</div>
                  <div className="text-lg font-extrabold text-amber-400 mt-0.5">{m.value}</div>
                  {m.subtext && <div className="text-[10px] text-stone-500 truncate mt-0.5">{m.subtext}</div>}
                </div>
              ))}
            </div>

            {/* Data Rows Preview Info */}
            <div className="flex items-center justify-between text-xs text-stone-400 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>
                  Includes <strong>{reportData.tableRows.length}</strong> record rows across{" "}
                  <strong>{reportData.tableHeaders.length}</strong> data columns.
                </span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Print
              </span>
            </div>
          </div>

          {/* Executive Commentary Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Include Executive Commentary in PDF Header</span>
              </label>
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            {includeNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition"
                placeholder="Add custom notes or summary analysis for executive distribution..."
              />
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-stone-800 pt-4">
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Generates clean landscape document formatted for board presentation & PDF export</span>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePrintPDF}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition"
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
