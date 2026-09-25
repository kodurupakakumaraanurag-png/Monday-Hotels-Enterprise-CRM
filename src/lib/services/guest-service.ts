import { GuestFormValues, StayRecord, GuestNote, VIPTier } from "../validations/guest-schema";

export interface SpendBreakdown {
  room: number;
  fnb: number;
  spa: number;
  extras: number;
}

export interface GuestProfile extends GuestFormValues {
  id: string;
  createdAt: string;
  spendBreakdown: SpendBreakdown;
  stayHistory: StayRecord[];
  notes: GuestNote[];
}

export interface ChurnRiskGuest {
  id: string;
  guestName: string;
  vipTier: VIPTier;
  email: string;
  phone: string;
  lastStayDate: string;
  daysSinceLastStay: number;
  lifetimeSpend: number;
  totalStays: number;
  churnRiskScore: "High" | "Medium" | "Low";
  suggestedAction: string;
}

export interface RetentionCampaign {
  id: string;
  title: string;
  targetAudience: string;
  eligibleGuestsCount: number;
  incentive: string;
  status: "Active" | "Scheduled" | "Completed" | "Draft";
  conversionRate: string;
  projectedRevenue: string;
}

const MOCK_GUESTS: GuestProfile[] = [
  {
    id: "GST-9001",
    firstName: "Vikramaditya",
    lastName: "Singhania",
    email: "v.singhania@singhaniagroup.com",
    phone: "+91 98200 11223",
    vipTier: "Black Diamond",
    status: "Active",
    totalStays: 34,
    totalNights: 88,
    lifetimeSpend: 142500,
    averageDailyRate: 1619,
    lastStayDate: "2026-09-18",
    preferredProperty: "Monday Hotels Grand Royale Mumbai",
    preferredRoomType: "Presidential Sky Suite",
    pillowType: "Goose Down Soft",
    floorPreference: "Top Floor (Penthouse Level)",
    roomLocation: "Away from Elevator / Corner Suite",
    temperatureSetting: "21°C Constant",
    dietaryRestrictions: "Strictly Vegetarian, Gluten-Sensitive",
    anniversary: "11-14",
    birthday: "04-22",
    specialRequests: "Sparkling Water in room upon check-in; Preferred Butler: Rajesh",
    corporateAccountId: "CORP-101",
    corporateCompanyName: "Reliance Enterprise Solutions",
    tags: ["High Net Worth", "Board Chairman", "Frequent Spa User", "Special Concierge Handling"],
    createdAt: "2024-01-15",
    spendBreakdown: {
      room: 98000,
      fnb: 28500,
      spa: 12000,
      extras: 4000,
    },
    stayHistory: [
      {
        id: "STAY-8801",
        reservationCode: "RES-7701",
        propertyName: "Monday Hotels Grand Royale Mumbai",
        checkIn: "2026-09-15",
        checkOut: "2026-09-18",
        roomType: "Presidential Sky Suite",
        totalAmount: 18500,
        status: "Completed",
      },
      {
        id: "STAY-8802",
        reservationCode: "RES-7204",
        propertyName: "Monday Hotels Resort & Spa Goa",
        checkIn: "2026-07-10",
        checkOut: "2026-07-15",
        roomType: "Oceanfront Private Pool Villa",
        totalAmount: 24200,
        status: "Completed",
      },
      {
        id: "STAY-8803",
        reservationCode: "RES-6810",
        propertyName: "Monday Hotels Palace Udaipur",
        checkIn: "2026-04-02",
        checkOut: "2026-04-06",
        roomType: "Royal Lakeview Pavilion",
        totalAmount: 31000,
        status: "Completed",
      },
    ],
    notes: [
      {
        id: "NOTE-1",
        category: "Concierge",
        text: "Guest prefers chauffeur pickup in Audi A8. Requires daily morning Financial Times copy.",
        author: "Priya Sharma (Chief Concierge)",
        createdAt: "2026-09-15 14:30",
      },
      {
        id: "NOTE-2",
        category: "F&B",
        text: "Ensured kitchen uses separate utensils for gluten-sensitive prep. Loves Green Tea with Organic Honey.",
        author: "Chef Sanjeev (Executive Chef)",
        createdAt: "2026-09-16 09:15",
      },
      {
        id: "NOTE-3",
        category: "Housekeeping",
        text: "Prefers 4 goose down pillows and extra silk bathrobes.",
        author: "Sunita R. (Head Housekeeping)",
        createdAt: "2026-09-15 16:00",
      },
    ],
  },
  {
    id: "GST-9002",
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena.rostova@techglobal.io",
    phone: "+44 7700 900123",
    vipTier: "Platinum",
    status: "Active",
    totalStays: 19,
    totalNights: 45,
    lifetimeSpend: 68400,
    averageDailyRate: 1520,
    lastStayDate: "2026-09-02",
    preferredProperty: "Monday Hotels Tech Hub Bengaluru",
    preferredRoomType: "Executive Club Suite",
    pillowType: "Memory Foam Firm",
    floorPreference: "High Floor (15+)",
    roomLocation: "Quiet Wing",
    temperatureSetting: "20°C",
    dietaryRestrictions: "Vegan / Lactose Intolerant",
    birthday: "08-12",
    specialRequests: "Requires Ergonomic Office Chair in study nook",
    corporateAccountId: "CORP-102",
    corporateCompanyName: "Infosys Global Systems",
    tags: ["Tech Executive", "Club Lounge Access", "Late Check-out"],
    createdAt: "2024-03-20",
    spendBreakdown: {
      room: 48000,
      fnb: 14200,
      spa: 4200,
      extras: 2000,
    },
    stayHistory: [
      {
        id: "STAY-8810",
        reservationCode: "RES-7620",
        propertyName: "Monday Hotels Tech Hub Bengaluru",
        checkIn: "2026-08-28",
        checkOut: "2026-09-02",
        roomType: "Executive Club Suite",
        totalAmount: 12500,
        status: "Completed",
      },
      {
        id: "STAY-8811",
        reservationCode: "RES-7105",
        propertyName: "Monday Hotels Grand Royale Mumbai",
        checkIn: "2026-05-12",
        checkOut: "2026-05-16",
        roomType: "Deluxe Ocean View",
        totalAmount: 9400,
        status: "Completed",
      },
    ],
    notes: [
      {
        id: "NOTE-4",
        category: "General",
        text: "Always requests 2:00 PM late check-out due to London evening flight schedule.",
        author: "Amit Patel (Front Office Manager)",
        createdAt: "2026-08-28 11:00",
      },
    ],
  },
  {
    id: "GST-9003",
    firstName: "Rajeshwar",
    lastName: "Kapoor",
    email: "r.kapoor@kapoorinvestments.in",
    phone: "+91 99887 66554",
    vipTier: "Gold",
    status: "Active",
    totalStays: 12,
    totalNights: 28,
    lifetimeSpend: 39200,
    averageDailyRate: 1400,
    lastStayDate: "2026-08-14",
    preferredProperty: "Monday Hotels Capital View New Delhi",
    preferredRoomType: "Luxury Suite",
    pillowType: "Standard Feather",
    floorPreference: "Mid-High Floor",
    roomLocation: "City View",
    temperatureSetting: "22°C",
    dietaryRestrictions: "None",
    birthday: "12-05",
    specialRequests: "Airport transfer luxury sedan",
    tags: ["Investor", "Event Host"],
    createdAt: "2024-06-10",
    spendBreakdown: {
      room: 26000,
      fnb: 9800,
      spa: 2400,
      extras: 1000,
    },
    stayHistory: [
      {
        id: "STAY-8820",
        reservationCode: "RES-7501",
        propertyName: "Monday Hotels Capital View New Delhi",
        checkIn: "2026-08-10",
        checkOut: "2026-08-14",
        roomType: "Luxury Suite",
        totalAmount: 8800,
        status: "Completed",
      },
    ],
    notes: [
      {
        id: "NOTE-5",
        category: "F&B",
        text: "Frequently hosts 4-6 business contacts for dinner at Signature Grill.",
        author: "Kavita S. (Restaurant Manager)",
        createdAt: "2026-08-11 20:00",
      },
    ],
  },
  {
    id: "GST-9004",
    firstName: "Sophia",
    lastName: "Chen",
    email: "sophia.chen@apexventures.hk",
    phone: "+852 9123 4567",
    vipTier: "Silver",
    status: "Active",
    totalStays: 6,
    totalNights: 14,
    lifetimeSpend: 18600,
    averageDailyRate: 1328,
    lastStayDate: "2026-06-20",
    preferredProperty: "Monday Hotels Financial District Hyderabad",
    preferredRoomType: "Deluxe King Room",
    pillowType: "Hypoallergenic",
    floorPreference: "Any Floor",
    roomLocation: "Garden View",
    temperatureSetting: "21°C",
    dietaryRestrictions: "Pescatarian",
    tags: ["Venture Capital", "Short Stays"],
    createdAt: "2025-01-10",
    spendBreakdown: {
      room: 13500,
      fnb: 3800,
      spa: 800,
      extras: 500,
    },
    stayHistory: [],
    notes: [],
  },
  {
    id: "GST-9005",
    firstName: "Marcus",
    lastName: "Vance",
    email: "marcus.vance@globalconsulting.com",
    phone: "+1 415 555 0199",
    vipTier: "Black Diamond",
    status: "Active",
    totalStays: 28,
    totalNights: 72,
    lifetimeSpend: 118900,
    averageDailyRate: 1651,
    lastStayDate: "2026-03-12", // 6+ months ago (Churn Risk candidate)
    preferredProperty: "Monday Hotels Grand Royale Mumbai",
    preferredRoomType: "Diplomatic Suite",
    pillowType: "Goose Down",
    floorPreference: "Top Floor",
    roomLocation: "Sea View",
    temperatureSetting: "20°C",
    dietaryRestrictions: "Keto / Low Carb",
    anniversary: "09-30",
    corporateAccountId: "CORP-103",
    corporateCompanyName: "TCS Enterprise Global",
    tags: ["High Spend At Churn Risk", "VIP Executive"],
    createdAt: "2023-11-01",
    spendBreakdown: {
      room: 82000,
      fnb: 24000,
      spa: 9500,
      extras: 3400,
    },
    stayHistory: [],
    notes: [
      {
        id: "NOTE-6",
        category: "Concierge",
        text: "Client hasn't visited in 6 months due to change in corporate travel schedule. High priority for personal outreach by General Manager.",
        author: "System AI Alert",
        createdAt: "2026-09-01 08:00",
      },
    ],
  },
];

