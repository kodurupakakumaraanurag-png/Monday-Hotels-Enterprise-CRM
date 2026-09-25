export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type PipelineStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "QUOTATION"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "LOST";

export interface LeadScoreMatrix {
  digitalPresence: number; // 0-100
  hiringActivity: number; // 0-100
  techStackFit: number; // 0-100
  fundingRevenue: number; // 0-100
  projectUrgency: number; // 0-100
  budgetClarity: number; // 0-100
  totalScore: number; // 0-600
}

export interface LeadItem {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  website: string;
  contactPocName: string;
  designation: string;
  phone: string;
  email: string;
  businessOverview: string;
  requirement: string;
  priority: PriorityLevel;
  status: PipelineStatus;
  leadSource: string;
  assignedTo: string;
  targetProperty: string;
  estimatedValue: number;
  roomNights: number;
  scores: LeadScoreMatrix;
  createdAt: string;
  nextFollowUp: string;
}

export const MOCK_LEADS: LeadItem[] = [
  {
    id: "LD-8001",
    companyName: "TechCorp Global Solutions",
    industry: "Technology & Software",
    location: "Bengaluru, India",
    website: "https://techcorp-example.com",
    contactPocName: "Sunil Nair",
    designation: "VP Corporate Events & Travel",
    phone: "+91 98765 43210",
    email: "s.nair@techcorp-example.com",
    businessOverview: "Global enterprise software provider hosting annual APAC Tech Leaders Summit.",
    requirement: "450 Room Nights + Main Ballroom & 4 Breakout Halls for 4-day summit.",
    priority: "URGENT",
    status: "QUOTATION",
    leadSource: "Corporate B2B",
    assignedTo: "Rahul Verma (Sales Exec)",
    targetProperty: "Monday Silicon Heights, Bengaluru",
    estimatedValue: 185000,
    roomNights: 450,
    scores: {
      digitalPresence: 95,
      hiringActivity: 90,
      techStackFit: 88,
      fundingRevenue: 95,
      projectUrgency: 92,
      budgetClarity: 90,
      totalScore: 550,
    },
    createdAt: "2026-09-20",
    nextFollowUp: "2026-09-26 (Tomorrow 14:00)",
  },
  {
    id: "LD-8002",
    companyName: "Verma & Kapoor Wedding Celebrations",
    industry: "Luxury Weddings & Events",
    location: "New Delhi, India",
    website: "N/A (Private Client)",
    contactPocName: "Kavita Singhania",
    designation: "Lead Event Planner",
    phone: "+91 98111 22334",
    email: "kavita.events@weddings.in",
    businessOverview: "High-net-worth destination wedding hosting 600 international & VIP guests.",
    requirement: "620 Room Nights + Palace Gardens + 3-day gala dining catering.",
    priority: "URGENT",
    status: "NEGOTIATION",
    leadSource: "Direct Web Enquiry",
    assignedTo: "Priya Sharma (Sales Mgr)",
    targetProperty: "Monday Heritage Palace, Jaipur",
    estimatedValue: 240000,
    roomNights: 620,
    scores: {
      digitalPresence: 85,
      hiringActivity: 75,
      techStackFit: 70,
      fundingRevenue: 100,
      projectUrgency: 98,
      budgetClarity: 95,
      totalScore: 523,
    },
    createdAt: "2026-09-18",
    nextFollowUp: "2026-09-27",
  },
  {
    id: "LD-8003",
    companyName: "Goldman Sachs India",
    industry: "Banking & Financial Services",
    location: "Mumbai, India",
    website: "https://goldman-example.com",
    contactPocName: "Meera Krishnan",
    designation: "Director of Executive Relations",
    phone: "+91 98222 55667",
    email: "m.krishnan@gs-example.com",
    businessOverview: "Annual Investment Banking Leadership Retreat.",
    requirement: "180 Luxury Suites + Executive Dining & Beachfront Lounge Access.",
    priority: "HIGH",
    status: "QUALIFIED",
    leadSource: "Client Referral",
    assignedTo: "Priya Sharma (Sales Mgr)",
    targetProperty: "Monday Beach Resort, Goa",
    estimatedValue: 92000,
    roomNights: 180,
    scores: {
      digitalPresence: 98,
      hiringActivity: 85,
      techStackFit: 80,
      fundingRevenue: 98,
      projectUrgency: 85,
      budgetClarity: 88,
      totalScore: 534,
    },
    createdAt: "2026-09-22",
    nextFollowUp: "2026-09-28",
  },
  {
    id: "LD-8004",
    companyName: "Novartis Asia Pacific Council",
    industry: "Pharmaceuticals & Healthcare",
    location: "Basel / New Delhi",
    website: "https://novartis-example.com",
    contactPocName: "Dr. Rohan Kapoor",
    designation: "Regional Medical Affairs Manager",
    phone: "+91 97654 32109",
    email: "rohan.kapoor@novartis-example.com",
    businessOverview: "Pan-Asian Oncology Research Symposium.",
    requirement: "520 Room Nights + Auditorium + Medical Poster Exhibition Hall.",
    priority: "HIGH",
    status: "CONTACTED",
    leadSource: "GDS Travel Agent",
    assignedTo: "Rahul Verma (Sales Exec)",
    targetProperty: "Monday Grand Palace, Delhi",
    estimatedValue: 210000,
    roomNights: 520,
    scores: {
      digitalPresence: 92,
      hiringActivity: 80,
      techStackFit: 82,
      fundingRevenue: 94,
      projectUrgency: 75,
      budgetClarity: 80,
      totalScore: 503,
    },
    createdAt: "2026-09-21",
    nextFollowUp: "2026-09-29",
  },
  {
    id: "LD-8005",
    companyName: "Amazon AWS Cloud Forum 2026",
    industry: "Cloud & Technology",
    location: "Bengaluru, India",
    website: "https://aws-example.com",
    contactPocName: "Amit Patel",
    designation: "Head of Developer Community APAC",
    phone: "+91 99887 76655",
    email: "apatel@aws-example.com",
    businessOverview: "Enterprise Cloud Architects Summit.",
    requirement: "380 Executive Suites + High-speed Dedicated Fiber Network & Keynote Stage.",
    priority: "HIGH",
    status: "CONFIRMED",
    leadSource: "Corporate B2B",
    assignedTo: "Priya Sharma (Sales Mgr)",
    targetProperty: "Monday Silicon Heights, Bengaluru",
    estimatedValue: 165000,
    roomNights: 380,
    scores: {
      digitalPresence: 100,
      hiringActivity: 98,
      techStackFit: 100,
      fundingRevenue: 100,
      projectUrgency: 90,
      budgetClarity: 95,
      totalScore: 583,
    },
    createdAt: "2026-09-10",
    nextFollowUp: "Completed",
  },
  {
    id: "LD-8006",
    companyName: "McKinsey Strategy Partners Summit",
    industry: "Management Consulting",
    location: "Mumbai, India",
    website: "https://mckinsey-example.com",
    contactPocName: "Devika Roy",
    designation: "Senior Operations Director",
    phone: "+91 98450 11223",
    email: "devika_roy@mckinsey-example.com",
    businessOverview: "Partner Retreat & Strategy Alignment Session.",
    requirement: "120 Executive Suites + Private Boardroom & Helipad Service.",
    priority: "MEDIUM",
    status: "NEW",
    leadSource: "Direct Web Enquiry",
    assignedTo: "Unassigned",
    targetProperty: "Monday Luxury Suites, Mumbai",
    estimatedValue: 88000,
    roomNights: 120,
    scores: {
      digitalPresence: 90,
      hiringActivity: 85,
      techStackFit: 78,
      fundingRevenue: 96,
      projectUrgency: 60,
      budgetClarity: 70,
      totalScore: 479,
    },
    createdAt: "2026-09-24",
    nextFollowUp: "Needs Assignment",
  },
];

