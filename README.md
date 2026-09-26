# 🏨 Monday Hotels Enterprise CRM

> Next-Generation Hospitality Operations, B2B Commercial Sales Pipeline, Guest 360 Intelligence & Portfolio Revenue Management System.

---

## 1. Project Overview

**Monday Hotels Enterprise CRM** is a multi-property hospitality management platform engineered for luxury hotel groups, resort chains, and enterprise sales teams. It unifies inbound lead acquisition, 8-stage sales pipeline management, corporate B2B contracts, guest 360 RFM retention intelligence, room conflict prevention engines, and financial revenue yield analytics into a high-performance workspace.

---

## 2. Key Features

- **Executive & Portfolio Dashboard**: Real-time RevPAR, ADR, Occupancy Rate cards, SLA alert feeds, and interactive Recharts visualizations.
- **26-Field Sales Lead Engine**: Granular lead acquisition with Zod schema validation, 6-component scoring algorithm (0-30 scale), SLA countdown timers, and allocation drawers.
- **Corporate Accounts & B2B Contacts**: Corporate client master records, rate tier agreements, discount schedules, and contact relationship trees.
- **Guest 360 & Retention Operations**: Deterministic RFM customer intelligence, automated guest segmentation (`NEW`, `RETURNING`, `FREQUENT`, `CORPORATE`, `HIGH_VALUE`, `AT_RISK`), and churn prevention campaigns.
- **Booking Enquiries & Reservations**: Real-time room inventory conflict prevention engine, check-in/out status management, and automated rate calculations.
- **8-Stage Enterprise Sales Pipeline**: Interactive Drag-and-Drop Kanban pipeline with stage probability weighting and deal value calculations.
- **Tasks & Operational Activities**: Unified activity stream logs (`CALL`, `EMAIL`, `MEETING`, `SITE_VISIT`, `NOTE`, `FOLLOW_UP`) with reusable entity timelines.
- **Enterprise Reports & Revenue Intelligence**: 8 detailed analytical report tabs with universal filters (Date Range, Property, Source, Sales Exec, Status).
- **Export & Email Digest System**: Formatted PDF document printer with executive commentary, Excel (.xls) & CSV spreadsheet exporters, and Automated HTML Email Digest Scheduler.
- **Data Import & Migration Wizard**: 4-Step CSV/Excel bulk migration tool with auto-header matching, Zod validation, and email deduplication.
- **Global Search Command Palette**: Sub-15ms multi-entity search (`⌘K` / `Ctrl+K`) across 7 CRM entity categories with keyboard arrow navigation.
- **SOC2 Audit Logging & Security**: Audit trail recording entity mutations, field-level before/after diffs, IP logging, and secret sanitization.

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript 6.0
- **Styling**: Vanilla CSS + Tailwind CSS (Custom Dark Mode Enterprise Design System)
- **Icons**: Lucide React
- **Visualization**: Recharts 3.10
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth SSR)
- **Validation**: Zod 4.6

---

## 4. System Architecture

```
Monday-Hotels-Enterprise-CRM/
├── src/
│   ├── app/                    # Next.js App Router Page Routes (23 Routes)
│   │   ├── dashboard/          # Executive KPI Dashboard
│   │   ├── leads/              # Lead Acquisition & Scoring
│   │   ├── corporate/          # Corporate Accounts & B2B Contacts
│   │   ├── guests/             # Guest 360 Profiles
│   │   ├── reservations/       # Reservation Management & Conflict Engine
│   │   ├── booking-enquiries/  # Inbound Rate Enquiries
│   │   ├── pipeline/           # 8-Stage Sales Pipeline Kanban
│   │   ├── opportunities/      # Qualified Sales Deals
│   │   ├── tasks/              # Operational Task Management
│   │   ├── activities/         # Unified Activity Stream
│   │   ├── guest-retention/    # Customer RFM Intelligence
│   │   ├── reports/            # 8 Enterprise Analytical Reports
│   │   ├── import/             # 4-Step Data Migration Wizard
│   │   ├── audit-logs/         # SOC2 Audit Trail
│   │   ├── notifications/      # Notification Center
│   │   ├── settings/           # System Configurations & Seeder
│   │   └── login/              # Auth Portal
│   ├── components/             # Modular UI Components & Drawers
│   ├── context/                # Auth & RBAC State Provider
│   ├── lib/
│   │   ├── auth/               # RBAC Permissions Matrix
│   │   ├── services/           # Data & Calculation Services
│   │   ├── validations/        # Zod Schemas
│   │   └── supabase/           # Supabase Client Integrations
└── supabase/
    └── migrations/             # PostgreSQL Schemas & RLS Security Policies
```

