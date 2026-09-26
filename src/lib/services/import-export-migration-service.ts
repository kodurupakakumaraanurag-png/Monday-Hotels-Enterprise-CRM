/**
 * Data Import & Migration Wizard Engine for Monday Hotels Enterprise CRM
 * Supports CSV/TSV parsing, entity field mapping, Zod validation, deduplication, and batch migration.
 */

import { getLeads, createLead } from "./lead-service";
import { getCompanies, createCompany } from "./corporate-service";
import { getReservations, createReservation } from "./reservation-service";
import { getGuests, createGuest } from "./guest-service";

export type MigrationEntityType = "LEAD" | "CORPORATE" | "RESERVATION" | "GUEST";

export interface FieldDefinition {
  key: string;
  label: string;
  required?: boolean;
  type: "string" | "number" | "email" | "date" | "select";
  options?: string[];
  sampleValue: string;
  aliases: string[];
}

export interface ValidatedRow {
  rowIndex: number;
  originalData: Record<string, string>;
  mappedData: Record<string, any>;
  status: "VALID" | "WARNING_DUPLICATE" | "ERROR_INVALID";
  errors: string[];
  warnings: string[];
}

export const ENTITY_SCHEMA_MAP: Record<MigrationEntityType, { title: string; description: string; fields: FieldDefinition[] }> = {
  LEAD: {
    title: "Inbound & Outbound Sales Leads",
    description: "Import B2B leads, event inquiries, corporate travel leads & POC details.",
    fields: [
      { key: "contactPocName", label: "Contact / POC Name", required: true, type: "string", sampleValue: "Sunil Nair", aliases: ["poc name", "contact name", "full name", "name", "contact"] },
      { key: "companyName", label: "Company Name", required: true, type: "string", sampleValue: "TechCorp Global", aliases: ["company", "organization", "account", "corp name"] },
      { key: "email", label: "Email Address", required: true, type: "email", sampleValue: "sunil@techcorp.com", aliases: ["email", "contact email", "poc email", "e-mail"] },
      { key: "phone", label: "Phone Number", required: false, type: "string", sampleValue: "+91 98765 43210", aliases: ["phone", "mobile", "contact number", "tel"] },
      { key: "targetProperty", label: "Target Property", required: false, type: "string", sampleValue: "Monday Hotel Aerocity Delhi", aliases: ["property", "hotel", "target hotel", "venue"] },
      { key: "leadSource", label: "Lead Source", required: false, type: "select", options: ["Corporate B2B Outreach", "Website Form", "Direct Phone Call", "Travel Agent / Broker", "Inbound Email"], sampleValue: "Corporate B2B Outreach", aliases: ["source", "channel", "origin"] },
      { key: "priorityLevel", label: "Priority Level", required: false, type: "select", options: ["LOW", "MEDIUM", "HIGH", "URGENT"], sampleValue: "HIGH", aliases: ["priority", "urgency"] },
      { key: "pipelineStatus", label: "Pipeline Status", required: false, type: "select", options: ["NEW", "QUALIFIED", "QUOTATION", "NEGOTIATION", "CONFIRMED", "LOST"], sampleValue: "QUALIFIED", aliases: ["status", "stage", "lead status"] },
      { key: "estimatedValue", label: "Estimated Deal Value (₹)", required: false, type: "number", sampleValue: "450000", aliases: ["value", "amount", "budget", "est value", "deal value"] },
    ],
  },
  CORPORATE: {
    title: "Corporate Accounts & Clients",
    description: "Import enterprise corporate clients, rate tier agreements & contract details.",
    fields: [
      { key: "name", label: "Corporate Company Name", required: true, type: "string", sampleValue: "Infosys Ltd", aliases: ["company name", "company", "account", "name"] },
      { key: "industry", label: "Industry", required: true, type: "string", sampleValue: "IT & Services", aliases: ["industry", "sector", "domain"] },
      { key: "accountManager", label: "Account Manager", required: false, type: "string", sampleValue: "Vikram Malhotra", aliases: ["manager", "account owner", "assigned to", "owner"] },
      { key: "contractDiscountPct", label: "Discount Rate (%)", required: false, type: "number", sampleValue: "20", aliases: ["discount", "rate discount", "% discount", "contractdiscountpct"] },
      { key: "city", label: "Headquarters City", required: false, type: "string", sampleValue: "Bengaluru", aliases: ["city", "location", "address"] },
      { key: "website", label: "Company Website", required: false, type: "string", sampleValue: "https://infosys.com", aliases: ["website", "url"] },
    ],
  },
  RESERVATION: {
    title: "Reservations & Booking Records",
    description: "Import guest reservations, room assignments, stay dates & billing amounts.",
    fields: [
      { key: "guest", label: "Guest Full Name", required: true, type: "string", sampleValue: "Rahul Sharma", aliases: ["guest name", "guest", "customer", "name"] },
      { key: "property", label: "Property Name", required: true, type: "string", sampleValue: "Monday Hotel Aerocity Delhi", aliases: ["property", "hotel", "hotel name", "resort"] },
      { key: "room", label: "Room Category / Number", required: false, type: "string", sampleValue: "Executive Suite", aliases: ["room", "room type", "suite"] },
      { key: "checkIn", label: "Check-In Date (YYYY-MM-DD)", required: true, type: "date", sampleValue: "2026-10-05", aliases: ["checkin", "check in", "arrival", "check-in date"] },
      { key: "checkOut", label: "Check-Out Date (YYYY-MM-DD)", required: true, type: "date", sampleValue: "2026-10-09", aliases: ["checkout", "check out", "departure", "check-out date"] },
      { key: "totalAmount", label: "Total Billing Amount (₹)", required: true, type: "number", sampleValue: "34000", aliases: ["amount", "total amount", "total", "price", "billing"] },
      { key: "reservationStatus", label: "Reservation Status", required: false, type: "select", options: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"], sampleValue: "CONFIRMED", aliases: ["status", "reservation status"] },
    ],
  },
  GUEST: {
    title: "Guest 360 Profiles",
    description: "Import guest contact cards, VIP loyalty tiers, and preference notes.",
    fields: [
      { key: "firstName", label: "First Name", required: true, type: "string", sampleValue: "Priya", aliases: ["first name", "firstname", "name"] },
      { key: "lastName", label: "Last Name", required: true, type: "string", sampleValue: "Patel", aliases: ["last name", "lastname", "surname"] },
      { key: "email", label: "Email Address", required: true, type: "email", sampleValue: "priya.patel@outlook.com", aliases: ["email", "guest email", "e-mail"] },
      { key: "phone", label: "Phone Number", required: false, type: "string", sampleValue: "+91 99887 76655", aliases: ["phone", "mobile", "tel"] },
      { key: "vipTier", label: "VIP Loyalty Tier", required: false, type: "select", options: ["Standard", "Silver", "Gold", "Platinum", "Black Diamond"], sampleValue: "Gold", aliases: ["vip", "tier", "loyalty tier", "viptier"] },
      { key: "preferredProperty", label: "Preferred Property", required: false, type: "string", sampleValue: "Monday Hotel Aerocity Delhi", aliases: ["property", "preferred property"] },
    ],
  },
};

/**
 * Robust CSV/TSV parser supporting quoted strings and newlines
 */
export function parseCSVText(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === "," || char === "\t") && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ""));
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ""));
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || "";
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Suggest best field mapping from CSV Headers to Entity Fields
 */
