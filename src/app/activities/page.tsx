"use client";

import React, { useState } from "react";
import {
  Activity,
  Phone,
  Mail,
  Users,
  FileText,
  Clock,
  Plus,
  Filter,
  Search,
  Eye,
  Calendar,
} from "lucide-react";
import { getActivities, EnterpriseActivityLog } from "@/lib/services/task-activity-service";
import { ActivityType } from "@/lib/validations/task-activity-schema";
import { ActivityLogModal } from "@/components/activities/activity-log-modal";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<EnterpriseActivityLog[]>(() => getActivities());
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const refreshActivities = () => {
    setActivities([...getActivities()]);
  };

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.loggedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.description && act.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "ALL" || act.activityType === selectedType;

    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "CALL":
        return <Phone className="w-4 h-4 text-blue-400" />;
      case "EMAIL":
        return <Mail className="w-4 h-4 text-purple-400" />;
      case "MEETING":
        return <Users className="w-4 h-4 text-emerald-400" />;
      case "SITE_VISIT":
        return <Eye className="w-4 h-4 text-amber-400" />;
      case "FOLLOW_UP":
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      default:
        return <FileText className="w-4 h-4 text-stone-400" />;
    }
  };

  const getActivityBadgeStyle = (type: string) => {
    switch (type) {
      case "CALL":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "EMAIL":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "MEETING":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "SITE_VISIT":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "FOLLOW_UP":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-stone-800 text-stone-300 border-stone-700";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-stone-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Enterprise Activity Stream & Touchpoints
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Real-Time Audit Stream of Client Calls, Emails, In-Person Meetings, Notes & Site Visits
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity Touchpoint</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity title, user, related entity..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
          >
            <option value="ALL">All 6 Activity Types</option>
            <option value="CALL">CALL</option>
            <option value="EMAIL">EMAIL</option>
            <option value="MEETING">MEETING</option>
            <option value="NOTE">NOTE</option>
            <option value="FOLLOW_UP">FOLLOW_UP</option>
            <option value="SITE_VISIT">SITE_VISIT</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="space-y-4">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/40 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2.5 text-xs">
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold border ${getActivityBadgeStyle(act.activityType)}`}>
                    {getActivityIcon(act.activityType)}
                    <span>{act.activityType}</span>
                  </span>
                  <span className="font-semibold text-stone-200">{act.loggedBy}</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-amber-300 font-medium">Target: {act.relatedEntity}</span>
                </div>

                <h3 className="font-bold text-stone-100 text-sm mt-1">{act.title}</h3>
                {act.description && (
                  <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">{act.description}</p>
                )}
              </div>

              <div className="text-xs text-stone-500 flex items-center space-x-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActivityLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={refreshActivities}
      />
    </div>
  );
}
