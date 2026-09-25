-- Monday Hotels Enterprise CRM - Initial Database Schema Migration
-- Database: PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUM TYPES
-- ==========================================

CREATE TYPE booking_enquiry_status_enum AS ENUM (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'QUOTATION',
  'NEGOTIATION',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'LOST'
);

CREATE TYPE reservation_status_enum AS ENUM (
  'PENDING',
  'CONFIRMED',
  'CHECKED_IN',
  'CHECKED_OUT',
  'CANCELLED',
  'NO_SHOW'
);

CREATE TYPE payment_status_enum AS ENUM (
  'PENDING',
  'PARTIAL',
  'PAID',
  'REFUNDED'
);

CREATE TYPE pipeline_status_enum AS ENUM (
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'QUOTATION',
  'NEGOTIATION',
  'CONFIRMED',
  'COMPLETED',
  'LOST'
);

-- ==========================================
-- 2. PROPERTIES TABLE
-- ==========================================

CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'USA',
  postal_code VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  total_rooms INT DEFAULT 0 CHECK (total_rooms >= 0),
  star_rating NUMERIC(2, 1) DEFAULT 4.5 CHECK (star_rating BETWEEN 1.0 AND 5.0),
  amenities TEXT[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 3. USERS (STAFF & PROFILE RECORDS)
-- ==========================================

CREATE TABLE users (
  id UUID PRIMARY KEY, -- Maps to auth.users(id)
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('super_admin', 'property_manager', 'sales_manager', 'front_desk', 'staff')),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  avatar_url TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 4. COMPANIES (CORPORATE CLIENTS)
-- ==========================================

CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  website VARCHAR(255),
  corporate_code VARCHAR(50) UNIQUE,
  contract_discount_pct NUMERIC(5, 2) DEFAULT 0.00 CHECK (contract_discount_pct BETWEEN 0 AND 100),
  account_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 5. CONTACTS (B2B INDIVIDUALS)
-- ==========================================

CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  designation VARCHAR(100),
  is_primary_contact BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 6. GUESTS (360° PROFILE)
-- ==========================================

CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  nationality VARCHAR(100),
  vip_tier VARCHAR(50) DEFAULT 'STANDARD' CHECK (vip_tier IN ('STANDARD', 'SILVER', 'GOLD', 'PLATINUM', 'BLACK_DIAMOND')),
  total_stays_count INT DEFAULT 0 CHECK (total_stays_count >= 0),
  total_spent_amount NUMERIC(12, 2) DEFAULT 0.00 CHECK (total_spent_amount >= 0),
  preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
  special_notes TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 7. LEADS (SALES LEADS PIPELINE & SCORING)
-- ==========================================

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  industry_domain VARCHAR(100),
  location VARCHAR(255),
  website_url VARCHAR(255),
  contact_poc_name VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  business_overview TEXT,
  problem_friction TEXT,
  project_requirement TEXT,
  placement_opportunity TEXT,
  priority_level VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  pipeline_status pipeline_status_enum DEFAULT 'NEW' NOT NULL,
  next_action TEXT,
  date_added TIMESTAMPTZ DEFAULT now() NOT NULL,
  lead_source VARCHAR(100),
  contact_method VARCHAR(50),
  
  -- Lead Scoring Matrix (0 to 100 per metric)
  digital_presence_score INT DEFAULT 0 CHECK (digital_presence_score BETWEEN 0 AND 100),
  hiring_activity_score INT DEFAULT 0 CHECK (hiring_activity_score BETWEEN 0 AND 100),
  tech_stack_fit_score INT DEFAULT 0 CHECK (tech_stack_fit_score BETWEEN 0 AND 100),
  funding_revenue_score INT DEFAULT 0 CHECK (funding_revenue_score BETWEEN 0 AND 100),
  project_urgency_score INT DEFAULT 0 CHECK (project_urgency_score BETWEEN 0 AND 100),
  budget_clarity_score INT DEFAULT 0 CHECK (budget_clarity_score BETWEEN 0 AND 100),
  
  -- Computed total lead score (0 to 600)
  total_lead_score INT GENERATED ALWAYS AS (
    digital_presence_score + hiring_activity_score + tech_stack_fit_score +
    funding_revenue_score + project_urgency_score + budget_clarity_score
  ) STORED,

  project_allocation_status VARCHAR(50) DEFAULT 'UNASSIGNED',
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  target_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 8. ROOMS INVENTORY
-- ==========================================

CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_number VARCHAR(20) NOT NULL,
  room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('STANDARD_KING', 'DELUXE_DOUBLE', 'EXECUTIVE_SUITE', 'PRESIDENTIAL_SUITE', 'PENTHOUSE')),
  floor INT,
  base_rate_per_night NUMERIC(10, 2) NOT NULL CHECK (base_rate_per_night > 0),
  status VARCHAR(30) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MAINTENANCE')),
  max_occupancy INT DEFAULT 2 CHECK (max_occupancy > 0),
  amenities TEXT[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(property_id, room_number)
);

