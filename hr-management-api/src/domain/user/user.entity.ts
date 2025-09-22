export const Roles = {
  Employee: "Employee",
  Manager: "Manager",
  Admin: "Admin",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  companyId?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput { //For infra layer
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
  companyId: string;
  isActive?: boolean;
  managerId?: string | null;
}

export type UpdateUserInput = {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  isActive?: boolean;
  managerId?: string | null;
  companyId?: string;
};



export function fullName(u: Pick<User, "firstName" | "lastName">): string {
  return `${u.firstName} ${u.lastName}`.trim().replace(/\s+/g, " ");
}

export function normalizeName(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}


export function hasManagerRights(u: Pick<User, "role">): boolean {
  return u.role === Roles.Manager || u.role === Roles.Admin;
}
export function hasAdminRights(u: Pick<User, "role">): boolean {
  return u.role === Roles.Admin;
}
