import { z } from "zod";

export const companyStatusEnum = z.enum(["ACTIVE", "PROSPECT", "INACTIVE", "VIP_ACCOUNT"]);
export type CompanyStatus = z.infer<typeof companyStatusEnum>;

export const companySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Company Name must be at least 2 characters."),
  industry: z.string().min(2, "Industry is required."),
  website: z.string().url("Valid URL required (e.g. https://company.com)").or(z.string().length(0)),
  corporateCode: z.string().min(2, "Corporate Discount Code required."),
  contractDiscountPct: z.number().min(0).max(100),
  accountManager: z.string().min(2, "Account Manager name required."),
  address: z.string().min(2, "Address is required."),
  city: z.string().min(2, "City is required."),
  country: z.string().min(2, "Country is required."),
  status: companyStatusEnum,
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const contactTypeEnum = z.enum([
  "PRIMARY",
  "BILLING",
  "EVENT_PLANNER",
  "EXECUTIVE",
  "GENERAL",
]);
export type ContactType = z.infer<typeof contactTypeEnum>;

export const contactSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().min(1, "Associated Company is required."),
  firstName: z.string().min(2, "First Name is required."),
  lastName: z.string().min(2, "Last Name is required."),
  email: z.string().email("Valid email address required."),
  phone: z.string().min(5, "Valid phone number required."),
  designation: z.string().min(2, "Designation / Role is required."),
  contactType: contactTypeEnum,
  isPrimaryContact: z.boolean(),
  notes: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
