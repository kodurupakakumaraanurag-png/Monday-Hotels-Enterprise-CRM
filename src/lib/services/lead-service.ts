import { LeadFormData, computeTotalLeadScore } from "@/lib/validations/lead-schema";

export interface LeadActivity {
  id: string;
  type: "CALL" | "EMAIL" | "MEETING" | "SITE_VISIT" | "NOTE" | "STATUS_CHANGE";
  title: string;
  description: string;
  performer: string;
  timestamp: string;
}

export interface LeadTask {
  id: string;
  title: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTo: string;
  status: "PENDING" | "COMPLETED";
}

export interface LeadNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CompleteLeadRecord extends LeadFormData {
  id: string;
  totalLeadScore: number;
  activities: LeadActivity[];
  tasks: LeadTask[];
  notes: LeadNote[];
}

// Initial Mock Dataset with all 26 fields populated
export const INITIAL_LEADS: CompleteLeadRecord[] = [
  {
    id: "LD-9001",
    companyName: "TechCorp Global Solutions",
    industryDomain: "Technology & Software",
    location: "Bengaluru, Karnataka, India",
    websiteUrl: "https://techcorp-global.com",
    contactPocName: "Sunil Nair",
    designation: "VP Corporate Events & Global Travel",
    phone: "+91 98765 43210",
    email: "sunil.nair@techcorp-global.com",
    businessOverview: "Tier-1 SaaS enterprise hosting annual APAC Tech Leaders Summit & Developer Forum.",
    problemFriction: "Previous venue lacked high-speed dedicated fiber bandwidth and breakout spaces.",
    projectRequirement: "450 Room Nights + Main Grand Ballroom & 4 Breakout Halls for 4-day summit.",
    placementOpportunity: "Multi-year preferred corporate rate contract across 5 Monday Hotels flagship properties.",
    priorityLevel: "URGENT",
    pipelineStatus: "QUOTATION",
    nextAction: "Send revised F&B banquet pricing quote & AV specs",
    dateAdded: "2026-09-20",
    leadSource: "Corporate B2B Outreach",
    contactMethod: "Direct Meeting / Phone",
    digitalPresenceScore: 5,
    hiringActivityScore: 4,
    techStackFitScore: 5,
    fundingRevenueScore: 5,
    projectUrgencyScore: 5,
    budgetClarityScore: 4,
    totalLeadScore: 28, // Out of 30
    projectAllocationStatus: "ASSIGNED",
    assignedTo: "Rahul Verma (Sales Exec)",
    targetProperty: "Monday Silicon Heights, Bengaluru",
    estimatedValue: 185000,
    activities: [
      { id: "act-1", type: "EMAIL", title: "RFP Quote Dispatched ($185k)", description: "Sent formal proposal for 450 room nights & main ballroom.", performer: "Rahul Verma", timestamp: "2026-09-20 14:30" },
      { id: "act-2", type: "SITE_VISIT", title: "Ballroom & Tech Infrastructure Inspection", description: "Inspected fiber connectivity & audio-visual stage setup.", performer: "Sunil Nair & Rahul Verma", timestamp: "2026-09-22 11:00" },
    ],
    tasks: [
      { id: "tsk-1", title: "Follow up on TechCorp AV specifications sign-off", dueDate: "2026-09-26 15:00", priority: "URGENT", assignedTo: "Rahul Verma", status: "PENDING" },
    ],
    notes: [
      { id: "nte-1", author: "Priya Sharma (Sales Mgr)", content: "High probability lead (>85%). Client prefers Monday Silicon Heights due to proximity to tech park.", createdAt: "2026-09-21 16:45" },
    ],
  },
  {
    id: "LD-9002",
    companyName: "Verma & Kapoor Wedding",
    industryDomain: "Luxury Wedding & Event",
    location: "New Delhi & Jaipur",
    websiteUrl: "",
    contactPocName: "Kavita Singhania",
    designation: "Lead Event Planner",
    phone: "+91 98111 22334",
    email: "kavita.singhania@luxuryweddings.in",
    businessOverview: "Destination wedding for prominent business family with 600 international guests.",
    problemFriction: "Requires full palace hotel block buyout with exclusive garden access.",
    projectRequirement: "620 Room Nights + Palace Courtyard + 3-day gala dining & catering.",
    placementOpportunity: "High margin luxury banquet revenue + spa & valet upsells.",
    priorityLevel: "URGENT",
    pipelineStatus: "NEGOTIATION",
    nextAction: "Finalize menu tasting & royal elephant procession permit",
    dateAdded: "2026-09-18",
    leadSource: "Direct Web Inquiry",
    contactMethod: "In-person Consultation",
    digitalPresenceScore: 4,
    hiringActivityScore: 3,
    techStackFitScore: 3,
    fundingRevenueScore: 5,
    projectUrgencyScore: 5,
    budgetClarityScore: 5,
    totalLeadScore: 25,
    projectAllocationStatus: "ASSIGNED",
    assignedTo: "Priya Sharma (Sales Mgr)",
    targetProperty: "Monday Heritage Palace, Jaipur",
    estimatedValue: 240000,
    activities: [
      { id: "act-3", type: "MEETING", title: "Executive Menu Tasting Session", description: "Sampled 5-course royal Rajasthani banquet menu.", performer: "Priya Sharma", timestamp: "2026-09-19 19:00" },
    ],
    tasks: [
      { id: "tsk-2", title: "Obtain local authority clearance for palace fireworks display", dueDate: "2026-09-27 12:00", priority: "HIGH", assignedTo: "Priya Sharma", status: "PENDING" },
    ],
    notes: [
      { id: "nte-2", author: "Priya Sharma", content: "Client requested deposit split into 3 milestones. Contract ready.", createdAt: "2026-09-20 10:15" },
    ],
  },
  {
    id: "LD-9003",
    companyName: "Goldman Sachs India",
    industryDomain: "Banking & Financial Services",
    location: "Mumbai, Maharashtra, India",
    websiteUrl: "https://goldmansachs-example.com",
    contactPocName: "Meera Krishnan",
    designation: "Director of Executive Relations",
    phone: "+91 98222 55667",
    email: "meera.krishnan@gs-example.com",
    businessOverview: "Annual Investment Banking Leadership Retreat & Strategy Forum.",
    problemFriction: "Requires secluded luxury beach resort with high-level privacy & security.",
    projectRequirement: "180 Luxury Suites + Executive Dining & Beachfront Lounge Access.",
    placementOpportunity: "Annual recurring retreat account across Monday Hotels resort portfolio.",
    priorityLevel: "HIGH",
    pipelineStatus: "QUALIFIED",
    nextAction: "Schedule security audit call with Managing Director",
    dateAdded: "2026-09-22",
    leadSource: "Client Referral",
    contactMethod: "Email / Phone",
    digitalPresenceScore: 5,
    hiringActivityScore: 4,
    techStackFitScore: 4,
    fundingRevenueScore: 5,
    projectUrgencyScore: 4,
    budgetClarityScore: 4,
    totalLeadScore: 26,
    projectAllocationStatus: "IN_REVIEW",
    assignedTo: "Priya Sharma (Sales Mgr)",
    targetProperty: "Monday Beach Resort, Goa",
    estimatedValue: 92000,
    activities: [],
    tasks: [],
    notes: [],
  },
  {
    id: "LD-9004",
    companyName: "Novartis Asia Pacific",
    industryDomain: "Pharmaceuticals & Healthcare",
    location: "New Delhi & Singapore",
    websiteUrl: "https://novartis-apac.com",
    contactPocName: "Dr. Rohan Kapoor",
    designation: "Regional Medical Affairs Manager",
    phone: "+91 97654 32109",
    email: "rohan.kapoor@novartis-apac.com",
    businessOverview: "Pan-Asian Oncology Research Symposium & Medical Advisory Board.",
    problemFriction: "Demands strict pharma compliance adherence & medical poster exhibition hall.",
    projectRequirement: "520 Room Nights + Auditorium + Medical Exhibition Space.",
    placementOpportunity: "Multi-year APAC conference partnership.",
    priorityLevel: "HIGH",
    pipelineStatus: "CONTACTED",
    nextAction: "Provide compliance checklist & room layout diagrams",
    dateAdded: "2026-09-21",
    leadSource: "GDS Travel Agent",
    contactMethod: "Email",
    digitalPresenceScore: 5,
    hiringActivityScore: 4,
    techStackFitScore: 4,
    fundingRevenueScore: 5,
    projectUrgencyScore: 3,
    budgetClarityScore: 4,
    totalLeadScore: 25,
    projectAllocationStatus: "ASSIGNED",
    assignedTo: "Rahul Verma (Sales Exec)",
    targetProperty: "Monday Grand Palace, Delhi",
    estimatedValue: 210000,
    activities: [],
    tasks: [],
    notes: [],
  },
  {
    id: "LD-9005",
    companyName: "Amazon AWS Cloud Forum",
    industryDomain: "Cloud & Technology",
    location: "Bengaluru, India",
    websiteUrl: "https://aws-cloud.com",
    contactPocName: "Amit Patel",
    designation: "Head of Developer Community APAC",
    phone: "+91 99887 76655",
    email: "apatel@aws-cloud.com",
    businessOverview: "Enterprise Cloud Architects Summit.",
    problemFriction: "High bandwidth requirements and 15 concurrent keynote sessions.",
    projectRequirement: "380 Executive Suites + High-speed Dedicated Fiber & Main Keynote Stage.",
    placementOpportunity: "Premier Cloud Partner hotel status.",
    priorityLevel: "HIGH",
    pipelineStatus: "CONFIRMED",
    nextAction: "Pre-event Ops Handover Meeting",
    dateAdded: "2026-09-10",
    leadSource: "Corporate B2B Outreach",
    contactMethod: "In-person Meeting",
    digitalPresenceScore: 5,
    hiringActivityScore: 5,
    techStackFitScore: 5,
    fundingRevenueScore: 5,
    projectUrgencyScore: 4,
    budgetClarityScore: 5,
    totalLeadScore: 29,
    projectAllocationStatus: "APPROVED",
    assignedTo: "Priya Sharma (Sales Mgr)",
    targetProperty: "Monday Silicon Heights, Bengaluru",
    estimatedValue: 165000,
    activities: [],
    tasks: [],
    notes: [],
  },
  {
    id: "LD-9006",
    companyName: "McKinsey Strategy Partners Summit",
    industryDomain: "Management Consulting",
    location: "Mumbai, India",
    websiteUrl: "https://mckinsey-strategy.com",
    contactPocName: "Devika Roy",
    designation: "Senior Operations Director",
    phone: "+91 98450 11223",
    email: "devika_roy@mckinsey-strategy.com",
    businessOverview: "Partner Retreat & Strategy Alignment Session.",
    problemFriction: "Requires private boardroom access and exclusive helipad transport.",
    projectRequirement: "120 Executive Suites + Private Boardroom & Helipad Service.",
    placementOpportunity: "Global consulting corporate rate code.",
    priorityLevel: "MEDIUM",
    pipelineStatus: "NEW",
    nextAction: "Assign Sales Executive to contact client",
    dateAdded: "2026-09-24",
    leadSource: "Direct Web Inquiry",
    contactMethod: "Web Form",
    digitalPresenceScore: 4,
    hiringActivityScore: 4,
    techStackFitScore: 3,
    fundingRevenueScore: 5,
    projectUrgencyScore: 2,
    budgetClarityScore: 3,
    totalLeadScore: 21,
    projectAllocationStatus: "UNASSIGNED",
    assignedTo: "Unassigned",
    targetProperty: "Monday Luxury Suites, Mumbai",
    estimatedValue: 88000,
    activities: [],
    tasks: [],
    notes: [],
  },
];