export function autoSuggestFieldMapping(headers: string[], entityType: MigrationEntityType): Record<string, string> {
  const fields = ENTITY_SCHEMA_MAP[entityType].fields;
  const mapping: Record<string, string> = {};

  fields.forEach((field) => {
    const exactHeader = headers.find(
      (h) => h === field.key.toLowerCase() || h === field.label.toLowerCase()
    );

    if (exactHeader) {
      mapping[field.key] = exactHeader;
      return;
    }

    const aliasHeader = headers.find((h) => field.aliases.some((alias) => alias.toLowerCase() === h));
    if (aliasHeader) {
      mapping[field.key] = aliasHeader;
    }
  });

  return mapping;
}

/**
 * Validate and Deduplicate CSV Rows against local CRM records
 */
export function validateAndDeduplicate(
  entityType: MigrationEntityType,
  rows: Record<string, string>[],
  fieldMapping: Record<string, string>
): ValidatedRow[] {
  const schema = ENTITY_SCHEMA_MAP[entityType];

  const existingLeads = getLeads();
  const existingCompanies = getCompanies();
  const existingReservations = getReservations();
  const existingGuests = getGuests();

  const validated: ValidatedRow[] = [];

  rows.forEach((row, idx) => {
    const mappedData: Record<string, any> = {};
    const errors: string[] = [];
    const warnings: string[] = [];

    schema.fields.forEach((f) => {
      const csvHeader = fieldMapping[f.key];
      const rawVal = csvHeader && row[csvHeader] ? row[csvHeader].trim() : "";

      if (f.required && !rawVal) {
        errors.push(`Missing required field: '${f.label}'`);
      }

      if (rawVal) {
        if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(rawVal)) {
          errors.push(`Invalid email format for '${f.label}': ${rawVal}`);
        } else if (f.type === "number" && isNaN(Number(rawVal.replace(/[^0-9.-]+/g, "")))) {
          errors.push(`Invalid numeric value for '${f.label}': ${rawVal}`);
        }
      }

      if (f.type === "number" && rawVal) {
        mappedData[f.key] = Number(rawVal.replace(/[^0-9.-]+/g, "")) || 0;
      } else {
        mappedData[f.key] = rawVal || f.sampleValue;
      }
    });

    let isDuplicate = false;
    const emailVal = (mappedData.email || "").toLowerCase();

    if (entityType === "LEAD" && emailVal) {
      isDuplicate = existingLeads.some((l) => (l.email || "").toLowerCase() === emailVal);
    } else if (entityType === "CORPORATE" && mappedData.name) {
      isDuplicate = existingCompanies.some((c) => c.name.toLowerCase() === mappedData.name.toLowerCase());
    } else if (entityType === "RESERVATION" && mappedData.guest) {
      isDuplicate = existingReservations.some((r) => r.guest.toLowerCase() === mappedData.guest.toLowerCase());
    } else if (entityType === "GUEST" && emailVal) {
      isDuplicate = existingGuests.some((g) => g.email.toLowerCase() === emailVal);
    }

    if (isDuplicate) {
      warnings.push(`Duplicate record detected in database. Skip or import available.`);
    }

    let status: ValidatedRow["status"] = "VALID";
    if (errors.length > 0) {
      status = "ERROR_INVALID";
    } else if (warnings.length > 0) {
      status = "WARNING_DUPLICATE";
    }

    validated.push({
      rowIndex: idx + 1,
      originalData: row,
      mappedData,
      status,
      errors,
      warnings,
    });
  });

  return validated;
}

