export type UserRole =
  | "ADMIN"
  | "SALES_MANAGER"
  | "SALES_EXECUTIVE"
  | "OPERATIONS_MANAGER"
  | "VIEWER";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  propertyId?: string;
  propertyName?: string;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
}

export interface DemoAccount {
  role: UserRole;
  title: string;
  email: string;
  name: string;
  description: string;
  badgeColor: string;
  permittedRoutes: string[];
}
