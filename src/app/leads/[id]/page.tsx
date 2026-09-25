"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  getLeadById,
  addLeadNote,
  addLeadTask,
  updateLead,
} from "@/lib/services/lead-service";
import { getPriorityStyle, getStatusStyle } from "@/lib/demo-data/leads-data";
import {
  Building2,
  User,
  FileText,
  Sparkles,
  Target,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  ShieldCheck,
  Award
} from "lucide-react";
import Link from "next/link";
import { PipelineStatus, PriorityLevel } from "@/lib/validations/lead-schema";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const lead = getLeadById(leadId);

  const [activeTab, setActiveTab] = useState<"details" | "activities" | "notes" | "tasks">("details");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-09-30");

  if (!lead) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-500" />
        <h2 className="text-xl font-bold text-slate-200">Lead Record Not Found</h2>
        <p className="text-xs text-slate-400">The lead record ID ({leadId}) could not be located in the CRM database.</p>
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Leads Directory
        </Link>
      </div>
    );
  }

  const priorityBadge = getPriorityStyle(lead.priorityLevel);
  const statusBadge = getStatusStyle(lead.pipelineStatus);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addLeadNote(lead.id, "Priya Sharma (Sales Mgr)", newNoteContent);
    setNewNoteContent("");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addLeadTask(lead.id, {
      title: newTaskTitle,
      dueDate: newTaskDueDate,
      priority: "HIGH",
      assignedTo: lead.assignedTo || "Rahul Verma",
    });
    setNewTaskTitle("");
  };

  const handleQuickStatusUpdate = (newStatus: PipelineStatus) => {
    updateLead(lead.id, { pipelineStatus: newStatus });
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <PageHeader
        title={`${lead.companyName} (${lead.id})`}
        subtitle={`${lead.industryDomain} • ${lead.location}`}
        breadcrumbs={[
          { label: "Commercial CRM" },
          { label: "Sales Leads", href: "/leads" },
          { label: lead.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/leads"
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Leads
            </Link>
          </div>
        }
      />

      {/* Hero Banner Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {lead.id}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${priorityBadge.class}`}>
              {priorityBadge.label} Priority
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${statusBadge.class}`}>
              {statusBadge.label}
            </span>
            <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded">
              Allocation: {lead.projectAllocationStatus}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-100">{lead.companyName}</h2>
          <p className="text-xs text-slate-400">
            Contact POC: <strong className="text-slate-200">{lead.contactPocName}</strong> ({lead.designation}) • Email:{" "}
            <span className="text-amber-400">{lead.email}</span>
          </p>
        </div>

        {/* Lead Score Showcase Box */}
        <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-center shrink-0 min-w-[200px]">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Lead Score</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{lead.totalLeadScore} / 30</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">6 Component Evaluation</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="border-b border-slate-800 flex items-center gap-2 text-xs font-medium">
        {[
          { id: "details", label: "26-Field Lead Dossier" },
          { id: "activities", label: `Activities (${lead.activities.length})` },
          { id: "notes", label: `Notes (${lead.notes.length})` },
          { id: "tasks", label: `Follow-up Tasks (${lead.tasks.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 border-b-2 transition-all font-semibold ${
              activeTab === tab.id
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: 26-Field Lead Dossier */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Section 1: Company & Industry Information */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building2 className="w-4 h-4" /> 1. Company & Industry Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">1. Company Name</span>
                <span className="font-bold text-slate-100">{lead.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">2. Industry Domain</span>
                <span className="font-semibold text-slate-200">{lead.industryDomain}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">3. Location / City</span>
                <span className="font-semibold text-slate-200">{lead.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">4. Website URL</span>
                <a href={lead.websiteUrl || "#"} target="_blank" className="font-semibold text-amber-400 hover:underline">
                  {lead.websiteUrl || "N/A"}
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Contact POC Details */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <User className="w-4 h-4" /> 2. Contact POC & Individual Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">5. Contact POC Name</span>
                <span className="font-bold text-slate-100">{lead.contactPocName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">6. Designation / Role</span>
                <span className="font-semibold text-slate-200">{lead.designation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">7. Phone Number</span>
                <span className="font-semibold text-slate-200">{lead.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">8. Email Address</span>
                <span className="font-semibold text-amber-400">{lead.email}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Business Requirements & Friction Scope */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4" /> 3. Business Overview & Friction Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-bold block mb-1">9. Business Overview</span>
                <p className="text-slate-200 leading-relaxed">{lead.businessOverview}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-bold block mb-1">10. Problem / Friction</span>
                <p className="text-slate-200 leading-relaxed">{lead.problemFriction}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-bold block mb-1">11. Project Requirement</span>
                <p className="text-slate-200 leading-relaxed">{lead.projectRequirement}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 font-bold block mb-1">12. Placement Opportunity</span>
                <p className="text-slate-200 leading-relaxed">{lead.placementOpportunity}</p>
              </div>
            </div>
          </div>

          {/* Section 4: 6-Component Lead Scoring Engine Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 4. Lead Scoring Engine (6 Components • 0 to 5)
              </h3>
              <span className="text-xs font-bold text-emerald-400">Total: {lead.totalLeadScore} / 30</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                { name: "19. Digital Presence", val: lead.digitalPresenceScore },
                { name: "20. Hiring Activity", val: lead.hiringActivityScore },
                { name: "21. Tech Stack Fit", val: lead.techStackFitScore },
                { name: "22. Funding / Revenue", val: lead.fundingRevenueScore },
                { name: "23. Project Urgency", val: lead.projectUrgencyScore },
                { name: "24. Budget Clarity", val: lead.budgetClarityScore },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">{item.name}</span>
                  <div className="text-xl font-bold text-amber-400">{item.val} / 5</div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${(item.val / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Pipeline & Assignment Metadata */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Target className="w-4 h-4" /> 5. Pipeline Metadata & Assignment (Fields 13-18, 26)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">13. Priority Level</span>
                <span className="font-bold text-slate-100">{lead.priorityLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">14. Pipeline Status</span>
                <span className="font-bold text-slate-100">{lead.pipelineStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">15. Next Action</span>
                <span className="font-semibold text-slate-200">{lead.nextAction}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">16. Date Added</span>
                <span className="font-semibold text-slate-200">{lead.dateAdded}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">17. Lead Source</span>
                <span className="font-semibold text-slate-200">{lead.leadSource}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">18. Contact Method</span>
                <span className="font-semibold text-slate-200">{lead.contactMethod}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">26. Allocation Status</span>
                <span className="font-semibold text-slate-200">{lead.projectAllocationStatus}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assigned Executive</span>
                <span className="font-bold text-amber-400">{lead.assignedTo || "Unassigned"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Activity History Timeline */}
      {activeTab === "activities" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
            Activity Timeline & Interaction History
          </h3>
          <div className="space-y-3">
            {lead.activities.map((act) => (
              <div key={act.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-amber-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{act.title}</span>
                    <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Notes */}
      {activeTab === "notes" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
            Internal Staff Notes
          </h3>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Add an internal note or update about this lead..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
            >
              Post Note
            </button>
          </form>

          <div className="space-y-3 pt-2">
            {lead.notes.map((note) => (
              <div key={note.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-bold text-amber-400">{note.author}</span>
                  <span>{note.createdAt}</span>
                </div>
                <p className="text-slate-200">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Follow-up Tasks */}
      {activeTab === "tasks" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
            Follow-up Action Tasks
          </h3>

          <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 text-xs">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title (e.g. Call client for contract confirmation)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold shrink-0"
            >
              Add Task
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {lead.tasks.map((task) => (
              <div key={task.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{task.title}</div>
                  <div className="text-[11px] text-slate-400">Assigned: {task.assignedTo} • Due: {task.dueDate}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
