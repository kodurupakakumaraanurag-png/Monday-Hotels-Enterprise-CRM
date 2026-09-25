import { z } from "zod";

export const activityTypeEnum = z.enum([
  "CALL",
  "EMAIL",
  "MEETING",
  "NOTE",
  "FOLLOW_UP",
  "SITE_VISIT",
]);

export const taskStatusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const taskPriorityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Task title is required"),
  description: z.string().optional(),
  assignedUser: z.string().min(1, "Assigned user is required"),
  relatedLead: z.string().optional(),
  relatedCompany: z.string().optional(),
  relatedContact: z.string().optional(),
  relatedGuest: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: taskPriorityEnum,
  status: taskStatusEnum,
});

export const activityLogSchema = z.object({
  id: z.string().optional(),
  activityType: activityTypeEnum,
  title: z.string().min(2, "Activity title is required"),
  description: z.string().optional(),
  loggedBy: z.string().min(1, "User is required"),
  relatedEntity: z.string().min(1, "Related entity is required"),
  relatedEntityId: z.string().optional(),
  timestamp: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type ActivityLogFormValues = z.infer<typeof activityLogSchema>;
export type ActivityType = z.infer<typeof activityTypeEnum>;
export type TaskStatusType = z.infer<typeof taskStatusEnum>;
export type TaskPriorityType = z.infer<typeof taskPriorityEnum>;
