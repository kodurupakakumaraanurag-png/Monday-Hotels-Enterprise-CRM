import {
  OpportunityFormValues,
  PipelineStageType,
} from "../validations/opportunity-schema";

export interface OpportunityActivity {
  id: string;
  user: string;
  action: string;
  createdAt: string;
}

export interface OpportunityTask {
  id: string;
  title: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Completed";
}

export interface EnterpriseOpportunity extends OpportunityFormValues {
  id: string;
  weightedValue: number;
  activities: OpportunityActivity[];
  tasks: OpportunityTask[];
  createdAt: string;
}

export const PIPELINE_STAGES_CONFIG: {
  id: PipelineStageType;
  label: string;
  defaultProb: number;
  color: string;
  border: string;
  badge: string;
}[] = [
  { id: "NEW", label: "New Leads", defaultProb: 10, color: "bg-slate-800 text-slate-200", border: "border-slate-700", badge: "bg-slate-800/80 text-slate-300" },
  { id: "CONTACTED", label: "Contacted", defaultProb: 25, color: "bg-blue-500/10 text-blue-400", border: "border-blue-500/30", badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30" },
  { id: "QUALIFIED", label: "Qualified", defaultProb: 40, color: "bg-purple-500/10 text-purple-400", border: "border-purple-500/30", badge: "bg-purple-500/10 text-purple-400 border border-purple-500/30" },
  { id: "QUOTATION", label: "Quotation Sent", defaultProb: 60, color: "bg-amber-500/10 text-amber-400", border: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30" },
  { id: "NEGOTIATION", label: "Negotiation", defaultProb: 75, color: "bg-cyan-500/10 text-cyan-400", border: "border-cyan-500/30", badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" },
  { id: "CONFIRMED", label: "Confirmed Won", defaultProb: 90, color: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold" },
  { id: "COMPLETED", label: "Completed", defaultProb: 100, color: "bg-emerald-950 text-emerald-300", border: "border-emerald-500/50", badge: "bg-emerald-950 text-emerald-300 border border-emerald-400 font-bold" },
  { id: "LOST", label: "Lost", defaultProb: 0, color: "bg-rose-500/10 text-rose-400", border: "border-rose-500/30", badge: "bg-rose-500/10 text-rose-400 border border-rose-500/30" },
];

const INITIAL_OPPORTUNITIES: EnterpriseOpportunity[] = [
  {
    id: "OPP-2026-101",
    title: "Reliance Tech Leadership Summit 2026",
    companyName: "Reliance Enterprise Solutions",
    companyId: "CORP-101",
    contactName: "Dr. Vikramaditya Singhania",
    contactEmail: "v.singhania@singhaniagroup.com",
    contactPhone: "+91 98200 11223",
    bookingEnquiryNumber: "ENQ-2026-101",
    opportunityValue: 145000,
    probability: 75,
    weightedValue: 108750,
    stage: "NEGOTIATION",
    expectedCloseDate: "2026-10-15",
    accountOwner: "Vikram Malhotra",
    property: "Monday Hotels Grand Royale Mumbai",
    roomNights: 450,
    notes: "Requires Presidential Sky Suite for Chairman + 40 Deluxe Executive rooms.",
    createdAt: "2026-09-01",
    activities: [
      {
        id: "ACT-1",
        user: "Vikram Malhotra",
        action: "Submitted revised discounted RFP quotation ($145,000)",
        createdAt: "2026-09-20 14:30",
      },
      {
        id: "ACT-2",
        user: "Priya Sharma",
        action: "Logged initial venue site inspection request",
        createdAt: "2026-09-05 11:00",
      },
    ],
    tasks: [
      {
        id: "TSK-1",
        title: "Send final revised contract addendum for catering",
        dueDate: "2026-09-28",
        priority: "High",
        status: "Pending",
      },
    ],
  },
  {
    id: "OPP-2026-102",
    title: "Infosys Global Partner Conference",
    companyName: "Infosys Global Systems",
    companyId: "CORP-102",
    contactName: "Elena Rostova",
    contactEmail: "elena.rostova@techglobal.io",
    contactPhone: "+44 7700 900123",
    bookingEnquiryNumber: "ENQ-2026-102",
    opportunityValue: 220000,
    probability: 60,
    weightedValue: 132000,
    stage: "QUOTATION",
    expectedCloseDate: "2026-11-01",
    accountOwner: "Priya Sharma",
    property: "Monday Hotels Tech Hub Bengaluru",
    roomNights: 800,
    notes: "Requires convention center banquet setup + high-speed dedicated fiber lines.",
    createdAt: "2026-09-05",
    activities: [
      {
        id: "ACT-3",
        user: "Priya Sharma",
        action: "Sent initial quotation proposal of $220,000",
        createdAt: "2026-09-22 10:15",
      },
    ],
    tasks: [
      {
        id: "TSK-2",
        title: "Confirm AV tech specs for keynotes",
        dueDate: "2026-10-05",
        priority: "Medium",
        status: "Pending",
      },
    ],
  },
  {
    id: "OPP-2026-103",
    title: "TCS Annual Executive Retreat",
    companyName: "TCS Enterprise Global",
    companyId: "CORP-103",
    contactName: "Marcus Vance",
    contactEmail: "marcus.vance@globalconsulting.com",
    contactPhone: "+1 415 555 0199",
    bookingEnquiryNumber: "ENQ-2026-104",
    opportunityValue: 98000,
    probability: 90,
    weightedValue: 88200,
    stage: "CONFIRMED",
    expectedCloseDate: "2026-10-05",
    accountOwner: "Vikram Malhotra",
    property: "Monday Hotels Resort & Spa Goa",
    roomNights: 300,
    notes: "Contract signed by Vice President.",
    createdAt: "2026-08-20",
    activities: [
      {
        id: "ACT-4",
        user: "Vikram Malhotra",
        action: "Received signed B2B contract from TCS legal team",
        createdAt: "2026-09-24 16:45",
      },
    ],
    tasks: [],
  },
  {
    id: "OPP-2026-104",
    title: "Wipro Shareholder Gala & Luxury Stays",
    companyName: "Wipro Technologies",
    contactName: "Rajeshwar Kapoor",
    contactEmail: "r.kapoor@kapoorinvestments.in",
    contactPhone: "+91 99887 66554",
    opportunityValue: 75000,
    probability: 100,
    weightedValue: 75000,
    stage: "COMPLETED",
    expectedCloseDate: "2026-09-20",
    accountOwner: "Anurag Kodurupa",
    property: "Monday Hotels Palace Udaipur",
    roomNights: 220,
    notes: "Completed stay and billing processed cleanly.",
    createdAt: "2026-08-10",
    activities: [],
    tasks: [],
  },
  {
    id: "OPP-2026-105",
    title: "HCL Tech Global Leadership Onboarding",
    companyName: "HCL Tech Ltd",
    contactName: "Sophia Chen",
    contactEmail: "sophia.chen@apexventures.hk",
    opportunityValue: 112000,
    probability: 40,
    weightedValue: 44800,
    stage: "QUALIFIED",
    expectedCloseDate: "2026-11-20",
    accountOwner: "Priya Sharma",
    property: "Monday Hotels Capital View New Delhi",
    roomNights: 380,
    notes: "Qualifying room availability for Q4 batch.",
    createdAt: "2026-09-18",
    activities: [],
    tasks: [],
  },
];

let opportunitiesStore: EnterpriseOpportunity[] = [...INITIAL_OPPORTUNITIES];

export function getEnterpriseOpportunities(): EnterpriseOpportunity[] {
  return opportunitiesStore;
}

export function getOpportunityById(id: string): EnterpriseOpportunity | undefined {
  return opportunitiesStore.find((o) => o.id === id);
}

export function createEnterpriseOpportunity(data: OpportunityFormValues): EnterpriseOpportunity {
  const oppValue = Number(data.opportunityValue) || 0;
  const prob = Number(data.probability) || 0;
  const weighted = Math.round(oppValue * (prob / 100));

  const newOpp: EnterpriseOpportunity = {
    ...data,
    id: `OPP-2026-${Math.floor(200 + Math.random() * 800)}`,
    opportunityValue: oppValue,
    probability: prob,
    weightedValue: weighted,
    activities: [
      {
        id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
        user: data.accountOwner || "Sales Executive",
        action: `Created opportunity with stage ${data.stage} and value $${oppValue.toLocaleString()}`,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      },
    ],
    tasks: [],
    createdAt: new Date().toISOString().split("T")[0],
  };

  opportunitiesStore = [newOpp, ...opportunitiesStore];
  return newOpp;
}

export function updateEnterpriseOpportunity(
  id: string,
  data: Partial<OpportunityFormValues>
): EnterpriseOpportunity | undefined {
  const index = opportunitiesStore.findIndex((o) => o.id === id);
  if (index === -1) return undefined;

  const current = opportunitiesStore[index];
  const oppValue = data.opportunityValue !== undefined ? Number(data.opportunityValue) : current.opportunityValue;
  const prob = data.probability !== undefined ? Number(data.probability) : current.probability;
  const weighted = Math.round(oppValue * (prob / 100));

  opportunitiesStore[index] = {
    ...current,
    ...data,
    opportunityValue: oppValue,
    probability: prob,
    weightedValue: weighted,
  };

  return opportunitiesStore[index];
}

export function updateOpportunityStage(id: string, newStage: PipelineStageType): EnterpriseOpportunity | undefined {
  const opp = getOpportunityById(id);
  if (!opp) return undefined;

  const stageConfig = PIPELINE_STAGES_CONFIG.find((s) => s.id === newStage);
  const newProb = stageConfig ? stageConfig.defaultProb : opp.probability;

  const updated = updateEnterpriseOpportunity(id, {
    stage: newStage,
    probability: newProb,
  });

  if (updated) {
    updated.activities.unshift({
      id: `ACT-${Math.floor(100 + Math.random() * 900)}`,
      user: updated.accountOwner || "Sales Executive",
      action: `Moved stage to ${newStage} (Probability updated to ${newProb}%)`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
  }

  return updated;
}

export function deleteEnterpriseOpportunity(id: string): boolean {
  const initialLen = opportunitiesStore.length;
  opportunitiesStore = opportunitiesStore.filter((o) => o.id !== id);
  return opportunitiesStore.length < initialLen;
}

export function addOpportunityTask(
  opportunityId: string,
  title: string,
  dueDate: string,
  priority: "High" | "Medium" | "Low"
): OpportunityTask {
  const opp = getOpportunityById(opportunityId);
  if (!opp) throw new Error("Opportunity not found");

  const newTask: OpportunityTask = {
    id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
    title,
    dueDate,
    priority,
    status: "Pending",
  };

  opp.tasks.unshift(newTask);
  return newTask;
}

// --- PIPELINE CALCULATIONS ENGINE ---
export function getPipelineMetrics(opportunities: EnterpriseOpportunity[] = opportunitiesStore) {
  const totalCount = opportunities.length;
  const totalValue = opportunities.reduce((acc, o) => acc + o.opportunityValue, 0);
  const totalWeighted = opportunities.reduce((acc, o) => acc + o.weightedValue, 0);
  
  const wonCount = opportunities.filter((o) => o.stage === "CONFIRMED" || o.stage === "COMPLETED").length;
  const conversionRate = totalCount > 0 ? ((wonCount / totalCount) * 100).toFixed(1) : "0";
  const avgValue = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;

  const stageBreakdown = PIPELINE_STAGES_CONFIG.reduce((acc, stage) => {
    const stageOpps = opportunities.filter((o) => o.stage === stage.id);
    const stageVal = stageOpps.reduce((sum, o) => sum + o.opportunityValue, 0);
    const stageWeighted = stageOpps.reduce((sum, o) => sum + o.weightedValue, 0);
    acc[stage.id] = {
      count: stageOpps.length,
      value: stageVal,
      weightedValue: stageWeighted,
    };
    return acc;
  }, {} as Record<PipelineStageType, { count: number; value: number; weightedValue: number }>);

  return {
    totalCount,
    totalValue,
    totalWeightedValue: totalWeighted,
    conversionRate: `${conversionRate}%`,
    averageOpportunityValue: avgValue,
    stageBreakdown,
  };
}
