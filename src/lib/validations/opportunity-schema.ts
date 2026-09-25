import { z } from "zod";

export const pipelineStageEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTATION",
  "NEGOTIATION",
  "CONFIRMED",
  "COMPLETED",
  "LOST",
]);

export const opportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Opportunity title is required"),
  companyName: z.string().min(2, "Related company name is required"),
  companyId: z.string().optional(),
  contactName: z.string().min(2, "Related contact name is required"),
  contactEmail: z.string().email("Valid contact email is required"),
  contactPhone: z.string().optional(),
  bookingEnquiryNumber: z.string().optional(),
  opportunityValue: z.number().min(0, "Opportunity value must be non-negative"),
  probability: z.number().min(0).max(100, "Probability must be between 0 and 100"),
  stage: pipelineStageEnum,
  expectedCloseDate: z.string().min(1, "Expected close date is required"),
  accountOwner: z.string().min(1, "Assigned sales executive is required"),
  property: z.string().min(1, "Target property is required"),
  roomNights: z.number().min(1, "At least 1 room night required"),
  notes: z.string().optional(),
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;
export type PipelineStageType = z.infer<typeof pipelineStageEnum>;
