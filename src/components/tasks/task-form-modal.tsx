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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-2xl text-[#1E293B] p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E8F0EC] border border-[#A8C3B2] rounded-lg text-[#1E4D3B]">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B]">
              {taskToEdit ? `Edit Action Task (${taskToEdit.id})` : "Create Enterprise Action Task"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Task Title *</label>
            <input
              {...register("title")}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              placeholder="e.g. Confirm Presidential Sky Suite setup for Dr. Singhania"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Description / Instructions</label>
            <textarea
              {...register("description")}
              rows={2}
              className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1E4D3B]"
              placeholder="Enter detailed task scope and instructions..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Assigned Sales / Hotel Executive *</label>
              <input
                {...register("assignedUser")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                placeholder="e.g. Vikram Malhotra"
              />
              {errors.assignedUser && <p className="text-xs text-red-500 mt-1">{errors.assignedUser.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Due Date *</label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Priority Level *</label>
              <select
                {...register("priority")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              >
                <option value="URGENT">URGENT (Highest Priority)</option>
                <option value="HIGH">HIGH Priority</option>
                <option value="MEDIUM">MEDIUM Priority</option>
                <option value="LOW">LOW Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Task Status *</label>
              <select
                {...register("status")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Related Company (Optional)</label>
              <input
                {...register("relatedCompany")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                placeholder="e.g. Reliance Enterprise Solutions"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Related Contact / Guest (Optional)</label>
              <input
                {...register("relatedContact")}
                className="w-full bg-[#F8F6F0] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#1E293B]"
                placeholder="e.g. Dr. Vikramaditya Singhania"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold bg-[#1E4D3B] hover:bg-[#163B2D] text-white rounded-lg shadow-sm"
            >
              {taskToEdit ? "Update Task" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
