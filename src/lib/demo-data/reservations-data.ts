export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export type PaymentStatus = "PAID" | "PARTIAL" | "PENDING" | "REFUNDED";

export type VIPTier = "BLACK_DIAMOND" | "PLATINUM" | "GOLD" | "SILVER" | "STANDARD";

export interface ReservationItem {
  id: string;
  code: string;
  property: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  totalAmount: number;
  depositAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  vipTier: VIPTier;
  specialRequests: string;
  createdAt: string;
}

export type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "QUOTATION"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "CANCELLED";

export interface BookingEnquiryItem {
  id: string;
  enquiryCode: string;
  property: string;
  guestName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  roomsRequested: number;
  guestsCount: number;
  estimatedBudget: number;
  specialRequests: string;
  status: EnquiryStatus;
  slaTimeLeft: string;
  createdAt: string;
}

export const MOCK_RESERVATIONS: ReservationItem[] = [
  {
    id: "res-101",
    code: "RES-2026-881",
    property: "Monday Grand Palace, Delhi",
    guestName: "Deepak & Aarti Varma",
    email: "deepak.varma@enterprise-example.com",
    phone: "+91 98100 44556",
    roomType: "Presidential Suite",
    roomNumber: "Suite 804",
    checkInDate: "2026-09-25",
    checkOutDate: "2026-09-28",
    adultsCount: 2,
    childrenCount: 0,
    totalAmount: 4200,
    depositAmount: 4200,
    status: "CHECKED_IN",
    paymentStatus: "PAID",
    vipTier: "BLACK_DIAMOND",
    specialRequests: "Airport BMW 7-series transfer, Champagne on arrival, High floor.",
    createdAt: "2026-09-15",
  },
  {
    id: "res-102",
    code: "RES-2026-880",
    property: "Monday Silicon Heights, Bengaluru",
    guestName: "Microsoft Leadership Delegation",
    email: "events@microsoft-example.com",
    phone: "+91 98450 99887",
    roomType: "Executive Suites Block",
    roomNumber: "Fl 6-7 (15 Rooms)",
    checkInDate: "2026-09-26",
    checkOutDate: "2026-10-01",
    adultsCount: 15,
    childrenCount: 0,
    totalAmount: 18500,
    depositAmount: 18500,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    vipTier: "PLATINUM",
    specialRequests: "Dedicated fiber network, High-speed ethernet in all rooms.",
    createdAt: "2026-09-12",
  },
  {
    id: "res-103",
    code: "RES-2026-879",
    property: "Monday Beach Resort, Goa",
    guestName: "Rohan & Natasha Sethi",
    email: "rohan.sethi@gmail.com",
    phone: "+91 98765 11223",
    roomType: "Deluxe Ocean Villa",
    roomNumber: "Villa 12",
    checkInDate: "2026-09-27",
    checkOutDate: "2026-10-02",
    adultsCount: 2,
    childrenCount: 1,
    totalAmount: 3800,
    depositAmount: 1900,
    status: "CONFIRMED",
    paymentStatus: "PARTIAL",
    vipTier: "GOLD",
    specialRequests: "Sunset beach dinner setup, Late check-out requested.",
    createdAt: "2026-09-18",
  },
  {
    id: "res-104",
    code: "RES-2026-878",
    property: "Monday Luxury Suites, Mumbai",
    guestName: "KPMG Advisory Team",
    email: "travel@kpmg-example.com",
    phone: "+91 98200 33445",
    roomType: "Executive King Rooms",
    roomNumber: "Rooms 401-420",
    checkInDate: "2026-09-29",
    checkOutDate: "2026-10-04",
    adultsCount: 20,
    childrenCount: 0,
    totalAmount: 24500,
    depositAmount: 24500,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    vipTier: "PLATINUM",
    specialRequests: "Early check-in at 09:00 AM, Boardroom access on 4th floor.",
    createdAt: "2026-09-10",
  },
  {
    id: "res-105",
    code: "RES-2026-877",
    property: "Monday Heritage Palace, Jaipur",
    guestName: "Lord Arthur Pendelton",
    email: "arthur.pendelton@uk-privy.org",
    phone: "+44 20 7946 0912",
    roomType: "Heritage Royal Suite",
    roomNumber: "Royal Suite 01",
    checkInDate: "2026-10-02",
    checkOutDate: "2026-10-08",
    adultsCount: 2,
    childrenCount: 0,
    totalAmount: 9600,
    depositAmount: 0,
    status: "PENDING",
    paymentStatus: "PENDING",
    vipTier: "BLACK_DIAMOND",
    specialRequests: "Butler service 24/7, Private security clearance, Royal courtyard dining.",
    createdAt: "2026-09-22",
  },
];

