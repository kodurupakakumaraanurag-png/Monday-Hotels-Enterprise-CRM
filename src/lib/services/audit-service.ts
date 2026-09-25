export type ActionCategory =
  | "Lead Mutation"
  | "Corporate Contract"
  | "Guest Profile"
  | "RBAC Permission"
  | "System Config"
  | "Security Alert";

export interface FieldChange {
  fieldName: string;
  beforeValue: string;
  afterValue: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  actionCategory: ActionCategory;
  actionText: string;
  ipAddress: string;
  targetEntityId: string;
  targetEntityName: string;
  severity: "Info" | "Warning" | "Critical";
  changes: FieldChange[];
}

const MOCK_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: "AUD-9901",
    timestamp: "2026-09-25 21:15 text",
    userId: "USR-001",
    userName: "Anurag Kodurupa",
    userRole: "Super Admin",
    actionCategory: "Corporate Contract",
    actionText: "Approved B2B Contract Discount Rate",
    ipAddress: "192.168.1.45 (Mumbai HQ)",
    targetEntityId: "CORP-101",
    targetEntityName: "Reliance Enterprise Solutions",
    severity: "Info",
    changes: [
      {
        fieldName: "corporateDiscountPercentage",
        beforeValue: "18.0%",
        afterValue: "22.5%",
      },
      {
        fieldName: "contractStatus",
        beforeValue: "Pending Review",
        afterValue: "Active Contract",
      },
      {
        fieldName: "negotiatedADR",
        beforeValue: "1400.00 USD",
        afterValue: "1280.00 USD",
      },
    ],
  },
  {
    id: "AUD-9902",
    timestamp: "2026-09-25 19:40",
    userId: "USR-003",
    userName: "Vikram Malhotra",
    userRole: "Corporate Sales Director",
    actionCategory: "Lead Mutation",
    actionText: "Advanced Lead Stage to Closed Won",
    ipAddress: "10.0.4.12 (Delhi Branch)",
    targetEntityId: "LEAD-501",
    targetEntityName: "Tata Consultancy Services (Annual Convention)",
    severity: "Info",
    changes: [
      {
        fieldName: "pipelineStatus",
        beforeValue: "Negotiation",
        afterValue: "Closed Won",
      },
      {
        fieldName: "totalLeadScore",
        beforeValue: "24",
        afterValue: "29",
      },
      {
        fieldName: "placementOpportunity",
        beforeValue: "Annual Executive Retreat",
        afterValue: "450 Suite Nights Booked",
      },
    ],
  },
  {
    id: "AUD-9903",
    timestamp: "2026-09-25 17:10",
    userId: "USR-002",
    userName: "Priya Sharma",
    userRole: "Hotel General Manager",
    actionCategory: "Guest Profile",
    actionText: "Upgraded VIP Tier & Logged High-Touch Butler Preference",
    ipAddress: "192.168.1.88 (Grand Royale Concierge Desk)",
    targetEntityId: "GST-9001",
    targetEntityName: "Dr. Vikramaditya Singhania",
    severity: "Info",
    changes: [
      {
        fieldName: "vipTier",
        beforeValue: "Platinum",
        afterValue: "Black Diamond",
      },
      {
        fieldName: "specialRequests",
        beforeValue: "Standard goose down pillows",
        afterValue: "Sparkling Water in room upon check-in; Preferred Butler: Rajesh",
      },
    ],
  },
  {
    id: "AUD-9904",
    timestamp: "2026-09-24 14:02",
    userId: "USR-001",
    userName: "Anurag Kodurupa",
    userRole: "Super Admin",
    actionCategory: "RBAC Permission",
    actionText: "Elevated User Role & Enforced Multi-Factor Auth",
    ipAddress: "192.168.1.45 (Mumbai HQ)",
    targetEntityId: "USR-004",
    targetEntityName: "Ayesha Mukherjee",
    severity: "Warning",
    changes: [
      {
        fieldName: "role",
        beforeValue: "Revenue Analyst",
        afterValue: "Revenue Manager",
      },
      {
        fieldName: "mfaEnabled",
        beforeValue: "false",
        afterValue: "true",
      },
      {
        fieldName: "propertyAccess",
        beforeValue: "Monday Hotels Palace Udaipur",
        afterValue: "Monday Hotels Palace Udaipur, Monday Hotels Resort & Spa Goa",
      },
    ],
  },
  {
    id: "AUD-9905",
    timestamp: "2026-09-24 10:15",
    userId: "USR-001",
    userName: "System Security Bot",
    userRole: "Automated System",
    actionCategory: "Security Alert",
    actionText: "SOC2 Compliance Export Initiated",
    ipAddress: "127.0.0.1 (Internal Service)",
    targetEntityId: "SYS-EXPORT-88",
    targetEntityName: "Monthly Security Audit File",
    severity: "Info",
    changes: [],
  },
];

export function getAuditLogs(): AuditLogRecord[] {
  return MOCK_AUDIT_LOGS;
}
