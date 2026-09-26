/**
 * Global CRM Search Engine for Monday Hotels Enterprise CRM
 * Fast multi-entity search across Leads, Companies, Contacts, Guests, Opportunities, Booking Enquiries, and Reservations.
 */

import { getLeads, CompleteLeadRecord } from "./lead-service";
import { getCompanies, getContacts, CorporateCompanyRecord, B2BContactRecord } from "./corporate-service";
import { getGuests, GuestProfile } from "./guest-service";
import { getEnterpriseOpportunities, EnterpriseOpportunity } from "./opportunity-service";
import { getReservations, getEnquiries, Reservation, BookingEnquiry } from "./reservation-service";

export type SearchEntityCategory =
  | "LEAD"
  | "COMPANY"
  | "CONTACT"
  | "GUEST"
  | "OPPORTUNITY"
  | "ENQUIRY"
  | "RESERVATION";

export interface SearchResultItem {
  id: string;
  category: SearchEntityCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  metadataText?: string;
  targetHref: string;
}

export interface GroupedSearchResults {
  totalCount: number;
  executionTimeMs: number;
  grouped: Record<SearchEntityCategory, SearchResultItem[]>;
}

/**
 * Execute fast multi-entity search with filtering and metadata tagging
 */
export function performGlobalSearch(rawQuery: string): GroupedSearchResults {
  const startTime = performance.now();
  const query = rawQuery.trim().toLowerCase();

  const results: Record<SearchEntityCategory, SearchResultItem[]> = {
    LEAD: [],
    COMPANY: [],
    CONTACT: [],
    GUEST: [],
    OPPORTUNITY: [],
    ENQUIRY: [],
    RESERVATION: [],
  };

  if (!query) {
    return {
      totalCount: 0,
      executionTimeMs: 0,
      grouped: results,
    };
  }

  // 1. Search Leads
  const leads = getLeads();
  leads.forEach((l: CompleteLeadRecord) => {
    const match =
      l.contactPocName.toLowerCase().includes(query) ||
      (l.companyName || "").toLowerCase().includes(query) ||
      l.email.toLowerCase().includes(query) ||
      (l.phone || "").includes(query) ||
      (l.targetProperty || "").toLowerCase().includes(query) ||
      l.id.toLowerCase().includes(query);

    if (match) {
      results.LEAD.push({
        id: l.id,
        category: "LEAD",
        categoryLabel: "Sales Lead",
        title: l.contactPocName,
        subtitle: `${l.companyName || "Independent"} • ${l.email}`,
        badge: l.pipelineStatus,
        badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        metadataText: l.estimatedValue ? `Est: ₹${l.estimatedValue.toLocaleString()}` : undefined,
        targetHref: `/leads`,
      });
    }
  });

  // 2. Search Corporate Companies
  const companies = getCompanies();
  companies.forEach((c: CorporateCompanyRecord) => {
    const match =
      c.name.toLowerCase().includes(query) ||
      c.industry.toLowerCase().includes(query) ||
      (c.city || "").toLowerCase().includes(query) ||
      (c.corporateCode || "").toLowerCase().includes(query) ||
      c.id.toLowerCase().includes(query);

    if (match) {
      results.COMPANY.push({
        id: c.id,
        category: "COMPANY",
        categoryLabel: "Corporate Account",
        title: c.name,
        subtitle: `${c.industry} • ${c.city || "India"}`,
        badge: c.status,
        badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        metadataText: `Discount: ${c.contractDiscountPct}%`,
        targetHref: `/corporate`,
      });
    }
  });

  // 3. Search B2B Contacts
  const contacts = getContacts();
  contacts.forEach((cnt: B2BContactRecord) => {
    const fullName = `${cnt.firstName} ${cnt.lastName}`;
    const match =
      fullName.toLowerCase().includes(query) ||
      cnt.email.toLowerCase().includes(query) ||
      (cnt.phone || "").includes(query) ||
      (cnt.companyName || "").toLowerCase().includes(query) ||
      (cnt.designation || "").toLowerCase().includes(query) ||
      cnt.id.toLowerCase().includes(query);

    if (match) {
      results.CONTACT.push({
        id: cnt.id,
        category: "CONTACT",
        categoryLabel: "B2B Contact",
        title: fullName,
        subtitle: `${cnt.designation || "Contact"} @ ${cnt.companyName}`,
        badge: cnt.contactType || "Corporate",
        badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        metadataText: cnt.email,
        targetHref: `/contacts`,
      });
    }
  });

  // 4. Search Guest Profiles
  const guests = getGuests();
  guests.forEach((g: GuestProfile) => {
    const fullName = `${g.firstName} ${g.lastName}`;
    const match =
      fullName.toLowerCase().includes(query) ||
      g.email.toLowerCase().includes(query) ||
      g.phone.includes(query) ||
      (g.preferredProperty || "").toLowerCase().includes(query) ||
      g.id.toLowerCase().includes(query);

    if (match) {
      results.GUEST.push({
        id: g.id,
        category: "GUEST",
        categoryLabel: "Guest 360 Profile",
        title: fullName,
        subtitle: `${g.email} • ${g.phone}`,
        badge: `${g.vipTier} VIP`,
        badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
        metadataText: `Stays: ${g.totalStays}`,
        targetHref: `/guests`,
      });
    }
  });

  // 5. Search Sales Opportunities
  const opps = getEnterpriseOpportunities();
  opps.forEach((o: EnterpriseOpportunity) => {
    const match =
      o.title.toLowerCase().includes(query) ||
      (o.companyName || "").toLowerCase().includes(query) ||
      (o.property || "").toLowerCase().includes(query) ||
      (o.accountOwner || "").toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query);

    if (match) {
      results.OPPORTUNITY.push({
        id: o.id,
        category: "OPPORTUNITY",
        categoryLabel: "Sales Opportunity",
        title: o.title,
        subtitle: `${o.companyName || "Account"} • ${o.property}`,
        badge: o.stage,
        badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        metadataText: `₹${(o.opportunityValue || 0).toLocaleString()}`,
        targetHref: `/opportunities`,
      });
    }
  });

  // 6. Search Booking Enquiries
  const enquiries = getEnquiries();
  enquiries.forEach((e: BookingEnquiry) => {
    const match =
      e.guest.toLowerCase().includes(query) ||
      e.enquiryNumber.toLowerCase().includes(query) ||
      e.property.toLowerCase().includes(query) ||
      (e.corporateClient || "").toLowerCase().includes(query) ||
      e.id.toLowerCase().includes(query);

    if (match) {
      results.ENQUIRY.push({
        id: e.id,
        category: "ENQUIRY",
        categoryLabel: "Booking Enquiry",
        title: `${e.guest} (${e.enquiryNumber})`,
        subtitle: `${e.property} • ${e.roomType}`,
        badge: e.status,
        badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/30",
        metadataText: `Est: ₹${e.estimatedValue.toLocaleString()}`,
        targetHref: `/booking-enquiries`,
      });
    }
  });

  // 7. Search Reservations
  const reservations = getReservations();
  reservations.forEach((r: Reservation) => {
    const match =
      r.guest.toLowerCase().includes(query) ||
      r.reservationNumber.toLowerCase().includes(query) ||
      r.property.toLowerCase().includes(query) ||
      r.room.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query);

    if (match) {
      results.RESERVATION.push({
        id: r.id,
        category: "RESERVATION",
        categoryLabel: "Reservation Record",
        title: `${r.guest} (${r.reservationNumber})`,
        subtitle: `${r.property} • ${r.room}`,
        badge: r.reservationStatus,
        badgeColor:
          r.reservationStatus === "CONFIRMED"
            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            : "bg-stone-800 text-stone-300",
        metadataText: `₹${r.totalAmount.toLocaleString()}`,
        targetHref: `/reservations`,
      });
    }
  });

  const totalCount =
    results.LEAD.length +
    results.COMPANY.length +
    results.CONTACT.length +
    results.GUEST.length +
    results.OPPORTUNITY.length +
    results.ENQUIRY.length +
    results.RESERVATION.length;

  const endTime = performance.now();

  return {
    totalCount,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    grouped: results,
  };
}