export const MOCK_ENQUIRIES: BookingEnquiryItem[] = [
  {
    id: "enq-201",
    enquiryCode: "ENQ-2026-921",
    property: "Monday Heritage Palace, Jaipur",
    guestName: "Devendra Rathore",
    email: "devendra.rathore@rajasthan-royal.in",
    phone: "+91 98290 12345",
    checkInDate: "2026-11-12",
    checkOutDate: "2026-11-16",
    roomsRequested: 45,
    guestsCount: 120,
    estimatedBudget: 48000,
    specialRequests: "Pre-wedding sangeet venue setup, Royal Elephant procession arrangement.",
    status: "QUOTATION",
    slaTimeLeft: "14 mins remaining",
    createdAt: "2026-09-25",
  },
  {
    id: "enq-202",
    enquiryCode: "ENQ-2026-920",
    property: "Monday Beach Resort, Goa",
    guestName: "Sarah Jenkins",
    email: "s.jenkins@expedia-luxury.com",
    phone: "+1 415 555 0199",
    checkInDate: "2026-12-20",
    checkOutDate: "2026-12-28",
    roomsRequested: 12,
    guestsCount: 24,
    estimatedBudget: 28500,
    specialRequests: "New Year Eve Gala Dinner tickets included, Oceanfront villas.",
    status: "QUALIFIED",
    slaTimeLeft: "32 mins remaining",
    createdAt: "2026-09-25",
  },
  {
    id: "enq-203",
    enquiryCode: "ENQ-2026-919",
    property: "Monday Luxury Suites, Mumbai",
    guestName: "Vikram Malhotra",
    email: "v.malhotra@tata-example.com",
    phone: "+91 98210 98765",
    checkInDate: "2026-10-18",
    checkOutDate: "2026-10-20",
    roomsRequested: 80,
    guestsCount: 160,
    estimatedBudget: 95000,
    specialRequests: "Global Investor Summit, Ballroom B & C setup with audio-visual equipment.",
    status: "NEGOTIATION",
    slaTimeLeft: "45 mins remaining",
    createdAt: "2026-09-24",
  },
  {
    id: "enq-204",
    enquiryCode: "ENQ-2026-918",
    property: "Monday Grand Palace, Delhi",
    guestName: "Claire Dupont",
    email: "c.dupont@embassy-france.in",
    phone: "+91 11 2419 8000",
    checkInDate: "2027-01-10",
    checkOutDate: "2027-01-14",
    roomsRequested: 150,
    guestsCount: 300,
    estimatedBudget: 180000,
    specialRequests: "Diplomatic Delegation Security, Multi-lingual Concierge staff.",
    status: "CONFIRMED",
    slaTimeLeft: "Completed",
    createdAt: "2026-09-20",
  },
];

export function getReservationStatusBadge(status: ReservationStatus): { label: string; class: string } {
  switch (status) {
    case "CHECKED_IN":
      return { label: "Checked In", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
    case "CONFIRMED":
      return { label: "Confirmed", class: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
    case "PENDING":
      return { label: "Pending Guarantee", class: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    case "CHECKED_OUT":
      return { label: "Checked Out", class: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
    case "CANCELLED":
      return { label: "Cancelled", class: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
  }
}

export function getPaymentBadge(status: PaymentStatus): { label: string; class: string } {
  switch (status) {
    case "PAID":
      return { label: "Fully Paid", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
    case "PARTIAL":
      return { label: "Partial Deposit", class: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    case "PENDING":
      return { label: "Payment Due", class: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
    case "REFUNDED":
      return { label: "Refunded", class: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
  }
}

export function getVIPTierBadge(tier: VIPTier): { label: string; class: string } {
  switch (tier) {
    case "BLACK_DIAMOND":
      return { label: "Black Diamond", class: "bg-purple-500/20 text-purple-300 border-purple-400 font-extrabold" };
    case "PLATINUM":
      return { label: "Platinum VIP", class: "bg-amber-500/20 text-amber-300 border-amber-400 font-bold" };
    case "GOLD":
      return { label: "Gold Member", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" };
    case "SILVER":
      return { label: "Silver Member", class: "bg-slate-400/10 text-slate-300 border-slate-500/30" };
    default:
      return { label: "Standard", class: "bg-slate-800 text-slate-400 border-slate-700" };
  }
}
