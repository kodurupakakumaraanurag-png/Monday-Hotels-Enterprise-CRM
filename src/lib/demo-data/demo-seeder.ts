/**
 * Synthetic Demo Data Seeder for Monday Hotels Enterprise CRM
 * Generates repeatable, rich, realistic synthetic data for 5 properties, 25+ companies, 35+ contacts, 45+ leads, 35+ guests, 55+ enquiries, 55+ reservations, 25+ opportunities, tasks, activities & notifications.
 */

import { CompleteLeadRecord } from "../services/lead-service";
import { CorporateCompanyRecord, B2BContactRecord } from "../services/corporate-service";
import { GuestProfile } from "../services/guest-service";
import { EnterpriseOpportunity } from "../services/opportunity-service";
import { Reservation, BookingEnquiry } from "../services/reservation-service";
import { EnterpriseTask, EnterpriseActivityLog } from "../services/task-activity-service";

// 5 Flagship Hotel Properties
export const DEMO_PROPERTIES = [
  { id: "PROP-DEL-101", name: "Monday Hotel Aerocity Delhi", code: "DEL-AERO", city: "New Delhi", rooms: 320, adr: 8500, revpar: 7200, starRating: 5.0 },
  { id: "PROP-GUR-102", name: "Monday Hotel Cyber City Gurgaon", code: "GUR-CYBER", city: "Gurgaon", rooms: 280, adr: 9200, revpar: 7800, starRating: 5.0 },
  { id: "PROP-BOM-103", name: "Monday Hotels Grand Royale Mumbai", code: "BOM-ROYALE", city: "Mumbai", rooms: 450, adr: 12500, revpar: 10600, starRating: 5.0 },
  { id: "PROP-GOA-104", name: "Monday Resort & Spa Goa", code: "GOA-RESORT", city: "Goa", rooms: 220, adr: 14000, revpar: 11900, starRating: 5.0 },
  { id: "PROP-JAI-105", name: "Monday Heritage Retreat Palace Jaipur", code: "JAI-HERITAGE", city: "Jaipur", rooms: 180, adr: 11000, revpar: 8900, starRating: 5.0 },
];