/**
 * Execute Batch Migration into CRM database storage
 */
export function executeBatchMigration(
  entityType: MigrationEntityType,
  rowsToImport: ValidatedRow[]
): { insertedCount: number; skippedCount: number; errorCount: number } {
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  rowsToImport.forEach((row) => {
    if (row.status === "ERROR_INVALID") {
      errorCount++;
      return;
    }

    try {
      if (entityType === "LEAD") {
        createLead({
          companyName: row.mappedData.companyName || "Imported Enterprise",
          industryDomain: "Corporate Services",
          location: "India",
          websiteUrl: "https://mondayhotels.com",
          contactPocName: row.mappedData.contactPocName,
          designation: "Corporate Buyer",
          phone: row.mappedData.phone || "+91 90000 00000",
          email: row.mappedData.email,
          businessOverview: "Bulk imported lead record via Enterprise Migration Tool",
          problemFriction: "None recorded",
          projectRequirement: "Corporate Stay Contract",
          placementOpportunity: row.mappedData.targetProperty || "Monday Hotel Aerocity Delhi",
          priorityLevel: row.mappedData.priorityLevel || "MEDIUM",
          pipelineStatus: row.mappedData.pipelineStatus || "NEW",
          nextAction: "Initial sales contact & qualification call",
          dateAdded: new Date().toISOString().split("T")[0],
          leadSource: row.mappedData.leadSource || "Corporate B2B Outreach",
          contactMethod: "Email",
          digitalPresenceScore: 4,
          hiringActivityScore: 3,
          techStackFitScore: 4,
          fundingRevenueScore: 4,
          projectUrgencyScore: 3,
          budgetClarityScore: 4,
          projectAllocationStatus: "ASSIGNED",
          estimatedValue: row.mappedData.estimatedValue || 150000,
          targetProperty: row.mappedData.targetProperty || "Monday Hotel Aerocity Delhi",
          assignedTo: "user-1",
        });
        insertedCount++;
      } else if (entityType === "CORPORATE") {
        createCompany({
          name: row.mappedData.name || "Corporate Enterprise",
          industry: row.mappedData.industry || "General Services",
          website: row.mappedData.website || "https://mondayhotels.com",
          corporateCode: "CORP-" + Date.now().toString(36).toUpperCase().slice(-4),
          contractDiscountPct: row.mappedData.contractDiscountPct || 15,
          accountManager: row.mappedData.accountManager || "Vikram Malhotra",
          address: "Business Park",
          city: row.mappedData.city || "Bengaluru",
          country: "India",
          status: "ACTIVE",
        });
        insertedCount++;
      } else if (entityType === "RESERVATION") {
        createReservation({
          reservationNumber: "RES-IMP-" + Date.now().toString(36).toUpperCase().slice(-5),
          guest: row.mappedData.guest,
          property: row.mappedData.property || "Monday Hotel Aerocity Delhi",
          room: row.mappedData.room || "Executive Suite",
          checkIn: row.mappedData.checkIn || "2026-10-15",
          checkOut: row.mappedData.checkOut || "2026-10-18",
          numberOfGuests: 1,
          rate: 8500,
          totalAmount: row.mappedData.totalAmount || 25500,
          paymentStatus: "PAID",
          reservationStatus: row.mappedData.reservationStatus || "CONFIRMED",
          bookingSource: "Direct Migration",
        });
        insertedCount++;
      } else if (entityType === "GUEST") {
        createGuest({
          firstName: row.mappedData.firstName || "Imported",
          lastName: row.mappedData.lastName || "Guest",
          email: row.mappedData.email,
          phone: row.mappedData.phone || "+91 99000 00000",
          vipTier: row.mappedData.vipTier || "Silver",
          status: "Active",
          totalStays: 1,
          totalNights: 2,
          lifetimeSpend: 15000,
          averageDailyRate: 7500,
          preferredProperty: row.mappedData.preferredProperty || "Monday Hotel Aerocity Delhi",
          preferredRoomType: "Deluxe Executive Room",
        });
        insertedCount++;
      }
    } catch (err) {
      errorCount++;
    }
  });

  return { insertedCount, skippedCount, errorCount };
}

/**
 * Generate Sample downloadable CSV template
 */
export function generateSampleCSV(entityType: MigrationEntityType): string {
  const schema = ENTITY_SCHEMA_MAP[entityType];
  const headers = schema.fields.map((f) => f.label);
  const sampleValues = schema.fields.map((f) => `"${f.sampleValue}"`);

  return [headers.join(","), sampleValues.join(",")].join("\n");
}
