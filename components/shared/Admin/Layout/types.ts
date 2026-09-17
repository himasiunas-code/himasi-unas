import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}
