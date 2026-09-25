"use client";

import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Tag,
  Edit2,
  Trash2,
  Calendar,
  Building2,
} from "lucide-react";
import {
  getTasks,
  getMyTasks,
  getUpcomingTasks,
  getOverdueTasks,
  completeTask,
  deleteTask,
  EnterpriseTask,
} from "@/lib/services/task-activity-service";
import { TaskStatusType, TaskPriorityType } from "@/lib/validations/task-activity-schema";
import { TaskFormModal } from "@/components/tasks/task-form-modal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<EnterpriseTask[]>(() => getTasks());
  const [activeTab, setActiveTab] = useState<"all" | "my" | "upcoming" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<EnterpriseTask | undefined>(undefined);

  const currentUser = "Vikram Malhotra";

  const refreshTasks = () => {
    setTasks([...getTasks()]);
  };

  const displayedTasks = useMemo(() => {
    let list: EnterpriseTask[] = [];
    if (activeTab === "my") list = getMyTasks(currentUser);
    else if (activeTab === "upcoming") list = getUpcomingTasks();
    else if (activeTab === "overdue") list = getOverdueTasks();
    else list = tasks;

    return list.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.relatedCompany && t.relatedCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.relatedContact && t.relatedContact.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority = selectedPriority === "ALL" || t.priority === selectedPriority;
      const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, activeTab, searchQuery, selectedPriority, selectedStatus]);

  const overdueCount = useMemo(() => getOverdueTasks().length, [tasks]);
  const upcomingCount = useMemo(() => getUpcomingTasks().length, [tasks]);
  const myCount = useMemo(() => getMyTasks(currentUser).length, [tasks]);

  const handleToggleComplete = (id: string) => {
    completeTask(id);
    refreshTasks();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete task "${title}"?`)) {
      deleteTask(id);
      refreshTasks();
    }
  };

  const getPriorityBadgeStyle = (prio: TaskPriorityType) => {
    switch (prio) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/40 font-bold";
      case "HIGH":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
      default:
        return "bg-stone-800 text-stone-400 border border-stone-700";
    }
  };

  const getStatusBadgeStyle = (stg: TaskStatusType) => {
    switch (stg) {
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold";
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30";
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
              <CheckSquare className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">
              Tasks & Operational Action Items
            </h1>
          </div>
          <p className="text-sm text-stone-400">
            Follow-ups, Proposal Deadlines, Guest Preferences & Workload Delegation
          </p>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold rounded-lg text-sm shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Total Action Tasks</p>
            <h3 className="text-2xl font-bold text-stone-100 mt-1">{tasks.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">My Assigned Tasks</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">{myCount} Tasks</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Upcoming Tasks</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{upcomingCount} Active</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Overdue Tasks</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{overdueCount} Overdue</h3>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "all"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>All Tasks ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("my")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "my"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Tasks ({myCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "upcoming"
              ? "bg-amber-500/10 border border-amber-500/40 text-amber-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Upcoming ({upcomingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "overdue"
              ? "bg-rose-500/10 border border-rose-500/40 text-rose-300"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Overdue ({overdueCount})</span>
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
            placeholder="Search task title, assignee, company..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-12 text-center">Done</th>
                <th className="py-3.5 px-4">Task Details</th>
                <th className="py-3.5 px-4">Assigned Executive</th>
                <th className="py-3.5 px-4">Related Entity</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-sm">
              {displayedTasks.map((t) => (
                <tr key={t.id} className={`hover:bg-stone-800/40 transition ${t.status === "COMPLETED" ? "opacity-60" : ""}`}>
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={t.status === "COMPLETED"}
                      onChange={() => handleToggleComplete(t.id)}
                      className="w-4 h-4 accent-amber-500 rounded border-stone-800 bg-stone-950 cursor-pointer"
                    />
                  </td>

                  <td className="py-3.5 px-4">
                    <div className={`font-semibold text-stone-100 ${t.status === "COMPLETED" ? "line-through text-stone-500" : ""}`}>
                      {t.title}
                    </div>
                    {t.description && <div className="text-xs text-stone-400 mt-0.5 line-clamp-1">{t.description}</div>}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-amber-300">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t.assignedUser}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-stone-300">
                    {t.relatedCompany || t.relatedGuest || t.relatedContact || "General System"}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-stone-200">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t.dueDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getPriorityBadgeStyle(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getStatusBadgeStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setTaskToEdit(t);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.title)}
                        className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshTasks}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
