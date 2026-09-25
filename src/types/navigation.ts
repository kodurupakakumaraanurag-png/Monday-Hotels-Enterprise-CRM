import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  description?: string;
}

export interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}
