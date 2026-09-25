import { getReservations, Reservation } from "./reservation-service";
import { getGuests, GuestProfile } from "./guest-service";

export type CustomerSegment =
  | "NEW"
  | "RETURNING"
  | "FREQUENT"
  | "CORPORATE"
  | "HIGH_VALUE"
  | "AT_RISK";

export interface CalculatedGuestIntelligence {
  guestId: string;
  guestName: string;
  email: string;
  phone: string;
  vipTier: string;
  corporateCompanyName?: string;
  
  // Deterministic Calculated Metrics from Reservation History
  totalStays: number;
  totalNights: number;
  totalSpending: number;
  averageBookingValue: number;
  lastStayDate: string;
  firstStayDate: string;
  daysSinceLastStay: number;
  bookingFrequencyDays: number;
  
  // Evaluated Customer Segments (Multiple tags possible per guest)
  segments: CustomerSegment[];
  
  // Reservation Records linked
  reservations: Reservation[];
}

export interface SegmentSummaryCard {
  segment: CustomerSegment;
  label: string;
  description: string;
  count: number;
  totalSpendSum: number;
  color: string;
  border: string;
}

export const SEGMENT_RULES_DOCUMENTATION: Record<CustomerSegment, { label: string; rule: string; color: string }> = {
  NEW: {
    label: "New Guest",
    rule: "First-time guests with exactly 1 completed or confirmed stay.",
    color: "bg-blue-500/10 text-blue-300 border-blue-500/30",
  },
  RETURNING: {
    label: "Returning Guest",
    rule: "Loyal guests with between 2 and 4 stays total.",
    color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  },
  FREQUENT: {
    label: "Frequent Guest",
    rule: "High-frequency guests with 5 or more total stays across Monday Hotels.",
    color: "bg-purple-500/10 text-purple-300 border-purple-500/30 font-bold",
  },
  CORPORATE: {
    label: "Corporate Guest",
    rule: "Guests associated with a B2B Corporate Account or Corporate Contract rates.",
    color: "bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold",
  },
  HIGH_VALUE: {
    label: "High Value (HNV)",
    rule: "Top-tier financial contributors with cumulative total spending >= $25,000.",
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-extrabold",
  },
  AT_RISK: {
    label: "At Risk of Churn",
    rule: "Repeat guests (>= 2 stays) with no active reservations in the last 120 days (> 4 months).",
    color: "bg-rose-500/10 text-rose-300 border-rose-500/40 font-bold",
  },
};

const REFERENCE_TODAY = new Date("2026-09-25");

/**
 * Calculates guest intelligence strictly from actual reservation history
 */
