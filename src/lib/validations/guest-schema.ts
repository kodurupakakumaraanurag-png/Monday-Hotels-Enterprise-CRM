import { z } from "zod";

export const vipTierEnum = z.enum([
  "Black Diamond",
  "Platinum",
  "Gold",
  "Silver",
  "Standard",
]);

export const guestStatusEnum = z.enum(["Active", "Inactive", "Blacklisted"]);

export const preferenceCategoryEnum = z.enum([
  "Concierge",
  "Housekeeping",
  "F&B",
  "General",
]);

export const stayRecordSchema = z.object({
  id: z.string(),
  reservationCode: z.string(),
  propertyName: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  roomType: z.string(),
  totalAmount: z.number(),
  status: z.enum(["Completed", "Cancelled", "Active", "No Show"]),
});

export const guestNoteSchema = z.object({
  id: z.string(),
  category: preferenceCategoryEnum,
  text: z.string().min(1, "Note content cannot be empty"),
  author: z.string(),
  createdAt: z.string(),
});

export const guestSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(7, "Phone number is required"),
  vipTier: vipTierEnum,
  status: guestStatusEnum,
  avatarUrl: z.string().optional(),
  totalStays: z.number().min(0),
  totalNights: z.number().min(0),
  lifetimeSpend: z.number().min(0),
  averageDailyRate: z.number().min(0),
  lastStayDate: z.string().optional(),
  preferredProperty: z.string().min(1, "Preferred property is required"),
  preferredRoomType: z.string().min(1, "Preferred room type is required"),
  
  // Preferences
  pillowType: z.string().optional(),
  floorPreference: z.string().optional(),
  roomLocation: z.string().optional(),
  temperatureSetting: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  anniversary: z.string().optional(),
  birthday: z.string().optional(),
  specialRequests: z.string().optional(),

  // Relationships
  corporateAccountId: z.string().optional(),
  corporateCompanyName: z.string().optional(),

  tags: z.array(z.string()).optional(),
});

export type GuestFormValues = z.infer<typeof guestSchema>;
export type StayRecord = z.infer<typeof stayRecordSchema>;
export type GuestNote = z.infer<typeof guestNoteSchema>;
export type VIPTier = z.infer<typeof vipTierEnum>;
