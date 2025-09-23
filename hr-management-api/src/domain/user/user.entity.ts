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
  secondName?: string | null;
  lastName: string;
  secondLastName?: string | null;
  role: Role;
  birthPlace?: string | null;
  identityNumber?: string | null;
  hiredDate?: Date | null;
  resignationDate?: Date | null;
  title: string;
  section: string;
  phoneNo: string;
  address: string;
  isActive: boolean;
  companyId: string;
  salary: number;
  advanceAmount: number;
  maxAdvanceAmount: number;

  imageUrl?: string | null;
  backgroundImageUrl?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: Role;
  companyId: string;
  title: string;
  section: string;
  phoneNo: string;
  address: string;
  
  salary: number;
  advanceAmount: number;
  maxAdvanceAmount: number;

  // optional/nullable extras
  secondName?: string | null;
  secondLastName?: string | null;
  birthPlace?: string | null;
  identityNumber?: string | null;
  hiredDate?: Date | null;
  resignationDate?: Date | null;
  imageUrl?: string | null;
  backgroundImageUrl?: string | null;

  isActive?: boolean;


  // relations
  managerId?: string | null;
};

export type UpdateUserInput = {
  // scalar edits
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  isActive?: boolean;

  secondName?: string | null;
  secondLastName?: string | null;
  birthPlace?: string | null;
  identityNumber?: string | null;   
  hiredDate?: Date | null;
  resignationDate?: Date | null;
  title?: string | null;
  section?: string | null;
  phoneNo?: string | null;
  address?: string | null;

  // money (not nullable in DB; set numbers only)
  salary?: number;
  advanceAmount?: number;
  maxAdvanceAmount?: number;

  // relations
  managerId?: string | null;  // null → remove manager
  companyId?: string;         // required column; allow change, not null
};


export function fullName(u: Pick<User, "firstName" | "secondName" | "lastName" | "secondLastName">): string {
  return [u.firstName, u.secondName, u.lastName, u.secondLastName]
    .filter(Boolean) // removes undefined or empty strings
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");
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
