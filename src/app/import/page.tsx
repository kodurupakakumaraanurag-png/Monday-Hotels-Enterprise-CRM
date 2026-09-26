"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Database,
  RefreshCw,
  Sparkles,
  Layers,
  FileText,
  UserCheck,
  Building2,
  CalendarDays,
  Users,
  Check,
  Filter,
  ShieldCheck,
  AlertCircle,
  Play,
} from "lucide-react";
import {
  MigrationEntityType,
  ENTITY_SCHEMA_MAP,
  parseCSVText,
  autoSuggestFieldMapping,
  validateAndDeduplicate,
  executeBatchMigration,
  generateSampleCSV,
  ValidatedRow,
} from "@/lib/services/import-export-migration-service";

export default function ImportMigrationPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Migration Configuration State
  const [selectedEntity, setSelectedEntity] = useState<MigrationEntityType>("LEAD");
  const [rawCSVText, setRawCSVText] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  // Step 2 Mapping State
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});

  // Step 3 Validation & Deduplication State
  const [validatedRows, setValidatedRows] = useState<ValidatedRow[]>([]);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "VALID" | "WARNING_DUPLICATE" | "ERROR_INVALID">("ALL");
  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(true);

  // Step 4 Execution State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    insertedCount: number;
    skippedCount: number;
    errorCount: number;
  } | null>(null);

  // Entity Selection Config Cards
  const entityCards: { type: MigrationEntityType; title: string; icon: any; color: string }[] = [
    { type: "LEAD", title: "Sales Leads", icon: UserCheck, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { type: "CORPORATE", title: "Corporate Accounts", icon: Building2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { type: "RESERVATION", title: "Reservations", icon: CalendarDays, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
    { type: "GUEST", title: "Guest 360 Profiles", icon: Users, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  ];

  // Load Demo Data for testing
  const handleLoadDemoCSV = (entity: MigrationEntityType) => {
    setSelectedEntity(entity);
    let demoText = "";
    if (entity === "LEAD") {
      demoText = `Poc Name,Company,Email,Phone,Target Property,Lead Source,Priority,Status,Est Value\nSunil Nair,TechCorp Global,sunil.nair@techcorp.com,+91 98765 43210,Monday Hotel Aerocity Delhi,Corporate B2B Outreach,HIGH,QUALIFIED,450000\nAnanya Sen,Wipro Events,ananya.sen@wipro.com,+91 98111 22334,Monday Resort Goa,Website Form,URGENT,QUOTATION,850000\nRajesh Verma,HCL Tech,rajesh.v@hcl.com,+91 99000 11223,Monday Hotel Cyber City,Direct Phone Call,MEDIUM,NEW,300000`;
    } else if (entity === "CORPORATE") {
      demoText = `Company Name,Industry,Account Manager,Contract Tier,Discount %,POC Name,Email,Phone\nInfosys Enterprise,IT & Software,Vikram Malhotra,Tier-1 Preferred,20,Rahul Mehta,travel@infosys.com,+91 80 1234 5678\nDeloitte India,Consulting,Siddharth Rao,Tier-2 Corporate,15,Pooja Hegde,corp.travel@deloitte.in,+91 22 9876 5432`;
    } else if (entity === "RESERVATION") {
      demoText = `Guest Name,Email,Phone,Property Name,Room Type,Check-In,Check-Out,Amount,Status\nKavita Roy,kavita.roy@gmail.com,+91 98222 33445,Monday Hotel Aerocity Delhi,Executive Suite,2026-10-10,2026-10-14,48000,CONFIRMED\nAmrita Rao,amrita.rao@yahoo.com,+91 97111 22334,Monday Resort Goa,Deluxe Sea View,2026-10-12,2026-10-15,36000,CONFIRMED`;
    } else if (entity === "GUEST") {
      demoText = `Full Name,Email,Phone,VIP Tier,City,Special Requests\nVikramaditya Singh,v.singh@royalgroup.in,+91 99999 88888,PLATINUM,Jaipur,High floor suite, quiet wing\nNeha Gupta,neha.gupta@gmail.com,+91 98888 77777,GOLD,Mumbai,Late check-out requested`;
    }

    setRawCSVText(demoText);
    setFileName(`demo-${entity.toLowerCase()}-data.csv`);
  };

  // File Upload Reader Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setRawCSVText(content || "");
    };
    reader.readAsText(file);
  };

  // Step 1 -> Step 2: Parse CSV and suggest field mappings
  const handleProceedToMapping = () => {
    if (!rawCSVText.trim()) return;
    const { headers, rows } = parseCSVText(rawCSVText);
    if (headers.length === 0 || rows.length === 0) {
      alert("No valid columns or record rows found in CSV data.");
      return;
    }
    setParsedHeaders(headers);
    setParsedRows(rows);

    const autoMapping = autoSuggestFieldMapping(headers, selectedEntity);
    setFieldMapping(autoMapping);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3: Run Validation & Deduplication Check
  const handleProceedToValidation = () => {
    const validated = validateAndDeduplicate(selectedEntity, parsedRows, fieldMapping);
    setValidatedRows(validated);
    setCurrentStep(3);
  };

  // Step 3 -> Step 4: Execute Batch Migration
  const handleExecuteMigration = () => {
    setIsExecuting(true);
    setCurrentStep(4);

    setTimeout(() => {
      const rowsToProcess = skipDuplicates
        ? validatedRows.filter((r) => r.status === "VALID")
        : validatedRows.filter((r) => r.status !== "ERROR_INVALID");

      const res = executeBatchMigration(selectedEntity, rowsToProcess);
      setExecutionResult(res);
      setIsExecuting(false);
    }, 1200);
  };

  // Download Sample Template CSV
  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV(selectedEntity);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sample-${selectedEntity.toLowerCase()}-import-template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredValidationRows = useMemo(() => {
    if (filterStatus === "ALL") return validatedRows;
    return validatedRows.filter((r) => r.status === filterStatus);
  }, [validatedRows, filterStatus]);

  const validCount = validatedRows.filter((r) => r.status === "VALID").length;
  const duplicateCount = validatedRows.filter((r) => r.status === "WARNING_DUPLICATE").length;
  const errorCount = validatedRows.filter((r) => r.status === "ERROR_INVALID").length;

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto text-stone-100 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Enterprise CSV / Excel Migration Hub
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Bulk data import wizard with schema auto-mapping, Zod validation & intelligent deduplication.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="flex items-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl text-xs font-bold transition shadow"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* 4-Step Migration Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-stone-900 border border-stone-800 rounded-2xl p-3">
        {[
          { step: 1, title: "1. Upload & Target", desc: "Select Entity & File" },
          { step: 2, title: "2. Column Mapping", desc: "Match CSV Headers" },
          { step: 3, title: "3. Validation Check", desc: "Review Deduplication" },
          { step: 4, title: "4. Execute Migration", desc: "Batch Database Import" },
        ].map((s) => (
          <div
            key={s.step}
            className={`p-3 rounded-xl border flex items-center space-x-3 transition ${
              currentStep === s.step
                ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                : currentStep > s.step
                ? "bg-stone-950/80 border-stone-800 text-emerald-400"
                : "bg-stone-950/40 border-stone-900 text-stone-500"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                currentStep === s.step
                  ? "bg-amber-500 text-stone-950"
                  : currentStep > s.step
                  ? "bg-emerald-500 text-stone-950"
                  : "bg-stone-800 text-stone-400"
              }`}
            >
              {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
            </div>
            <div>
              <div className="text-xs font-bold leading-none">{s.title}</div>
              <div className="text-[10px] text-stone-400 mt-1">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* STEP 1: UPLOAD & TARGET ENTITY SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Entity Target Selector Cards */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Select Destination CRM Database Entity</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {entityCards.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedEntity === c.type;
                const schema = ENTITY_SCHEMA_MAP[c.type];
                return (
                  <div
                    key={c.type}
                    onClick={() => setSelectedEntity(c.type)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 relative ${
                      isSelected
                        ? "bg-stone-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50"
                        : "bg-stone-950 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${c.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-100">{c.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{schema.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Upload Zone & Raw CSV Input */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-amber-400" />
                <span>Upload CSV / Excel File or Load Preset Demo Data</span>
              </h3>
              <button
                onClick={() => handleLoadDemoCSV(selectedEntity)}
                className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold rounded-lg transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Load Sample {selectedEntity} Dataset</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/50 rounded-2xl p-8 text-center space-y-3 transition bg-stone-950/40">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <label className="cursor-pointer text-xs font-bold text-amber-400 hover:underline">
                  Click to Browse CSV / TSV file
                  <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-xs text-stone-500"> or drag and drop here</span>
              </div>
              {fileName && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-stone-900 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{fileName}</span>
                </div>
              )}
            </div>

            {/* Raw Text Preview Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400">CSV Data Text Preview</label>
              <textarea
                value={rawCSVText}
                onChange={(e) => setRawCSVText(e.target.value)}
                rows={5}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-300 focus:outline-none focus:border-amber-500"
                placeholder="Poc Name, Company, Email, Phone..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleProceedToMapping}
              disabled={!rawCSVText.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
            >
              <span>Proceed to Column Mapping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-100">Map CSV Headers to CRM Schema</h3>
                <p className="text-xs text-stone-400">
                  Entity: <strong className="text-amber-400">{ENTITY_SCHEMA_MAP[selectedEntity].title}</strong> • Total Records:{" "}
                  <strong>{parsedRows.length}</strong>
                </p>
              </div>
              <button
                onClick={() => setFieldMapping(autoSuggestFieldMapping(parsedHeaders, selectedEntity))}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Re-Auto Match</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase font-semibold bg-stone-950/60">
                    <th className="py-3 px-4">Target CRM Field</th>
                    <th className="py-3 px-4">Required</th>
                    <th className="py-3 px-4">Mapped CSV Header Column</th>
                    <th className="py-3 px-4">Sample Value</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {ENTITY_SCHEMA_MAP[selectedEntity].fields.map((field) => {
                    const mappedHeader = fieldMapping[field.key] || "";
                    const sample = mappedHeader && parsedRows[0] ? parsedRows[0][mappedHeader] : "-";
                    const isMapped = !!mappedHeader;

                    return (
                      <tr key={field.key} className="hover:bg-stone-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-200">{field.label}</div>
                          <div className="text-[10px] text-stone-500 font-mono">{field.key}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {field.required ? (
                            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded">
                              Required
                            </span>
                          ) : (
                            <span className="text-stone-500 text-[10px]">Optional</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={mappedHeader}
                            onChange={(e) =>
                              setFieldMapping({ ...fieldMapping, [field.key]: e.target.value })
                            }
                            className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 w-full max-w-xs cursor-pointer"
                          >
                            <option value="">-- Ignore Field --</option>
                            {parsedHeaders.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400 truncate max-w-xs font-mono">{sample}</td>
                        <td className="py-3.5 px-4">
                          {isMapped ? (
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mapped</span>
                            </span>
                          ) : field.required ? (
                            <span className="text-red-400 font-bold flex items-center space-x-1">
                              <AlertCircle className="w-4 h-4" />
                              <span>Missing</span>
                            </span>
                          ) : (
                            <span className="text-stone-500">Skipped</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl flex items-center space-x-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to File Upload</span>
            </button>
            <button
              onClick={handleProceedToValidation}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
            >
              <span>Run Validation & Deduplication</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VALIDATION & DEDUPLICATION PREVIEW */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Total Rows Evaluated</div>
              <div className="text-2xl font-extrabold text-stone-100 mt-1">{validatedRows.length}</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
              <div className="text-[10px] font-bold text-emerald-400 uppercase">Valid Records</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{validCount}</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl">
              <div className="text-[10px] font-bold text-amber-400 uppercase">Duplicate Warnings</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{duplicateCount}</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl">
              <div className="text-[10px] font-bold text-red-400 uppercase">Validation Errors</div>
              <div className="text-2xl font-extrabold text-red-400 mt-1">{errorCount}</div>
            </div>
          </div>

          {/* Controls & Filter Toolbar */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-stone-300">Filter Preview:</span>
              {(["ALL", "VALID", "WARNING_DUPLICATE", "ERROR_INVALID"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                    filterStatus === st
                      ? "bg-amber-500 text-stone-950"
                      : "bg-stone-950 border border-stone-800 text-stone-400 hover:bg-stone-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-stone-300 flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>Auto-Skip Duplicate Email Records</span>
              </label>
            </div>
          </div>

          {/* Validation Rows Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-stone-200">Pre-Import Row Inspection</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase font-semibold bg-stone-950/60">
                    <th className="py-3 px-4">Row #</th>
                    <th className="py-3 px-4">Mapped Record Summary</th>
                    <th className="py-3 px-4">Row Status</th>
                    <th className="py-3 px-4">Validation / Deduplication Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {filteredValidationRows.map((row) => (
                    <tr key={row.rowIndex} className="hover:bg-stone-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-stone-400">#{row.rowIndex}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-200">
                          {row.mappedData.contactPocName || row.mappedData.guest || row.mappedData.fullName || row.mappedData.companyName || "Record"}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Email: {row.mappedData.email || "-"} • Phone: {row.mappedData.phone || "-"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {row.status === "VALID" && (
                          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold rounded-lg inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> VALID
                          </span>
                        )}
                        {row.status === "WARNING_DUPLICATE" && (
                          <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold rounded-lg inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> DUPLICATE
                          </span>
                        )}
                        {row.status === "ERROR_INVALID" && (
                          <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-extrabold rounded-lg inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> INVALID
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {row.errors.map((e, idx) => (
                          <div key={idx} className="text-red-400 font-semibold">{e}</div>
                        ))}
                        {row.warnings.map((w, idx) => (
                          <div key={idx} className="text-amber-400 font-medium">{w}</div>
                        ))}
                        {row.errors.length === 0 && row.warnings.length === 0 && (
                          <span className="text-stone-500">Schema verified cleanly</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl flex items-center space-x-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Field Mapping</span>
            </button>
            <button
              onClick={handleExecuteMigration}
              disabled={validCount === 0 && !skipDuplicates}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Execute Batch Migration ({skipDuplicates ? validCount : validCount + duplicateCount} Records)</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MIGRATION EXECUTION & SUMMARY */}
      {currentStep === 4 && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-6 text-center">
          {isExecuting ? (
            <div className="py-12 space-y-4">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-stone-100">Executing Enterprise Batch Migration...</h2>
              <p className="text-xs text-stone-400">Inserting validated records into {selectedEntity} database service</p>
            </div>
          ) : (
            <div className="py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-stone-100">Batch Migration Completed!</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Database import for <strong>{ENTITY_SCHEMA_MAP[selectedEntity].title}</strong> executed successfully.
                </p>
              </div>

              {/* Execution Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Inserted</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                    {executionResult?.insertedCount || 0}
                  </div>
                </div>
                <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Skipped</div>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">
                    {executionResult?.skippedCount || 0}
                  </div>
                </div>
                <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Errors</div>
                  <div className="text-2xl font-extrabold text-red-400 mt-1">
                    {executionResult?.errorCount || 0}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setRawCSVText("");
                    setFileName(null);
                  }}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl transition"
                >
                  Start Another Import
                </button>

                <Link
                  href={
                    selectedEntity === "LEAD"
                      ? "/leads"
                      : selectedEntity === "CORPORATE"
                      ? "/corporate"
                      : selectedEntity === "RESERVATION"
                      ? "/reservations"
                      : "/guests"
                  }
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition"
                >
                  <span>View {selectedEntity} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
