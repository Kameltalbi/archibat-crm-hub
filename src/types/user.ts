
import { AppRole } from "@/lib/supabase";

export type Role = AppRole;

export type UserStatus = "active" | "pending" | "disabled";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface Permission {
  roleId: string;
  moduleId: string;
  canAccess: boolean;
}
