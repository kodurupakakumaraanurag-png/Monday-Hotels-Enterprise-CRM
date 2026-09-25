import { CompanyFormData, ContactFormData } from "@/lib/validations/corporate-schema";

export interface CorporateCompanyRecord extends CompanyFormData {
  id: string;
  totalSpend: number;
  totalRoomNights: number;
  createdAt: string;
}

export interface B2BContactRecord extends ContactFormData {
  id: string;
  companyName: string;
  createdAt: string;
}

export interface CompanyActivity {
  id: string;
  title: string;
  type: "CONTRACT_SIGNED" | "CALL" | "EMAIL" | "MEETING" | "NOTE";
  performer: string;
  timestamp: string;
}

// Initial Corporate Companies
export const INITIAL_COMPANIES: CorporateCompanyRecord[] = [
  {
    id: "COMP-101",
    name: "TechCorp Global Solutions",
    industry: "Technology & Software",
    website: "https://techcorp-global.com",
    corporateCode: "CORP-TC-2026",
    contractDiscountPct: 18.5,
    accountManager: "Rahul Verma (Sales Exec)",
    address: "Prestige Tech Park, Outer Ring Road",
    city: "Bengaluru",
    country: "India",
    status: "VIP_ACCOUNT",
    totalSpend: 345000,
    totalRoomNights: 850,
    createdAt: "2026-01-15",
  },
  {
    id: "COMP-102",
    name: "Goldman Sachs India",
    industry: "Banking & Financial Services",
    website: "https://goldmansachs-example.com",
    corporateCode: "CORP-GS-2026",
    contractDiscountPct: 22.0,
    accountManager: "Priya Sharma (Sales Mgr)",
    address: "Express Towers, Nariman Point",
    city: "Mumbai",
    country: "India",
    status: "ACTIVE",
    totalSpend: 520000,
    totalRoomNights: 1240,
    createdAt: "2026-02-01",
  },
  {
    id: "COMP-103",
    name: "Novartis Asia Pacific",
    industry: "Pharmaceuticals & Healthcare",
    website: "https://novartis-apac.com",
    corporateCode: "CORP-NOV-2026",
    contractDiscountPct: 15.0,
    accountManager: "Rahul Verma (Sales Exec)",
    address: "DLF Cyber City, Phase 3",
    city: "Gurugram / Delhi",
    country: "India",
    status: "PROSPECT",
    totalSpend: 210000,
    totalRoomNights: 520,
    createdAt: "2026-03-10",
  },
  {
    id: "COMP-104",
    name: "McKinsey & Company",
    industry: "Management Consulting",
    website: "https://mckinsey-example.com",
    corporateCode: "CORP-MCK-2026",
    contractDiscountPct: 20.0,
    accountManager: "Priya Sharma (Sales Mgr)",
    address: "Bandra Kurla Complex",
    city: "Mumbai",
    country: "India",
    status: "ACTIVE",
    totalSpend: 410000,
    totalRoomNights: 980,
    createdAt: "2026-04-05",
  },
];

// Initial B2B Contacts linked via `companyId`
export const INITIAL_CONTACTS: B2BContactRecord[] = [
  {
    id: "CNT-301",
    companyId: "COMP-101",
    companyName: "TechCorp Global Solutions",
    firstName: "Sunil",
    lastName: "Nair",
    email: "sunil.nair@techcorp-global.com",
    phone: "+91 98765 43210",
    designation: "VP Corporate Events & Global Travel",
    contactType: "PRIMARY",
    isPrimaryContact: true,
    notes: "Primary decision maker for annual Tech Leadership Summit.",
    createdAt: "2026-01-16",
  },
  {
    id: "CNT-302",
    companyId: "COMP-101",
    companyName: "TechCorp Global Solutions",
    firstName: "Deepa",
    lastName: "Menon",
    email: "deepa.menon@techcorp-global.com",
    phone: "+91 98765 43211",
    designation: "Corporate Travel Manager",
    contactType: "BILLING",
    isPrimaryContact: false,
    notes: "Handles corporate rate invoices and PO dispatch.",
    createdAt: "2026-01-20",
  },
  {
    id: "CNT-303",
    companyId: "COMP-102",
    companyName: "Goldman Sachs India",
    firstName: "Meera",
    lastName: "Krishnan",
    email: "meera.krishnan@gs-example.com",
    phone: "+91 98222 55667",
    designation: "Director of Executive Relations",
    contactType: "EXECUTIVE",
    isPrimaryContact: true,
    notes: "Oversees executive retreats and C-suite bookings.",
    createdAt: "2026-02-02",
  },
  {
    id: "CNT-304",
    companyId: "COMP-103",
    companyName: "Novartis Asia Pacific",
    firstName: "Dr. Rohan",
    lastName: "Kapoor",
    email: "rohan.kapoor@novartis-apac.com",
    phone: "+91 97654 32109",
    designation: "Regional Medical Affairs Manager",
    contactType: "EVENT_PLANNER",
    isPrimaryContact: true,
    notes: "Coordinates APAC Oncology Symposium & medical board meetings.",
    createdAt: "2026-03-12",
  },
  {
    id: "CNT-305",
    companyId: "COMP-104",
    companyName: "McKinsey & Company",
    firstName: "Devika",
    lastName: "Roy",
    email: "devika_roy@mckinsey-example.com",
    phone: "+91 98450 11223",
    designation: "Senior Operations Director",
    contactType: "PRIMARY",
    isPrimaryContact: true,
    notes: "Manages partner strategy summit logistics.",
    createdAt: "2026-04-06",
  },
];

