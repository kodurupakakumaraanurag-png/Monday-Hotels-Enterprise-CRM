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
  Eye,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getActivitiesForEntity, EnterpriseActivityLog } from "@/lib/services/task-activity-service";
import { ActivityLogModal } from "./activity-log-modal";

interface EntityActivityTimelineProps {
  entityName: string;
  entityId?: string;
}

export function EntityActivityTimeline({
  entityName,
  entityId,
}: EntityActivityTimelineProps) {
  const [activities, setActivities] = useState<EnterpriseActivityLog[]>(() =>
    getActivitiesForEntity(entityName, entityId)
  );
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const refresh = () => {
    setActivities(getActivitiesForEntity(entityName, entityId));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "CALL":
        return <Phone className="w-3.5 h-3.5 text-blue-400" />;
      case "EMAIL":
        return <Mail className="w-3.5 h-3.5 text-purple-400" />;
      case "MEETING":
        return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      case "SITE_VISIT":
        return <Eye className="w-3.5 h-3.5 text-amber-400" />;
      case "FOLLOW_UP":
        return <Calendar className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  const getActivityBadge = (type: string) => {
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
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-stone-100">
            Activity Timeline & Touchpoints ({activities.length})
          </h3>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Activity</span>
        </button>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-stone-500 text-xs py-4 text-center">
            No activity touchpoints logged for {entityName} yet.
          </p>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              className="bg-stone-950 border border-stone-800 rounded-lg p-3.5 space-y-1.5 hover:border-amber-500/30 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getActivityBadge(act.activityType)}`}>
                    {getActivityIcon(act.activityType)}
                    <span>{act.activityType}</span>
                  </span>
                  <span className="font-semibold text-stone-200">{act.loggedBy}</span>
                </div>

                <span className="text-[11px] text-stone-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  <span>{act.timestamp}</span>
                </span>
              </div>

              <h4 className="font-bold text-stone-100 text-xs">{act.title}</h4>
              {act.description && (
                <p className="text-xs text-stone-400 leading-relaxed">{act.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      <ActivityLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={refresh}
        defaultEntityName={entityName}
        defaultEntityId={entityId}
      />
    </div>
  );
}