---

## 5. Database Structure

The database consists of **14 relational PostgreSQL tables**:

1. `properties` – Flagship hotel property records, inventory, star ratings.
2. `users` – Staff accounts, assigned roles, property allocations.
3. `companies` – Corporate clients, rate tier agreements, discount percentages.
4. `contacts` – B2B corporate contact records & designations.
5. `guests` – Guest 360 profiles, VIP loyalty tiers, preference notes.
6. `leads` – Inbound & outbound sales leads with 26-field structure.
7. `rooms` – Room categories, inventory status, daily rates.
8. `booking_enquiries` – Inbound rate inquiries & SLA status.
9. `opportunities` – Commercial sales deals & pipeline stages.
10. `reservations` – Confirmed guest stay bookings & billing records.
11. `activities` – Interaction logs (`CALL`, `MEETING`, `SITE_VISIT`, etc.).
12. `tasks` – Operational action items, due dates, priority levels.
13. `notifications` – System alerts & user notification items.
14. `audit_logs` – SOC2 compliance event logs & field diffs.

---

## 6. Authentication

Authentication is handled via **Supabase Auth** (`@supabase/ssr`). Protected page routes are guarded by `AuthProvider` and `RoleGuard` wrapper components, checking session tokens and user status before rendering protected pages.

---

## 7. Role-Based Access Control (RBAC)

| Role | Dashboard | Leads & Deals | Reservations | Financial Reports | Audit Logs |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `SUPER_ADMIN` | Full | Full | Full | Full | Full |
| `HOTEL_GM` | Full | View/Edit | Full | Full | View |
| `SALES_EXEC` | Portfolio | Full | View | Sales Only | Restricted |
| `GUEST_RELATIONS` | Guest View | Restricted | Full | Restricted | Restricted |

---

## 8. Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/kodurupakakumaraanurag-png/Monday-Hotels-Enterprise-CRM.git
cd "MONDAY HOTELS ENTERPRISE CRM"

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Environment Variables

Configure the following variables in `.env.local` or your Vercel project settings:

| Variable Name | Required | Purpose |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_APP_NAME` | Yes | Application Title |
| `NEXT_PUBLIC_APP_URL` | Yes | App Base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Public Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Supabase Private Service Role Key |

---

## 10. Supabase Setup & Configuration

1. Create a new project at [Supabase Dashboard](https://database.new).
2. Copy your **Project URL** and **Anon API Key** into `.env.local`.
3. Under **Authentication > URL Configuration**, add your Vercel deployment URL to **Redirect URLs**:
   `https://mondayhotels-crm.vercel.app/login`

---

## 11. Database Migration Instructions

Execute the SQL scripts in your Supabase **SQL Editor** in sequential order:

1. Run `supabase/migrations/20260925000000_initial_schema.sql` (Creates core tables, enums, triggers, and indexes).
2. Run `supabase/migrations/20260926000000_security_rls_policies.sql` (Enables Row Level Security and configures role policies).

---

## 12. Demo Data Setup

The platform includes an automated **Synthetic Demo Data Seeder Engine** (`src/lib/demo-data/demo-seeder.ts`).

- To seed or reset 250+ realistic records, navigate to **Settings > System Configuration** and click **Reseed Synthetic Demo Data**.
- Alternatively, run `seedSyntheticDemoData()` in client code.

---

## 13. Production Deployment (Vercel)

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Production
vercel --prod
```

### Option B: GitHub Integration

1. Push your repository to GitHub.
2. Import project into [Vercel Dashboard](https://vercel.com/new).
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click **Deploy**.

---

## 14. Known Limitations

- **Offline Demo Fallback**: When Supabase connection is offline or in local demo mode, data operations default to in-memory/localStorage fallback state.
- **Simulated Dispatch**: Automated Email Digests & Test Email Dispatches simulate SMTP delivery without sending live external network emails unless external gateway keys are configured.

---

## 15. Future Improvements

1. **Third-Party Integration Gateways**: Live PMS room sync, WhatsApp / SMS notification API webhooks.
2. **AI Dynamic Pricing Engine**: Machine learning model for automated seasonal room rate optimization.
3. **End-to-End Automated Test Suite**: Playwright & Vitest integration test pipeline.

---

*Monday Hotels Enterprise CRM • Designed for Hospitality Excellence*
