import {
  BookingEnquiryFormValues,
  ReservationFormValues,
  EnquiryStatusType,
  ReservationStatusType,
  PaymentStatusType,
} from "../validations/reservation-schema";

export interface BookingEnquiry extends BookingEnquiryFormValues {
  id: string;
  createdAt: string;
}

export interface Reservation extends ReservationFormValues {
  id: string;
  createdAt: string;
}

export interface RoomConflictResult {
  hasConflict: boolean;
  conflictingReservation?: Reservation;
  message?: string;
}

// Mock Initial Enquiries
const INITIAL_ENQUIRIES: BookingEnquiry[] = [
  {
    id: "ENQ-1001",
    enquiryNumber: "ENQ-2026-101",
    guest: "Dr. Vikramaditya Singhania",
    corporateClient: "Reliance Enterprise Solutions",
    property: "Monday Hotels Grand Royale Mumbai",
    checkInDate: "2026-10-10",
    checkOutDate: "2026-10-15",
    numberOfGuests: 2,
    roomType: "Presidential Sky Suite",
    source: "Corporate Direct",
    estimatedValue: 18500,
    assignedStaff: "Priya Sharma",
    status: "QUALIFIED",
    notes: "Requires goose down pillows and sparkling water in suite upon check-in.",
    createdAt: "2026-09-20",
  },
  {
    id: "ENQ-1002",
    enquiryNumber: "ENQ-2026-102",
    guest: "Elena Rostova",
    corporateClient: "Infosys Global Systems",
    property: "Monday Hotels Tech Hub Bengaluru",
    checkInDate: "2026-11-01",
    checkOutDate: "2026-11-05",
    numberOfGuests: 1,
    roomType: "Executive Club Suite",
    source: "Website Direct",
    estimatedValue: 12500,
    assignedStaff: "Vikram Malhotra",
    status: "QUOTATION",
    notes: "Requires late check-out till 2:00 PM for London flight.",
    createdAt: "2026-09-22",
  },
  {
    id: "ENQ-1003",
    enquiryNumber: "ENQ-2026-103",
    guest: "Rajeshwar Kapoor",
    corporateClient: "Kapoor Investments",
    property: "Monday Hotels Palace Udaipur",
    checkInDate: "2026-12-20",
    checkOutDate: "2026-12-25",
    numberOfGuests: 4,
    roomType: "Royal Lakeview Pavilion",
    source: "Call Center",
    estimatedValue: 31000,
    assignedStaff: "Devendra Singh",
    status: "NEW",
    notes: "Family holiday reservation inquiry with private lake motorboat access.",
    createdAt: "2026-09-24",
  },
  {
    id: "ENQ-1004",
    enquiryNumber: "ENQ-2026-104",
    guest: "Marcus Vance",
    corporateClient: "TCS Enterprise Global",
    property: "Monday Hotels Resort & Spa Goa",
    checkInDate: "2026-11-15",
    checkOutDate: "2026-11-20",
    numberOfGuests: 2,
    roomType: "Oceanfront Private Pool Villa",
    source: "OTA Concierge",
    estimatedValue: 24200,
    assignedStaff: "Rajesh Nair",
    status: "NEGOTIATION",
    notes: "Requesting complimentary spa voucher for anniversary.",
    createdAt: "2026-09-23",
  },
];

