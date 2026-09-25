import { z } from "zod";

export const enquiryStatusEnum = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTATION",
  "NEGOTIATION",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "LOST",
]);

export const reservationStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
]);

export const paymentStatusEnum = z.enum([
  "PENDING",
  "PARTIAL",
  "PAID",
  "REFUNDED",
]);

export const bookingEnquirySchema = z.object({
  id: z.string().optional(),
  enquiryNumber: z.string().min(1, "Enquiry number is required"),
  guest: z.string().min(2, "Guest name is required"),
  corporateClient: z.string().optional(),
  property: z.string().min(1, "Property selection is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  numberOfGuests: z.number().min(1, "At least 1 guest required"),
  roomType: z.string().min(1, "Room type is required"),
  source: z.string().min(1, "Source is required"),
  estimatedValue: z.number().min(0, "Estimated value must be non-negative"),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
  status: enquiryStatusEnum,
  notes: z.string().optional(),
});

export const reservationSchema = z.object({
  id: z.string().optional(),
  reservationNumber: z.string().min(1, "Reservation number is required"),
  guest: z.string().min(2, "Guest name is required"),
  property: z.string().min(1, "Property is required"),
  room: z.string().min(1, "Room assignment is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  numberOfGuests: z.number().min(1, "At least 1 guest required"),
  rate: z.number().min(0, "Daily rate must be non-negative"),
  totalAmount: z.number().min(0, "Total amount must be non-negative"),
  paymentStatus: paymentStatusEnum,
  reservationStatus: reservationStatusEnum,
  bookingSource: z.string().min(1, "Booking source is required"),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
  convertedFromEnquiryNumber: z.string().optional(),
});

export type BookingEnquiryFormValues = z.infer<typeof bookingEnquirySchema>;
export type ReservationFormValues = z.infer<typeof reservationSchema>;
export type EnquiryStatusType = z.infer<typeof enquiryStatusEnum>;
export type ReservationStatusType = z.infer<typeof reservationStatusEnum>;
export type PaymentStatusType = z.infer<typeof paymentStatusEnum>;
