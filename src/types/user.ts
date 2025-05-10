
export type Role = "admin" | "collaborateur" | "lecture_seule";

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