// Mock Initial Reservations
const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "RES-5001",
    reservationNumber: "RES-2026-501",
    guest: "Dr. Vikramaditya Singhania",
    property: "Monday Hotels Grand Royale Mumbai",
    room: "Presidential Sky Suite 1001",
    checkIn: "2026-10-10",
    checkOut: "2026-10-15",
    numberOfGuests: 2,
    rate: 3700,
    totalAmount: 18500,
    paymentStatus: "PAID",
    reservationStatus: "CONFIRMED",
    bookingSource: "Corporate Contract",
    specialRequests: "Butler Service: Rajesh, Sparkling Water, 21°C Room Climate",
    notes: "VIP Black Diamond member.",
    convertedFromEnquiryNumber: "ENQ-2026-101",
    createdAt: "2026-09-21",
  },
  {
    id: "RES-5002",
    reservationNumber: "RES-2026-502",
    guest: "Sophia Chen",
    property: "Monday Hotels Resort & Spa Goa",
    room: "Oceanfront Villa 12",
    checkIn: "2026-10-01",
    checkOut: "2026-10-06",
    numberOfGuests: 2,
    rate: 4500,
    totalAmount: 22500,
    paymentStatus: "PARTIAL",
    reservationStatus: "CONFIRMED",
    bookingSource: "Direct Website",
    specialRequests: "Hypoallergenic pillows, Pescatarian dining",
    notes: "Silver VIP member.",
    createdAt: "2026-09-15",
  },
  {
    id: "RES-5003",
    reservationNumber: "RES-2026-503",
    guest: "Aarav Mehta",
    property: "Monday Hotels Grand Royale Mumbai",
    room: "Executive Suite 304",
    checkIn: "2026-09-24",
    checkOut: "2026-09-28",
    numberOfGuests: 1,
    rate: 1800,
    totalAmount: 7200,
    paymentStatus: "PAID",
    reservationStatus: "CHECKED_IN",
    bookingSource: "Corporate Direct",
    specialRequests: "High floor",
    notes: "Currently checked in.",
    createdAt: "2026-09-20",
  },
];

let enquiriesStore: BookingEnquiry[] = [...INITIAL_ENQUIRIES];
let reservationsStore: Reservation[] = [...INITIAL_RESERVATIONS];

// --- BOOKING CONFLICT CHECKING ENGINE ---
export function checkBookingConflict(
  property: string,
  room: string,
  checkIn: string,
  checkOut: string,
  excludeReservationId?: string
): RoomConflictResult {
  const newIn = new Date(checkIn).getTime();
  const newOut = new Date(checkOut).getTime();

  if (newOut <= newIn) {
    return {
      hasConflict: true,
      message: "Check-out date must be after check-in date.",
    };
  }

  const activeReservations = reservationsStore.filter((r) => {
    if (r.id === excludeReservationId) return false;
    if (r.property !== property || r.room !== room) return false;
    // Only check active/confirmed/checked-in/pending reservations
    return ["CONFIRMED", "CHECKED_IN", "PENDING"].includes(r.reservationStatus);
  });

  for (const existing of activeReservations) {
    const existIn = new Date(existing.checkIn).getTime();
    const existOut = new Date(existing.checkOut).getTime();

    // Overlap condition: newIn < existOut && newOut > existIn
    if (newIn < existOut && newOut > existIn) {
      return {
        hasConflict: true,
        conflictingReservation: existing,
        message: `Booking Conflict Detected! Room "${room}" at ${property} is already reserved by ${existing.guest} (${existing.reservationNumber}) from ${existing.checkIn} to ${existing.checkOut}.`,
      };
    }
  }

  return { hasConflict: false };
}

// --- BOOKING ENQUIRIES SERVICE API ---
export function getEnquiries(): BookingEnquiry[] {
  return enquiriesStore;
}

export function getEnquiryById(id: string): BookingEnquiry | undefined {
  return enquiriesStore.find((e) => e.id === id);
}

