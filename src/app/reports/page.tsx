"use client";

import React, { useState } from "react";
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Filter, FileSpreadsheet } from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Q3-2026");
  const [propertyFilter, setPropertyFilter] = useState("ALL");

  const handleExportCSV = () => {
    const reportData = [
      ["Metric", "Value", "Benchmark Comparison"],
      ["Total Enterprise Revenue", "$48,920,000", "+14.8% YoY"],
      ["Portfolio RevPAR", "$1,385", "+8.2% YoY"],
      ["Average Daily Rate (ADR)", "$1,520", "+6.4% YoY"],
      ["B2B Corporate Contract Value", "$18,400,000", "+22.1% YoY"],
      ["VIP Guest Retention Rate", "38.5%", "+4.2% YoY"],
      ["Lead Conversion Velocity", "21.4 Days", "-3.5 Days Faster"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + reportData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `monday-hotels-bi-report-${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Executive Business Intelligence & Financial Reports
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Portfolio Yield Analysis, Commercial Lead Conversions & B2B Revenue Intelligence
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Executive CSV Report</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="Q3-2026">Q3 2026 (Current Quarter)</option>
              <option value="Q2-2026">Q2 2026</option>
              <option value="Q1-2026">Q1 2026</option>
              <option value="FY-2025">Full Year 2025</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">All Portfolio Properties</option>
              <option value="Mumbai">Monday Hotels Grand Royale Mumbai</option>
              <option value="Goa">Monday Hotels Resort & Spa Goa</option>
              <option value="Udaipur">Monday Hotels Palace Udaipur</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-stone-400">
          Showing data for <strong className="text-amber-300">{dateRange}</strong> across <strong className="text-amber-300">{propertyFilter === "ALL" ? "All Properties" : propertyFilter}</strong>
        </span>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-100 text-sm">Commercial B2B Revenue</h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">+22.1%</span>
          </div>
          <p className="text-3xl font-bold text-amber-300">$18,400,000</p>
          <p className="text-xs text-stone-400">Target: $16,500,000 (111.5% achieved)</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-100 text-sm">Portfolio RevPAR Benchmark</h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">+8.2%</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">$1,385</p>
          <p className="text-xs text-stone-400">Market Lead over Luxury Competitors</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-100 text-sm">Lead Conversion Velocity</h3>
            <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">Faster</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">21.4 Days</p>
          <p className="text-xs text-stone-400">Avg Lead Created → Closed Won</p>
        </div>
      </div>
    </div>
  );
}