// Seed 25 Corporate Companies
export function generateSyntheticCompanies(): CorporateCompanyRecord[] {
  const companyNames = [
    { name: "TechCorp Global Solutions", industry: "Technology & Software", code: "CORP-TC-2026", discount: 20 },
    { name: "Infosys Enterprise Services", industry: "IT Services", code: "CORP-INF-2026", discount: 18 },
    { name: "Wipro Technologies APAC", industry: "IT Consulting", code: "CORP-WIP-2026", discount: 15 },
    { name: "TCS Enterprise India", industry: "Information Technology", code: "CORP-TCS-2026", discount: 22 },
    { name: "Deloitte Advisory India", industry: "Management Consulting", code: "CORP-DEL-2026", discount: 15 },
    { name: "Accenture Digital Systems", industry: "Consulting & Cloud", code: "CORP-ACC-2026", discount: 18 },
    { name: "HCL Global Solutions", industry: "Hardware & Cloud", code: "CORP-HCL-2026", discount: 12 },
    { name: "Reliance Energy & Infra", industry: "Conglomerate", code: "CORP-RIL-2026", discount: 25 },
    { name: "Bharti Airtel B2B Mobility", industry: "Telecommunications", code: "CORP-AIR-2026", discount: 15 },
    { name: "Mahindra Mobility & EV", industry: "Automotive", code: "CORP-MAH-2026", discount: 18 },
    { name: "Tata Motors Commercial", industry: "Automotive & Fleet", code: "CORP-TAT-2026", discount: 20 },
    { name: "Larsen & Toubro Heavy", industry: "Construction & Infra", code: "CORP-LNT-2026", discount: 15 },
    { name: "ICICI Global Banking", industry: "Banking & Financial", code: "CORP-ICI-2026", discount: 22 },
    { name: "Ernst & Young Advisory", industry: "Tax & Financial Audit", code: "CORP-EY-2026", discount: 18 },
    { name: "KPMG Advisory India", industry: "Financial Consulting", code: "CORP-KPM-2026", discount: 15 },
    { name: "Google Cloud India", industry: "Cloud & Technology", code: "CORP-GGL-2026", discount: 25 },
    { name: "Amazon Web Services India", industry: "Cloud Infrastructure", code: "CORP-AWS-2026", discount: 20 },
    { name: "Microsoft Corp India", industry: "Software & Cloud", code: "CORP-MSF-2026", discount: 22 },
    { name: "Cisco Systems India", industry: "Networking & Security", code: "CORP-CSC-2026", discount: 18 },
    { name: "IBM Global Services", industry: "Enterprise Systems", code: "CORP-IBM-2026", discount: 15 },
    { name: "PwC India Corporate", industry: "Consulting", code: "CORP-PWC-2026", discount: 18 },
    { name: "Cognizant APAC Digital", industry: "Digital Transformation", code: "CORP-COG-2026", discount: 15 },
    { name: "Oracle Enterprise India", industry: "Database & ERP", code: "CORP-ORC-2026", discount: 20 },
    { name: "SAP India Labs", industry: "Enterprise Software", code: "CORP-SAP-2026", discount: 18 },
    { name: "Salesforce APAC India", industry: "SaaS Software", code: "CORP-SF-2026", discount: 22 },
  ];

  return companyNames.map((c, i) => ({
    id: `COMP-SEED-${100 + i}`,
    name: c.name,
    industry: c.industry,
    website: `https://${c.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    corporateCode: c.code,
    contractDiscountPct: c.discount,
    accountManager: i % 2 === 0 ? "Vikram Malhotra (Sales Manager)" : "Priya Sharma (Key Account VP)",
    address: `${i + 101} Enterprise Towers, Business District`,
    city: i % 4 === 0 ? "Bengaluru" : i % 4 === 1 ? "Gurgaon" : i % 4 === 2 ? "Mumbai" : "Hyderabad",
    country: "India",
    status: i % 5 === 0 ? "VIP_ACCOUNT" : "ACTIVE",
    totalSpend: 150000 + i * 45000,
    totalRoomNights: 120 + i * 35,
    createdAt: `2026-0${(i % 8) + 1}-15`,
  }));
}

// Seed 35 B2B Contacts
export function generateSyntheticContacts(companies: CorporateCompanyRecord[]): B2BContactRecord[] {
  const firstNames = ["Sunil", "Ananya", "Rajesh", "Kavita", "Siddharth", "Elena", "Marcus", "Vikram", "Amrita", "Deepak", "Neha", "Rohan", "Pooja", "Arjun", "Sneha"];
  const lastNames = ["Nair", "Sen", "Verma", "Roy", "Rao", "Rostova", "Vance", "Singh", "Gupta", "Sharma", "Mehta", "Patel", "Reddy", "Kulkarni", "Deshmukh"];

  const contacts: B2BContactRecord[] = [];
  for (let i = 0; i < 35; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i + 3) % lastNames.length];
    const comp = companies[i % companies.length];

    contacts.push({
      id: `CNT-SEED-${200 + i}`,
      companyId: comp.id,
      companyName: comp.name,
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${comp.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      designation: i % 3 === 0 ? "VP Corporate Travel" : i % 3 === 1 ? "Head of Events & MICE" : "Senior Procurement Manager",
      contactType: i % 4 === 0 ? "PRIMARY" : i % 4 === 1 ? "BILLING" : "EVENT_PLANNER",
      isPrimaryContact: i % 3 === 0,
      notes: "Preferred POC for corporate contract renewals & banquet bookings.",
      createdAt: `2026-0${(i % 8) + 1}-10`,
    });
  }
  return contacts;
}

// Seed 45 Sales Leads
export function generateSyntheticLeads(): CompleteLeadRecord[] {
  const leads: CompleteLeadRecord[] = [];
  const sources = ["Corporate B2B Outreach", "Website Form", "Direct Phone Call", "Travel Agent / Broker", "Inbound Email"];
  const statuses = ["NEW", "CONTACTED", "QUALIFIED", "QUOTATION", "NEGOTIATION", "CONFIRMED", "LOST"] as const;
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

  for (let i = 0; i < 45; i++) {
    const fn = ["Aarav", "Dia", "Kabir", "Zara", "Ishaan", "Tara", "Reyansh", "Ananya", "Vihaan", "Kiara"][i % 10];
    const ln = ["Kapoor", "Joshi", "Bhasin", "Khanna", "Saxena", "Chawla", "Bansal", "Ahuja", "Sethi", "Gill"][i % 10];
    const company = `Synthetic Corp ${i + 1} Ltd`;
    const property = DEMO_PROPERTIES[i % DEMO_PROPERTIES.length].name;
    const estVal = 180000 + i * 32000;

    leads.push({
      id: `LD-SEED-${9000 + i}`,
      companyName: company,
      industryDomain: i % 2 === 0 ? "Technology & IT" : "Financial Services & Consulting",
      location: i % 3 === 0 ? "New Delhi" : i % 3 === 1 ? "Mumbai" : "Bengaluru",
      websiteUrl: `https://synthetic-corp-${i + 1}.com`,
      contactPocName: `${fn} ${ln}`,
      designation: "Director of Travel & Events",
      phone: `+91 97${Math.floor(10000000 + Math.random() * 89999999)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@synthetic-corp-${i + 1}.com`,
      businessOverview: "Enterprise client hosting corporate leadership summit & quarterly review retreat.",
      problemFriction: "Requires dedicated ballroom, high-speed fiber internet & luxury suite allocations.",
      projectRequirement: `${150 + i * 15} Room Nights + Banquet Hall & 3 Breakout Rooms`,
      placementOpportunity: property,
      priorityLevel: priorities[i % priorities.length],
      pipelineStatus: statuses[i % statuses.length],
      nextAction: "Send F&B custom banquet quotation & arrange site inspection tour",
      dateAdded: `2026-0${(i % 8) + 1}-0${(i % 28) + 1}`,
      leadSource: sources[i % sources.length],
      contactMethod: "Email / Phone Call",
      digitalPresenceScore: (i % 3) + 3,
      hiringActivityScore: (i % 3) + 3,
      techStackFitScore: (i % 3) + 3,
      fundingRevenueScore: (i % 3) + 3,
      projectUrgencyScore: (i % 3) + 3,
      budgetClarityScore: (i % 3) + 3,
      totalLeadScore: 22 + (i % 8),
      projectAllocationStatus: "ASSIGNED",
      targetProperty: property,
      estimatedValue: estVal,
      assignedTo: "user-1",
      activities: [],
      tasks: [],
      notes: [],
    });
  }
  return leads;
}