export function createEnquiry(data: BookingEnquiryFormValues): BookingEnquiry {
  const newEnquiry: BookingEnquiry = {
    ...data,
    id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  enquiriesStore = [newEnquiry, ...enquiriesStore];
  return newEnquiry;
}

export function updateEnquiry(id: string, data: Partial<BookingEnquiryFormValues>): BookingEnquiry | undefined {
  const idx = enquiriesStore.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  enquiriesStore[idx] = { ...enquiriesStore[idx], ...data };
  return enquiriesStore[idx];
}

export function updateEnquiryStatus(id: string, status: EnquiryStatusType): BookingEnquiry | undefined {
  return updateEnquiry(id, { status });
}

export function assignEnquiryStaff(id: string, assignedStaff: string): BookingEnquiry | undefined {
  return updateEnquiry(id, { assignedStaff });
}

// --- RESERVATIONS SERVICE API ---
export function getReservations(): Reservation[] {
  return reservationsStore;
}

export function getReservationById(id: string): Reservation | undefined {
  return reservationsStore.find((r) => r.id === id);
}

export function createReservation(data: ReservationFormValues): { reservation?: Reservation; conflict?: RoomConflictResult } {
  // Check for conflicts before creating
  const conflict = checkBookingConflict(data.property, data.room, data.checkIn, data.checkOut);
  if (conflict.hasConflict) {
    return { conflict };
  }

  const newReservation: Reservation = {
    ...data,
    id: `RES-${Math.floor(5000 + Math.random() * 4000)}`,
    createdAt: new Date().toISOString().split("T")[0],
  };

  reservationsStore = [newReservation, ...reservationsStore];
  return { reservation: newReservation };
}

export function updateReservation(id: string, data: Partial<ReservationFormValues>): { reservation?: Reservation; conflict?: RoomConflictResult } {
  const idx = reservationsStore.findIndex((r) => r.id === id);
  if (idx === -1) return { conflict: { hasConflict: true, message: "Reservation not found" } };

  const current = reservationsStore[idx];
  const targetProperty = data.property || current.property;
  const targetRoom = data.room || current.room;
  const targetCheckIn = data.checkIn || current.checkIn;
  const targetCheckOut = data.checkOut || current.checkOut;

  // Check for conflicts if room or dates changed
  const conflict = checkBookingConflict(targetProperty, targetRoom, targetCheckIn, targetCheckOut, id);
  if (conflict.hasConflict) {
    return { conflict };
  }

  reservationsStore[idx] = { ...reservationsStore[idx], ...data };
  return { reservation: reservationsStore[idx] };
}

export function updateReservationStatus(id: string, reservationStatus: ReservationStatusType): Reservation | undefined {
  const result = updateReservation(id, { reservationStatus });
  return result.reservation;
}

export function updatePaymentStatus(id: string, paymentStatus: PaymentStatusType): Reservation | undefined {
  const result = updateReservation(id, { paymentStatus });
  return result.reservation;
}

// --- CONVERT ENQUIRY INTO RESERVATION ---
export function convertEnquiryToReservation(
  enquiryId: string,
  room: string,
  rate: number,
  bookingSource: string,
  specialRequests?: string
): { reservation?: Reservation; conflict?: RoomConflictResult } {
  const enquiry = getEnquiryById(enquiryId);
  if (!enquiry) {
    return { conflict: { hasConflict: true, message: "Enquiry not found" } };
  }

  // Calculate nights
  const checkInDate = new Date(enquiry.checkInDate);
  const checkOutDate = new Date(enquiry.checkOutDate);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = rate * nights;

  const resNumber = `RES-2026-${Math.floor(600 + Math.random() * 399)}`;

  const resValues: ReservationFormValues = {
    reservationNumber: resNumber,
    guest: enquiry.guest,
    property: enquiry.property,
    room,
    checkIn: enquiry.checkInDate,
    checkOut: enquiry.checkOutDate,
    numberOfGuests: enquiry.numberOfGuests,
    rate,
    totalAmount,
    paymentStatus: "PENDING",
    reservationStatus: "CONFIRMED",
    bookingSource: bookingSource || enquiry.source,
    specialRequests: specialRequests || enquiry.notes || "",
    notes: `Converted from enquiry ${enquiry.enquiryNumber}`,
    convertedFromEnquiryNumber: enquiry.enquiryNumber,
  };

  const createResult = createReservation(resValues);
  if (createResult.conflict && createResult.conflict.hasConflict) {
    return createResult;
  }

  // Mark enquiry as CONFIRMED
  updateEnquiryStatus(enquiryId, "CONFIRMED");

  return createResult;
}
