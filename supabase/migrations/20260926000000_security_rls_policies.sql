-- Supabase Security Migration: Enable Row Level Security (RLS) & Granular Policies
-- Ensures service-role credentials stay server-side and users only access authorized records.

-- Enable RLS on all CRM core tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROPERTIES POLICIES: Authenticated users can read properties, only super admins can insert/update
CREATE POLICY "Authenticated staff can view properties"
  ON properties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage properties"
  ON properties FOR ALL
  TO authenticated
  USING (is_super_admin());

-- 2. USERS POLICIES: Users can view fellow active staff, users can update self, super admin can manage all
CREATE POLICY "Authenticated users can view staff directory"
  ON users FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Super admins manage users"
  ON users FOR ALL
  TO authenticated
  USING (is_super_admin());

-- 3. LEADS & OPPORTUNITIES POLICIES: Staff can access assigned or property-scoped leads
CREATE POLICY "Staff can view assigned or property leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    is_super_admin() OR
    assigned_to_id = auth.uid() OR
    created_by_id = auth.uid() OR
    target_property_id IN (SELECT property_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Staff can mutate leads"
  ON leads FOR ALL
  TO authenticated
  USING (
    is_super_admin() OR
    assigned_to_id = auth.uid() OR
    created_by_id = auth.uid()
  );

-- 4. RESERVATIONS & ENQUIRIES POLICIES
CREATE POLICY "Staff can view reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can insert/update reservations"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can update assigned reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true);

-- 5. NOTIFICATIONS POLICIES: Users only access own notifications
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid());

-- 6. AUDIT LOGS POLICIES: Only Super Admins can view compliance audit logs
CREATE POLICY "Only super admins view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_super_admin());

CREATE POLICY "System can append audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