let guestsStore: GuestProfile[] = [...MOCK_GUESTS];

export function getGuests(): GuestProfile[] {
  return guestsStore;
}

export function getGuestById(id: string): GuestProfile | undefined {
  return guestsStore.find((g) => g.id === id);
}

export function createGuest(data: GuestFormValues): GuestProfile {
  const newGuest: GuestProfile = {
    ...data,
    id: `GST-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString().split("T")[0],
    totalStays: data.totalStays || 0,
    totalNights: data.totalNights || 0,
    lifetimeSpend: data.lifetimeSpend || 0,
    averageDailyRate: data.averageDailyRate || 0,
    spendBreakdown: {
      room: (data.lifetimeSpend || 0) * 0.7,
      fnb: (data.lifetimeSpend || 0) * 0.2,
      spa: (data.lifetimeSpend || 0) * 0.08,
      extras: (data.lifetimeSpend || 0) * 0.02,
    },
    stayHistory: [],
    notes: [],
  };
  guestsStore = [newGuest, ...guestsStore];
  return newGuest;
}

export function updateGuest(id: string, data: Partial<GuestFormValues>): GuestProfile | undefined {
  const index = guestsStore.findIndex((g) => g.id === id);
  if (index === -1) return undefined;
  
  guestsStore[index] = {
    ...guestsStore[index],
    ...data,
  };
  return guestsStore[index];
}

export function addGuestNote(guestId: string, category: "Concierge" | "Housekeeping" | "F&B" | "General", text: string, author: string): GuestNote {
  const guest = getGuestById(guestId);
  if (!guest) throw new Error("Guest not found");

  const newNote: GuestNote = {
    id: `NOTE-${Math.floor(100 + Math.random() * 900)}`,
    category,
    text,
    author,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };

  guest.notes = [newNote, ...guest.notes];
  return newNote;
}

export function deleteGuest(id: string): boolean {
  const initialLen = guestsStore.length;
  guestsStore = guestsStore.filter((g) => g.id !== id);
  return guestsStore.length < initialLen;
}

export function getGuestRetentionMetrics() {
  const total = guestsStore.length;
  const vipCount = guestsStore.filter((g) => g.vipTier === "Black Diamond" || g.vipTier === "Platinum").length;
  const totalSpend = guestsStore.reduce((acc, g) => acc + g.lifetimeSpend, 0);
  const avgLtv = total > 0 ? Math.round(totalSpend / total) : 0;
  const repeatGuests = guestsStore.filter((g) => g.totalStays > 1).length;
  const repeatRatio = total > 0 ? ((repeatGuests / total) * 100).toFixed(1) : "0";

  return {
    totalGuestBase: total,
    vipMembersCount: vipCount,
    totalLifetimeRevenue: totalSpend,
    averageLTV: avgLtv,
    repeatGuestRatio: `${repeatRatio}%`,
  };
}

export function getChurnRiskGuests(): ChurnRiskGuest[] {
  const now = new Date("2026-09-25");
  
  return guestsStore
    .filter((g) => g.lastStayDate)
    .map((g) => {
      const lastDate = new Date(g.lastStayDate!);
      const diffTime = Math.abs(now.getTime() - lastDate.getTime());
      const daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let risk: "High" | "Medium" | "Low" = "Low";
      if (daysSince > 180 && g.lifetimeSpend > 20000) risk = "High";
      else if (daysSince > 120 && g.lifetimeSpend > 10000) risk = "Medium";

      let suggestedAction = "Send complimentary spa voucher";
      if (g.vipTier === "Black Diamond") suggestedAction = "Direct call from General Manager + Dedicated Suite Upgrade Offer";
      else if (g.vipTier === "Platinum") suggestedAction = "Personal email from Guest Relations with double loyalty points offer";

      return {
        id: g.id,
        guestName: `${g.firstName} ${g.lastName}`,
        vipTier: g.vipTier,
        email: g.email,
        phone: g.phone,
        lastStayDate: g.lastStayDate!,
        daysSinceLastStay: daysSince,
        lifetimeSpend: g.lifetimeSpend,
        totalStays: g.totalStays,
        churnRiskScore: risk,
        suggestedAction,
      };
    })
    .filter((c) => c.daysSinceLastStay > 90)
    .sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
}

export const RETENTION_CAMPAIGNS: RetentionCampaign[] = [
  {
    id: "CMP-01",
    title: "Black Diamond & Platinum Autumn Re-Engagement",
    targetAudience: "VIP Guests inactive > 120 days with LTV > $30k",
    eligibleGuestsCount: 142,
    incentive: "Complimentary Presidential Suite Upgrade + 20,000 Loyalty Bonus",
    status: "Active",
    conversionRate: "28.4%",
    projectedRevenue: "$340,000",
  },
  {
    id: "CMP-02",
    title: "B2B Corporate Traveler Weekend Getaway",
    targetAudience: "Corporate guests with weekday stays seeking leisure stays",
    eligibleGuestsCount: 520,
    incentive: "50% off Friday & Saturday night stays + Wine & Cheese setup",
    status: "Active",
    conversionRate: "19.2%",
    projectedRevenue: "$210,000",
  },
  {
    id: "CMP-03",
    title: "Anniversary & Birthday Personal Milestone Invite",
    targetAudience: "Guests with birthdays/anniversaries in October",
    eligibleGuestsCount: 88,
    incentive: "Complimentary Chef's 5-Course Tasting Dinner for 2",
    status: "Scheduled",
    conversionRate: "34.0%",
    projectedRevenue: "$125,000",
  },
];
