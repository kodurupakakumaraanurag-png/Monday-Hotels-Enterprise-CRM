export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enum Definitions
export type BookingEnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "QUOTATION"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "LOST";

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | "NO_SHOW";

export type PaymentStatus =
  | "PENDING"
  | "PARTIAL"
  | "PAID"
  | "REFUNDED";

export type PipelineStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "QUOTATION"
  | "NEGOTIATION"
  | "CONFIRMED"
  | "COMPLETED"
  | "LOST";

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type VIPTier = "STANDARD" | "SILVER" | "GOLD" | "PLATINUM" | "BLACK_DIAMOND";
export type RoomType = "STANDARD_KING" | "DELUXE_DOUBLE" | "EXECUTIVE_SUITE" | "PRESIDENTIAL_SUITE" | "PENTHOUSE";
export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "CLEANING" | "MAINTENANCE";
export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "SITE_VISIT" | "TASK_COMPLETED" | "STATUS_CHANGE" | "NOTE";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "URGENT" | "SYSTEM";
export type UserRole = "super_admin" | "property_manager" | "sales_manager" | "front_desk" | "staff";

// 1. User
export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  property_id: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 2. Property
export interface PropertyRow {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  total_rooms: number;
  star_rating: number;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
}

// 3. Company
export interface CompanyRow {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  corporate_code: string | null;
  contract_discount_pct: number;
  account_manager_id: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

// 4. Contact
export interface ContactRow {
  id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  is_primary_contact: boolean;
  created_at: string;
  updated_at: string;
}

// 5. Guest
export interface GuestRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  vip_tier: VIPTier;
  total_stays_count: number;
  total_spent_amount: number;
  preferences: Json;
  special_notes: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

// 6. Lead
export interface LeadRow {
  id: string;
  company_name: string;
  industry_domain: string | null;
  location: string | null;
  website_url: string | null;
  contact_poc_name: string;
  designation: string | null;
  phone: string | null;
  email: string | null;
  business_overview: string | null;
  problem_friction: string | null;
  project_requirement: string | null;
  placement_opportunity: string | null;
  priority_level: PriorityLevel;
  pipeline_status: PipelineStatus;
  next_action: string | null;
  date_added: string;
  lead_source: string | null;
  contact_method: string | null;
  
  // Lead scoring matrix
  digital_presence_score: number;
  hiring_activity_score: number;
  tech_stack_fit_score: number;
  funding_revenue_score: number;
  project_urgency_score: number;
  budget_clarity_score: number;
  total_lead_score: number;

  project_allocation_status: string;
  assigned_to_id: string | null;
  target_property_id: string | null;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

// 7. Room
export interface RoomRow {
  id: string;
  property_id: string;
  room_number: string;
  room_type: RoomType;
  floor: number | null;
  base_rate_per_night: number;
  status: RoomStatus;
  max_occupancy: number;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
}

// 8. Booking Enquiry
export interface BookingEnquiryRow {
  id: string;
  enquiry_code: string;
  property_id: string;
  lead_id: string | null;
  guest_id: string | null;
  guest_name: string;
  email: string;
  phone: string | null;
  check_in_date: string;
  check_out_date: string;
  rooms_requested: number;
  guests_count: number;
  estimated_budget: number | null;
  special_requests: string | null;
  status: BookingEnquiryStatus;
  assigned_staff_id: string | null;
  created_at: string;
  updated_at: string;
}

// 9. Opportunity
export interface OpportunityRow {
  id: string;
  lead_id: string | null;
  company_id: string | null;
  property_id: string | null;
  name: string;
  deal_value: number;
  probability_pct: number;
  pipeline_status: PipelineStatus;
  expected_close_date: string | null;
  assigned_to_id: string | null;
  contract_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// 10. Reservation
export interface ReservationRow {
  id: string;
  reservation_code: string;
  property_id: string;
  room_id: string | null;
  guest_id: string;
  booking_enquiry_id: string | null;
  company_id: string | null;
  check_in_date: string;
  check_out_date: string;
  adults_count: number;
  children_count: number;
  total_amount: number;
  deposit_amount: number;
  reservation_status: ReservationStatus;
  payment_status: PaymentStatus;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

// 11. Activity
export interface ActivityRow {
  id: string;
  title: string;
  activity_type: ActivityType;
  description: string | null;
  performed_by_id: string | null;
  lead_id: string | null;
  opportunity_id: string | null;
  guest_id: string | null;
  company_id: string | null;
  reservation_id: string | null;
  activity_timestamp: string;
  created_at: string;
}

// 12. Task
export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  assigned_to_id: string;
  created_by_id: string | null;
  priority: PriorityLevel;
  status: TaskStatus;
  due_date: string | null;
  lead_id: string | null;
  reservation_id: string | null;
  guest_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// 13. Notification
export interface NotificationRow {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// 14. Audit Log
export interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Json | null;
  new_values: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
