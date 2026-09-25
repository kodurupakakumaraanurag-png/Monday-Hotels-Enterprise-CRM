import { z } from "zod";

export const priorityLevelEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type PriorityLevel = z.infer<typeof priorityLevelEnum>;

export const pipelineStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTATION",
  "NEGOTIATION",
  "CONFIRMED",
  "LOST",
]);
export type PipelineStatus = z.infer<typeof pipelineStatusEnum>;

export const allocationStatusEnum = z.enum([
  "UNASSIGNED",
  "ASSIGNED",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
]);
export type AllocationStatus = z.infer<typeof allocationStatusEnum>;

// Zod schema for 26-field Enterprise Lead Structure
export const leadSchema = z.object({
  id: z.string().optional(),
  // 1. Company Name
  companyName: z.string().min(2, "Company Name must be at least 2 characters."),
  // 2. Industry Domain
  industryDomain: z.string().min(2, "Industry Domain is required."),
  // 3. Location / City
  location: z.string().min(2, "Location / City is required."),
  // 4. Website URL
  websiteUrl: z.string().url("Please enter a valid URL (e.g. https://company.com)").or(z.string().length(0)),
  // 5. Contact POC Name
  contactPocName: z.string().min(2, "Contact POC Name is required."),
  // 6. Designation / Role
  designation: z.string().min(2, "Designation / Role is required."),
  // 7. Phone Number
  phone: z.string().min(5, "Valid Phone Number is required."),
  // 8. Email Address
  email: z.string().email("Please enter a valid email address."),
  // 9. Business Overview
  businessOverview: z.string().min(5, "Business Overview is required."),
  // 10. Problem / Friction
  problemFriction: z.string().min(5, "Problem / Friction description is required."),
  // 11. Project Requirement
  projectRequirement: z.string().min(5, "Project Requirement details required."),
  // 12. Placement Opportunity
  placementOpportunity: z.string().min(5, "Placement Opportunity is required."),
  // 13. Priority Level
  priorityLevel: priorityLevelEnum,
  // 14. Pipeline Status
  pipelineStatus: pipelineStatusEnum,
  // 15. Next Action
  nextAction: z.string().min(2, "Next Action description required."),
  // 16. Date Added
  dateAdded: z.string().optional(),
  // 17. Lead Source
  leadSource: z.string().min(2, "Lead Source is required."),
  // 18. Contact Method
  contactMethod: z.string().min(2, "Contact Method is required."),
  // 19. Digital Presence Score (0 - 5)
  digitalPresenceScore: z.number().min(0).max(5),
  // 20. Hiring Activity Score (0 - 5)
  hiringActivityScore: z.number().min(0).max(5),
  // 21. Tech Stack Fit Score (0 - 5)
  techStackFitScore: z.number().min(0).max(5),
  // 22. Funding / Revenue Score (0 - 5)
  fundingRevenueScore: z.number().min(0).max(5),
  // 23. Project Urgency Score (0 - 5)
  projectUrgencyScore: z.number().min(0).max(5),
  // 24. Budget Clarity Score (0 - 5)
  budgetClarityScore: z.number().min(0).max(5),
  // 25. Total Lead Score (0 - 30)
  totalLeadScore: z.number().min(0).max(30).optional(),
  // Separate field to preserve imported legacy score if conflicting
  importedSourceScore: z.number().optional(),
  // 26. Project Allocation Status
  projectAllocationStatus: allocationStatusEnum,

  assignedTo: z.string().optional(),
  targetProperty: z.string().optional(),
  estimatedValue: z.number().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Helper to compute total score out of 30 from the 6 components
export function computeTotalLeadScore(data: Partial<LeadFormData>): number {
  if (data.importedSourceScore !== undefined) {
    return data.importedSourceScore;
  }
  const sum =
    (data.digitalPresenceScore || 0) +
    (data.hiringActivityScore || 0) +
    (data.techStackFitScore || 0) +
    (data.fundingRevenueScore || 0) +
    (data.projectUrgencyScore || 0) +
    (data.budgetClarityScore || 0);
  return Math.min(30, Math.max(0, sum));
}