let COMPANIES_STORE: CorporateCompanyRecord[] = [...INITIAL_COMPANIES];
let CONTACTS_STORE: B2BContactRecord[] = [...INITIAL_CONTACTS];

// Corporate Companies API
export function getCompanies(): CorporateCompanyRecord[] {
  return COMPANIES_STORE;
}

export function getCompanyById(id: string): CorporateCompanyRecord | undefined {
  return COMPANIES_STORE.find((c) => c.id === id);
}

export function createCompany(data: CompanyFormData): CorporateCompanyRecord {
  const newComp: CorporateCompanyRecord = {
    ...data,
    id: data.id || `COMP-${Math.floor(100 + Math.random() * 899)}`,
    totalSpend: 0,
    totalRoomNights: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  COMPANIES_STORE = [newComp, ...COMPANIES_STORE];
  return newComp;
}

export function updateCompany(id: string, data: Partial<CompanyFormData>): CorporateCompanyRecord | undefined {
  const index = COMPANIES_STORE.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updated = { ...COMPANIES_STORE[index], ...data };
  COMPANIES_STORE[index] = updated;

  // Also update companyName in linked contacts
  if (data.name) {
    CONTACTS_STORE = CONTACTS_STORE.map((cnt) =>
      cnt.companyId === id ? { ...cnt, companyName: data.name! } : cnt
    );
  }

  return updated;
}

export function deleteCompany(id: string): boolean {
  const initLen = COMPANIES_STORE.length;
  COMPANIES_STORE = COMPANIES_STORE.filter((c) => c.id !== id);
  CONTACTS_STORE = CONTACTS_STORE.filter((cnt) => cnt.companyId !== id);
  return COMPANIES_STORE.length < initLen;
}

// Contacts API
export function getContacts(): B2BContactRecord[] {
  return CONTACTS_STORE;
}

export function getContactById(id: string): B2BContactRecord | undefined {
  return CONTACTS_STORE.find((cnt) => cnt.id === id);
}

export function getContactsByCompanyId(companyId: string): B2BContactRecord[] {
  return CONTACTS_STORE.filter((cnt) => cnt.companyId === companyId);
}

export function createContact(data: ContactFormData): B2BContactRecord {
  const company = getCompanyById(data.companyId);
  const newCnt: B2BContactRecord = {
    ...data,
    id: data.id || `CNT-${Math.floor(300 + Math.random() * 699)}`,
    companyName: company ? company.name : "Corporate Account",
    createdAt: new Date().toISOString().split("T")[0],
  };

  CONTACTS_STORE = [newCnt, ...CONTACTS_STORE];
  return newCnt;
}

export function updateContact(id: string, data: Partial<ContactFormData>): B2BContactRecord | undefined {
  const index = CONTACTS_STORE.findIndex((cnt) => cnt.id === id);
  if (index === -1) return undefined;

  const current = CONTACTS_STORE[index];
  const targetCompany = data.companyId ? getCompanyById(data.companyId) : undefined;

  const updated: B2BContactRecord = {
    ...current,
    ...data,
    companyName: targetCompany ? targetCompany.name : current.companyName,
  };

  CONTACTS_STORE[index] = updated;
  return updated;
}

export function deleteContact(id: string): boolean {
  const initLen = CONTACTS_STORE.length;
  CONTACTS_STORE = CONTACTS_STORE.filter((cnt) => cnt.id !== id);
  return CONTACTS_STORE.length < initLen;
}