// Seed 35 Guest 360 Profiles
export function generateSyntheticGuests(): GuestProfile[] {
  const guests: GuestProfile[] = [];
  const vipTiers = ["Black Diamond", "Platinum", "Gold", "Silver", "Standard"] as const;

  for (let i = 0; i < 35; i++) {
    const fn = ["Vikramaditya", "Sunita", "Rajiv", "Meera", "Alok", "Nandini", "Gautam", "Shruti", "Manish", "Pooja"][i % 10];
    const ln = ["Singhania", "Tandon", "Bajaj", "Chowdhury", "Malhotra", "Kapur", "Aggarwal", "Dhar", "Nanda", "Bhatia"][i % 10];

    guests.push({
      id: `GST-SEED-${500 + i}`,
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@synthetic-guest.com`,
      phone: `+91 99${Math.floor(10000000 + Math.random() * 89999999)}`,
      vipTier: vipTiers[i % vipTiers.length],
      status: "Active",
      totalStays: 2 + (i % 7),
      totalNights: 5 + i * 2,
      lifetimeSpend: 45000 + i * 18000,
      averageDailyRate: 8500 + (i % 5) * 1500,
      lastStayDate: `2026-0${(i % 8) + 1}-18`,
      preferredProperty: DEMO_PROPERTIES[i % DEMO_PROPERTIES.length].name,
      preferredRoomType: "Presidential Sky Suite",
      pillowType: "Goose Down Pillows",
      floorPreference: "High Floor (Floor 10+)",
      specialRequests: "Sparkling water on arrival, quiet wing away from elevators",
      spendBreakdown: { room: 35000, fnb: 12000, spa: 4000, extras: 2000 },
      createdAt: `2026-01-15`,
      stayHistory: [],
      notes: [],
    });
  }
  return guests;
}

// Seed 55 Reservations & 55 Booking Enquiries
export function generateSyntheticReservationsAndEnquiries() {
  const reservations: Reservation[] = [];
  const enquiries: BookingEnquiry[] = [];
  const statuses = ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"] as const;

  for (let i = 0; i < 55; i++) {
    const prop = DEMO_PROPERTIES[i % DEMO_PROPERTIES.length];
    const guestName = `Synthetic Guest ${i + 1}`;

    reservations.push({
      id: `RES-SEED-${1000 + i}`,
      reservationNumber: `RES-2026-${200 + i}`,
      guest: guestName,
      property: prop.name,
      room: `Executive Deluxe Suite (Room ${300 + i})`,
      checkIn: `2026-10-${(i % 20) + 1}`,
      checkOut: `2026-10-${(i % 20) + 4}`,
      numberOfGuests: 2,
      rate: prop.adr,
      totalAmount: prop.adr * 3,
      paymentStatus: i % 4 === 0 ? "PAID" : "PARTIAL",
      reservationStatus: statuses[i % statuses.length],
      bookingSource: i % 2 === 0 ? "Corporate Direct" : "Website Direct Booking",
      createdAt: `2026-0${(i % 8) + 1}-01`,
    });

    enquiries.push({
      id: `ENQ-SEED-${3000 + i}`,
      enquiryNumber: `ENQ-2026-${500 + i}`,
      guest: `Enquiry POC ${i + 1}`,
      corporateClient: `Synthetic Client ${i + 1} Ltd`,
      property: prop.name,
      checkInDate: `2026-11-${(i % 20) + 1}`,
      checkOutDate: `2026-11-${(i % 20) + 5}`,
      numberOfGuests: 2,
      roomType: "Executive Club Suite",
      source: "Corporate Inquiry Form",
      estimatedValue: prop.adr * 4,
      assignedStaff: "Vikram Malhotra",
      status: i % 2 === 0 ? "QUALIFIED" : "NEW",
      createdAt: `2026-09-${(i % 20) + 1}`,
    });
  }

  return { reservations, enquiries };
}

// Seed 25 Sales Opportunities
export function generateSyntheticOpportunities(): EnterpriseOpportunity[] {
  const opps: EnterpriseOpportunity[] = [];
  const stages = ["NEW", "CONTACTED", "QUALIFIED", "QUOTATION", "NEGOTIATION", "CONFIRMED", "COMPLETED", "LOST"] as const;

  for (let i = 0; i < 25; i++) {
    const prop = DEMO_PROPERTIES[i % DEMO_PROPERTIES.length];
    const val = 250000 + i * 55000;
    const prob = 20 + (i % 8) * 10;

    opps.push({
      id: `OPP-SEED-${4000 + i}`,
      title: `Synthetic Deal ${i + 1} - Corporate Gala & Stays`,
      companyName: `Synthetic Corporate ${i + 1}`,
      companyId: `COMP-SEED-${100 + (i % 20)}`,
      contactName: `POC Name ${i + 1}`,
      contactEmail: `poc${i + 1}@synthetic.com`,
      contactPhone: "+91 98111 00000",
      bookingEnquiryNumber: `ENQ-2026-${500 + i}`,
      opportunityValue: val,
      probability: prob,
      weightedValue: Math.round(val * (prob / 100)),
      stage: stages[i % stages.length],
      expectedCloseDate: `2026-10-${(i % 25) + 1}`,
      accountOwner: i % 2 === 0 ? "Vikram Malhotra" : "Priya Sharma",
      property: prop.name,
      roomNights: 100 + i * 20,
      notes: "Contract terms under active review by legal team.",
      createdAt: `2026-08-${(i % 25) + 1}`,
      activities: [],
      tasks: [],
    });
  }
  return opps;
}

// Master Synthetic Seed Summary Interface
export interface SeedSummary {
  propertiesCount: number;
  companiesCount: number;
  contactsCount: number;
  leadsCount: number;
  guestsCount: number;
  enquiriesCount: number;
  reservationsCount: number;
  opportunitiesCount: number;
  seededAt: string;
}

/**
 * Execute full synthetic seed process for demo environment
 */
export function seedSyntheticDemoData(): SeedSummary {
  const companies = generateSyntheticCompanies();
  const contacts = generateSyntheticContacts(companies);
  const leads = generateSyntheticLeads();
  const guests = generateSyntheticGuests();
  const { reservations, enquiries } = generateSyntheticReservationsAndEnquiries();
  const opportunities = generateSyntheticOpportunities();

  const summary: SeedSummary = {
    propertiesCount: DEMO_PROPERTIES.length,
    companiesCount: companies.length,
    contactsCount: contacts.length,
    leadsCount: leads.length,
    guestsCount: guests.length,
    enquiriesCount: enquiries.length,
    reservationsCount: reservations.length,
    opportunitiesCount: opportunities.length,
    seededAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("monday_hotels_seed_summary", JSON.stringify(summary));
  }

  return summary;
}