-- ==========================================
-- 9. BOOKING ENQUIRIES
-- ==========================================

CREATE TABLE booking_enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_code VARCHAR(50) UNIQUE NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  rooms_requested INT DEFAULT 1 CHECK (rooms_requested > 0),
  guests_count INT DEFAULT 1 CHECK (guests_count > 0),
  estimated_budget NUMERIC(12, 2),
  special_requests TEXT,
  status booking_enquiry_status_enum DEFAULT 'NEW' NOT NULL,
  assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT chk_enquiry_dates CHECK (check_out_date > check_in_date)
);

-- ==========================================
-- 10. OPPORTUNITIES (QUALIFIED DEALS)
-- ==========================================

CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  deal_value NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (deal_value >= 0),
  probability_pct INT DEFAULT 50 CHECK (probability_pct BETWEEN 0 AND 100),
  pipeline_status pipeline_status_enum DEFAULT 'NEW' NOT NULL,
  expected_close_date DATE,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  contract_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 11. RESERVATIONS
-- ==========================================

CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reservation_code VARCHAR(50) UNIQUE NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
  booking_enquiry_id UUID REFERENCES booking_enquiries(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults_count INT DEFAULT 1 CHECK (adults_count > 0),
  children_count INT DEFAULT 0 CHECK (children_count >= 0),
  total_amount NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (total_amount >= 0),
  deposit_amount NUMERIC(12, 2) DEFAULT 0.00 CHECK (deposit_amount >= 0),
  reservation_status reservation_status_enum DEFAULT 'PENDING' NOT NULL,
  payment_status payment_status_enum DEFAULT 'PENDING' NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT chk_reservation_dates CHECK (check_out_date > check_in_date)
);

-- ==========================================
-- 12. ACTIVITIES (TIMELINE)
-- ==========================================

CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('CALL', 'EMAIL', 'MEETING', 'SITE_VISIT', 'TASK_COMPLETED', 'STATUS_CHANGE', 'NOTE')),
  description TEXT,
  performed_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  activity_timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 13. TASKS
-- ==========================================

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  due_date TIMESTAMPTZ,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 14. NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'URGENT', 'SYSTEM')),
  is_read BOOLEAN DEFAULT false NOT NULL,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 15. AUDIT LOGS
-- ==========================================

CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==========================================
-- 16. INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_property ON users(property_id);

CREATE INDEX idx_leads_pipeline_status ON leads(pipeline_status);
CREATE INDEX idx_leads_total_score ON leads(total_lead_score DESC);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to_id);
CREATE INDEX idx_leads_target_property ON leads(target_property_id);

CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_vip_tier ON guests(vip_tier);

CREATE INDEX idx_rooms_property_status ON rooms(property_id, status);

CREATE INDEX idx_enquiries_property_status ON booking_enquiries(property_id, status);
CREATE INDEX idx_enquiries_dates ON booking_enquiries(check_in_date, check_out_date);

CREATE INDEX idx_reservations_property_status ON reservations(property_id, reservation_status);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_guest ON reservations(guest_id);

CREATE INDEX idx_opportunities_pipeline ON opportunities(pipeline_status);
CREATE INDEX idx_opportunities_assigned ON opportunities(assigned_to_id);

CREATE INDEX idx_activities_lead ON activities(lead_id);
CREATE INDEX idx_activities_guest ON activities(guest_id);

CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to_id, status);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX idx_audit_logs_user_entity ON audit_logs(user_id, entity_type);

-- ==========================================
-- 17. AUTOMATED UPDATED_AT TRIGGER
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_enquiries_updated_at BEFORE UPDATE ON booking_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