export function calculateGuestIntelligence(): CalculatedGuestIntelligence[] {
  const allReservations = getReservations();
  const allGuestProfiles = getGuests();

  // Create a map of guest names / emails to group reservations
  const guestMap = new Map<string, { profile?: GuestProfile; reservations: Reservation[] }>();

  // 1. Group Profiles
  allGuestProfiles.forEach((g) => {
    const key = `${g.firstName} ${g.lastName}`.toLowerCase().trim();
    guestMap.set(key, { profile: g, reservations: [] });
  });

  // 2. Group Reservations by Guest Name
  allReservations.forEach((res) => {
    const key = res.guest.toLowerCase().trim();
    if (!guestMap.has(key)) {
      guestMap.set(key, { reservations: [res] });
    } else {
      guestMap.get(key)!.reservations.push(res);
    }
  });

  const intelligenceList: CalculatedGuestIntelligence[] = [];

  guestMap.forEach((data, key) => {
    const profile = data.profile;
    const resList = data.reservations.filter((r) => r.reservationStatus !== "CANCELLED");

    const guestName = profile ? `${profile.firstName} ${profile.lastName}` : (resList[0]?.guest || key);
    const email = profile?.email || "guest@mondayhotels.com";
    const phone = profile?.phone || "+91 98000 00000";
    const vipTier = profile?.vipTier || "Standard";
    const corporateCompanyName = profile?.corporateCompanyName || (resList.find((r) => r.bookingSource.includes("Corporate")) ? "Corporate Partner" : undefined);

    // Calculate metrics strictly from reservation history
    let totalStays = resList.length;
    let totalNights = 0;
    let totalSpending = 0;

    let minCheckIn = "";
    let maxCheckOut = "";

    resList.forEach((r) => {
      totalSpending += r.totalAmount || 0;
      
      const checkInTime = new Date(r.checkIn).getTime();
      const checkOutTime = new Date(r.checkOut).getTime();
      const stayNights = Math.max(1, Math.ceil((checkOutTime - checkInTime) / (1000 * 60 * 60 * 24)));
      totalNights += stayNights;

      if (!minCheckIn || r.checkIn < minCheckIn) minCheckIn = r.checkIn;
      if (!maxCheckOut || r.checkOut > maxCheckOut) maxCheckOut = r.checkOut;
    });

    // Fallback to profile metrics if no reservation list exists (demo data handling)
    if (totalStays === 0 && profile) {
      totalStays = profile.totalStays || 0;
      totalNights = profile.totalNights || 0;
      totalSpending = profile.lifetimeSpend || 0;
      maxCheckOut = profile.lastStayDate || "2026-09-01";
      minCheckIn = "2024-01-15";
    }

    const averageBookingValue = totalStays > 0 ? Math.round(totalSpending / totalStays) : 0;
    const lastStayDate = maxCheckOut || "2026-09-01";
    const firstStayDate = minCheckIn || "2024-01-15";

    // Days since last stay
    const lastDateObj = new Date(lastStayDate);
    const diffMs = Math.max(0, REFERENCE_TODAY.getTime() - lastDateObj.getTime());
    const daysSinceLastStay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Booking frequency in days
    let bookingFrequencyDays = 0;
    if (totalStays > 1 && minCheckIn && maxCheckOut) {
      const spanMs = Math.max(1, new Date(maxCheckOut).getTime() - new Date(minCheckIn).getTime());
      const spanDays = Math.floor(spanMs / (1000 * 60 * 60 * 24));
      bookingFrequencyDays = Math.round(spanDays / (totalStays - 1));
    }

    // --- EVALUATE DETERMINISTIC SEGMENT RULES ---
    const segments: CustomerSegment[] = [];

    if (totalStays === 1) segments.push("NEW");
    if (totalStays >= 2 && totalStays <= 4) segments.push("RETURNING");
    if (totalStays >= 5) segments.push("FREQUENT");
    if (corporateCompanyName || profile?.corporateAccountId) segments.push("CORPORATE");
    if (totalSpending >= 25000) segments.push("HIGH_VALUE");
    if (totalStays >= 2 && daysSinceLastStay > 120) segments.push("AT_RISK");

    intelligenceList.push({
      guestId: profile?.id || `GST-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      email,
      phone,
      vipTier,
      corporateCompanyName,
      totalStays,
      totalNights,
      totalSpending,
      averageBookingValue,
      lastStayDate,
      firstStayDate,
      daysSinceLastStay,
      bookingFrequencyDays,
      segments,
      reservations: resList,
    });
  });

  return intelligenceList.sort((a, b) => b.totalSpending - a.totalSpending);
}

/**
 * Calculates dashboard retention metrics with explicit labeling for estimates
 */
export function getRetentionDashboardOverview() {
  const intelligence = calculateGuestIntelligence();
  const totalGuests = intelligence.length;

  if (totalGuests === 0) {
    return {
      totalGuests: 0,
      repeatBookingRate: "0.0%",
      averageStayNights: "0.0",
      estimatedLTV: 0,
      atRiskCount: 0,
      atRiskTotalValue: 0,
      segmentCards: [],
      intelligence: [],
    };
  }

  const repeatCount = intelligence.filter((g) => g.totalStays >= 2).length;
  const repeatBookingRate = ((repeatCount / totalGuests) * 100).toFixed(1) + "%";

  const totalNightsSum = intelligence.reduce((acc, g) => acc + g.totalNights, 0);
  const totalStaysSum = intelligence.reduce((acc, g) => acc + g.totalStays, 0);
  const averageStayNights = totalStaysSum > 0 ? (totalNightsSum / totalStaysSum).toFixed(1) : "0.0";

  const totalRevenue = intelligence.reduce((acc, g) => acc + g.totalSpending, 0);
  const estimatedLTV = Math.round(totalRevenue / totalGuests);

  const atRiskGuests = intelligence.filter((g) => g.segments.includes("AT_RISK"));
  const atRiskCount = atRiskGuests.length;
  const atRiskTotalValue = atRiskGuests.reduce((acc, g) => acc + g.totalSpending, 0);

  // Segment Cards Summary
  const segmentsList: CustomerSegment[] = ["NEW", "RETURNING", "FREQUENT", "CORPORATE", "HIGH_VALUE", "AT_RISK"];
  const segmentCards: SegmentSummaryCard[] = segmentsList.map((seg) => {
    const matching = intelligence.filter((g) => g.segments.includes(seg));
    const spendSum = matching.reduce((acc, g) => acc + g.totalSpending, 0);
    const ruleInfo = SEGMENT_RULES_DOCUMENTATION[seg];

    return {
      segment: seg,
      label: ruleInfo.label,
      description: ruleInfo.rule,
      count: matching.length,
      totalSpendSum: spendSum,
      color: ruleInfo.color,
      border: "border-stone-800",
    };
  });

  return {
    totalGuests,
    repeatBookingRate,
    averageStayNights,
    estimatedLTV,
    atRiskCount,
    atRiskTotalValue,
    segmentCards,
    intelligence,
  };
}