export function getScoreBadge(score: number): { label: string; class: string } {
  if (score >= 540) return { label: "Hot Lead (S-Tier)", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
  if (score >= 480) return { label: "Warm Prospect (A-Tier)", class: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
  if (score >= 400) return { label: "Qualified (B-Tier)", class: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
  return { label: "Standard (C-Tier)", class: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
}

export function getPriorityStyle(priority: PriorityLevel): { label: string; class: string } {
  switch (priority) {
    case "URGENT":
      return { label: "Urgent", class: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
    case "HIGH":
      return { label: "High", class: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    case "MEDIUM":
      return { label: "Medium", class: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
    case "LOW":
      return { label: "Low", class: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
  }
}

export function getStatusStyle(status: PipelineStatus): { label: string; class: string } {
  switch (status) {
    case "NEW":
      return { label: "New Lead", class: "bg-slate-500/10 text-slate-300 border-slate-700" };
    case "CONTACTED":
      return { label: "Contacted", class: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
    case "QUALIFIED":
      return { label: "Qualified", class: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
    case "QUOTATION":
      return { label: "Quote Sent", class: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    case "NEGOTIATION":
      return { label: "Negotiation", class: "bg-sky-500/10 text-sky-400 border-sky-500/30" };
    case "CONFIRMED":
      return { label: "Confirmed Won", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
    case "LOST":
      return { label: "Closed Lost", class: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
  }
}
