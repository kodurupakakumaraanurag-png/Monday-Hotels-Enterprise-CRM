export type OpportunityStage =
  | "Qualification"
  | "Proposal Sent"
  | "Negotiation"
  | "Executive Approval"
  | "Closed Won"
  | "Closed Lost";

export interface Opportunity {
  id: string;
  title: string;
  companyName: string;
  dealValue: number;
  stage: OpportunityStage;
  expectedCloseDate: string;
  roomNights: number;
  accountOwner: string;
  probability: number;
  createdAt: string;
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "OPP-301",
    title: "Reliance Tech Leadership Summit 2026",
    companyName: "Reliance Enterprise Solutions",
    dealValue: 145000,
    stage: "Negotiation",
    expectedCloseDate: "2026-10-15",
    roomNights: 450,
    accountOwner: "Vikram Malhotra",
    probability: 85,
    createdAt: "2026-09-01",
  },
  {
    id: "OPP-302",
    title: "Infosys Global Partner Conference",
    companyName: "Infosys Global Systems",
    dealValue: 220000,
    stage: "Proposal Sent",
    expectedCloseDate: "2026-11-01",
    roomNights: 800,
    accountOwner: "Priya Sharma",
    probability: 60,
    createdAt: "2026-09-05",
  },
  {
    id: "OPP-303",
    title: "TCS Executive Leadership Retreat",
    companyName: "TCS Enterprise Global",
    dealValue: 98000,
    stage: "Executive Approval",
    expectedCloseDate: "2026-10-05",
    roomNights: 300,
    accountOwner: "Vikram Malhotra",
    probability: 90,
    createdAt: "2026-08-20",
  },
  {
    id: "OPP-304",
    title: "Wipro Annual Shareholder Dinner & Stay",
    companyName: "Wipro Technologies",
    dealValue: 75000,
    stage: "Closed Won",
    expectedCloseDate: "2026-09-20",
    roomNights: 220,
    accountOwner: "Anurag Kodurupa",
    probability: 100,
    createdAt: "2026-08-10",
  },
  {
    id: "OPP-305",
    title: "HCL Global Mobility Accommodations",
    companyName: "HCL Tech Ltd",
    dealValue: 112000,
    stage: "Qualification",
    expectedCloseDate: "2026-11-20",
    roomNights: 380,
    accountOwner: "Priya Sharma",
    probability: 40,
    createdAt: "2026-09-18",
  },
];

let opportunitiesStore: Opportunity[] = [...MOCK_OPPORTUNITIES];

export function getOpportunities(): Opportunity[] {
  return opportunitiesStore;
}

export function createOpportunity(data: Omit<Opportunity, "id" | "createdAt">): Opportunity {
  const newOpp: Opportunity = {
    ...data,
    id: `OPP-${Math.floor(300 + Math.random() * 600)}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  opportunitiesStore = [newOpp, ...opportunitiesStore];
  return newOpp;
}