// In-Memory Store with Helper CRUD Functions
let LEADS_STORAGE: CompleteLeadRecord[] = [...INITIAL_LEADS];

export function getLeads(): CompleteLeadRecord[] {
  return LEADS_STORAGE;
}

export function getLeadById(id: string): CompleteLeadRecord | undefined {
  return LEADS_STORAGE.find((l) => l.id === id);
}

export function createLead(data: LeadFormData): CompleteLeadRecord {
  const computedScore = computeTotalLeadScore(data);
  const newLead: CompleteLeadRecord = {
    ...data,
    id: data.id || `LD-${Math.floor(9000 + Math.random() * 999)}`,
    dateAdded: data.dateAdded || new Date().toISOString().split("T")[0],
    totalLeadScore: computedScore,
    activities: [
      {
        id: `act-${Date.now()}`,
        type: "NOTE",
        title: "Lead Created in Enterprise CRM",
        description: `Lead registered under status ${data.pipelineStatus} with score ${computedScore}/30.`,
        performer: data.assignedTo || "Current User",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      },
    ],
    tasks: [],
    notes: [],
  };

  LEADS_STORAGE = [newLead, ...LEADS_STORAGE];
  return newLead;
}

export function updateLead(id: string, data: Partial<LeadFormData>): CompleteLeadRecord | undefined {
  const index = LEADS_STORAGE.findIndex((l) => l.id === id);
  if (index === -1) return undefined;

  const current = LEADS_STORAGE[index];
  const updatedData = { ...current, ...data };
  const computedScore = computeTotalLeadScore(updatedData);

  const updatedRecord: CompleteLeadRecord = {
    ...updatedData,
    totalLeadScore: computedScore,
  };

  LEADS_STORAGE[index] = updatedRecord;
  return updatedRecord;
}

export function deleteLead(id: string): boolean {
  const initialLen = LEADS_STORAGE.length;
  LEADS_STORAGE = LEADS_STORAGE.filter((l) => l.id !== id);
  return LEADS_STORAGE.length < initialLen;
}

export function addLeadNote(id: string, author: string, content: string): CompleteLeadRecord | undefined {
  const lead = getLeadById(id);
  if (!lead) return undefined;

  const newNote: LeadNote = {
    id: `nte-${Date.now()}`,
    author,
    content,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
  };

  lead.notes = [newNote, ...lead.notes];
  return lead;
}

export function addLeadTask(id: string, task: Omit<LeadTask, "id" | "status">): CompleteLeadRecord | undefined {
  const lead = getLeadById(id);
  if (!lead) return undefined;

  const newTask: LeadTask = {
    ...task,
    id: `tsk-${Date.now()}`,
    status: "PENDING",
  };

  lead.tasks = [newTask, ...lead.tasks];
  return lead;
}
