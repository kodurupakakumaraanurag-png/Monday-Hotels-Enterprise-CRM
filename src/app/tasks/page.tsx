"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import {
  getTasks,
  toggleTaskStatus,
  createTask,
  OperationalTask,
  TaskPriority,
} from "@/lib/services/task-service";

export default function TasksPage() {
  const [tasks, setTasks] = useState<OperationalTask[]>(() => getTasks());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Task Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<OperationalTask["category"]>("Lead Follow-up");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [assignee, setAssignee] = useState("Priya Sharma");
  const [dueDate, setDueDate] = useState("Tomorrow, 5:00 PM");
  const [relatedEntity, setRelatedEntity] = useState("Reliance Enterprise Solutions");

  const refreshTasks = () => {
    setTasks([...getTasks()]);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === "ALL" || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const handleToggle = (id: string) => {
    toggleTaskStatus(id);
    refreshTasks();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    createTask({
      title,
      category,
      priority,
      status: "Pending",
      assignee,
      dueDate,
      relatedEntity,
    });

    refreshTasks();
    setIsModalOpen(false);
    setTitle("");
  };

  const getPriorityBadge = (prio: TaskPriority) => {
    switch (prio) {
      case "High":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold";
      case "Medium":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/30";
      default:
        return "bg-stone-800 text-stone-400 border border-stone-700";
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
            Follow-ups, RFP Deadlines, Guest Preferences & Staff Assignments
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
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
            <p className="text-xs text-stone-400 font-medium">Pending Tasks</p>
            <h3 className="text-2xl font-bold text-amber-300 mt-1">
              {tasks.filter((t) => t.status !== "Completed").length} Items
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">Completed Today</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {tasks.filter((t) => t.status === "Completed").length} Completed
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">High Priority Action Items</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">
              {tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length} High Priority
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-medium">SLA Compliance Rate</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">100%</h3>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <Tag className="w-6 h-6" />
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
            placeholder="Search tasks, assignees, entities..."
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500/50"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-xl">
        <div className="divide-y divide-stone-800 text-sm">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-800/40 transition ${
                task.status === "Completed" ? "opacity-60 bg-stone-950/40" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  onChange={() => handleToggle(task.id)}
                  className="mt-1 w-4 h-4 accent-amber-500 rounded border-stone-800 bg-stone-950 cursor-pointer"
                />
                <div>
                  <h4
                    className={`font-semibold text-stone-100 ${
                      task.status === "Completed" ? "line-through text-stone-500" : ""
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mt-1">
                    <span className="bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                      {task.category}
                    </span>
                    <span>•</span>
                    <span className="text-amber-300">{task.relatedEntity}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-stone-500" />
                      <span>{task.assignee}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <span className="text-xs text-stone-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{task.dueDate}</span>
                </span>

                <span className={`px-2.5 py-0.5 rounded text-xs ${getPriorityBadge(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-xl p-6 space-y-4 text-stone-100">
            <h3 className="text-lg font-bold text-amber-300">Create Staff Action Task</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                  placeholder="e.g. Confirm VIP suite setup for Dr. Singhania"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                  >
                    <option value="Lead Follow-up">Lead Follow-up</option>
                    <option value="VIP Preference Setup">VIP Preference Setup</option>
                    <option value="RFP Proposal">RFP Proposal</option>
                    <option value="Contract Approval">Contract Approval</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Assignee</label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-amber-500 text-stone-950 rounded-lg"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
