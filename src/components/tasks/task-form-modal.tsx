"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CheckSquare, User, Calendar, AlertTriangle, Building2, Tag } from "lucide-react";
import { taskSchema, TaskFormValues } from "@/lib/validations/task-activity-schema";
import { createTask, updateTask, EnterpriseTask } from "@/lib/services/task-activity-service";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskToEdit?: EnterpriseTask;
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSuccess,
  taskToEdit,
}: TaskFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: taskToEdit
      ? {
          title: taskToEdit.title,
          description: taskToEdit.description || "",
          assignedUser: taskToEdit.assignedUser,
          relatedLead: taskToEdit.relatedLead || "",
          relatedCompany: taskToEdit.relatedCompany || "",
          relatedContact: taskToEdit.relatedContact || "",
          relatedGuest: taskToEdit.relatedGuest || "",
          dueDate: taskToEdit.dueDate,
          priority: taskToEdit.priority,
          status: taskToEdit.status,
        }
      : {
          title: "",
          description: "",
          assignedUser: "Vikram Malhotra",
          relatedLead: "",
          relatedCompany: "Reliance Enterprise Solutions",
          relatedContact: "Dr. Vikramaditya Singhania",
          relatedGuest: "Dr. Vikramaditya Singhania",
          dueDate: "2026-09-30",
          priority: "HIGH",
          status: "TODO",
        },
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        assignedUser: taskToEdit.assignedUser,
        relatedLead: taskToEdit.relatedLead || "",
        relatedCompany: taskToEdit.relatedCompany || "",
        relatedContact: taskToEdit.relatedContact || "",
        relatedGuest: taskToEdit.relatedGuest || "",
        dueDate: taskToEdit.dueDate,
        priority: taskToEdit.priority,
        status: taskToEdit.status,
      });
    }
  }, [taskToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: TaskFormValues) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data);
    } else {
      createTask(data);
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-500/30 rounded-xl shadow-2xl text-stone-100 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-100">
              {taskToEdit ? `Edit Action Task (${taskToEdit.id})` : "Create Enterprise Action Task"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Task Title *</label>
            <input
              {...register("title")}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. Confirm Presidential Sky Suite setup for Dr. Singhania"
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Description / Instructions</label>
            <textarea
              {...register("description")}
              rows={2}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
              placeholder="Enter detailed task scope and instructions..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Assigned Sales / Hotel Executive *</label>
              <input
                {...register("assignedUser")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                placeholder="e.g. Vikram Malhotra"
              />
              {errors.assignedUser && <p className="text-xs text-rose-400 mt-1">{errors.assignedUser.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Due Date *</label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              />
              {errors.dueDate && <p className="text-xs text-rose-400 mt-1">{errors.dueDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Priority Level *</label>
              <select
                {...register("priority")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              >
                <option value="URGENT">URGENT (Highest Priority)</option>
                <option value="HIGH">HIGH Priority</option>
                <option value="MEDIUM">MEDIUM Priority</option>
                <option value="LOW">LOW Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Task Status *</label>
              <select
                {...register("status")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Related Company (Optional)</label>
              <input
                {...register("relatedCompany")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                placeholder="e.g. Reliance Enterprise Solutions"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Related Contact / Guest (Optional)</label>
              <input
                {...register("relatedContact")}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 rounded-lg shadow-md"
            >
              {taskToEdit ? "Update Task" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
