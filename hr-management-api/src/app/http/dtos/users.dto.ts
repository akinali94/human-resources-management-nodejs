import { z } from "zod";
import type { User } from "../../../domain/user/user.entity.js";

const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((s) => new Date(s));

const money = z.coerce.number().finite().nonnegative(); // allow "123.45" from forms

export const CreateUserBody = z.object({
  email: z.string().email(),
  password: z.string().min(8), // controller should hash → passwordHash
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["Employee", "Manager", "Admin"]),
  companyId: z.string().uuid(),

  
  title: z.string().min(1),
  section: z.string().min(1),
  phoneNo: z.string().min(3),
  address: z.string().min(3),

  isActive: z.boolean().optional(),

  // optional/nullable
  secondName: z.string().nullish(),
  secondLastName: z.string().nullish(),
  birthPlace: z.string().nullish(),
  identityNumber: z.string().nullish(),
  hiredDate: dateStr.nullish(),
  resignationDate: dateStr.nullish(),

  
  salary: money.optional(),
  advanceAmount: money.optional(),
  maxAdvanceAmount: money.optional(),

  managerId: z.string().uuid().nullish(),
});
export type CreateUserBody = z.infer<typeof CreateUserBody>;

export const UpdateUserBody = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["Employee", "Manager", "Admin"]).optional(),
  isActive: z.boolean().optional(),

  title: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
  phoneNo: z.string().min(3).optional(),
  address: z.string().min(3).optional(),

  secondName: z.string().nullish(),
  secondLastName: z.string().nullish(),
  birthPlace: z.string().nullish(),
  identityNumber: z.string().nullish(),
  hiredDate: dateStr.nullish(),
  resignationDate: dateStr.nullish(),

  salary: money.optional(),
  advanceAmount: money.optional(),
  maxAdvanceAmount: money.optional(),

  managerId: z.string().uuid().nullish(),
  companyId: z.string().uuid().optional(),
});
export type UpdateUserBody = z.infer<typeof UpdateUserBody>;


export function UserPublicDto(u: User) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    secondName: u.secondName ?? null,
    secondLastName: u.secondLastName ?? null,
    birthPlace: u.birthPlace ?? null,
    identityNumber: u.identityNumber ?? null,
    hiredDate: u.hiredDate ?? null,
    resignationDate: u.resignationDate ?? null,
    title: u.title,
    section: u.section,
    phoneNo: u.phoneNo,
    address: u.address,
    isActive: u.isActive,
    companyId: u.companyId,
    companyName: "",
    salary: u.salary,
    advanceAmount: u.advanceAmount,
    maxAdvanceAmount: u.maxAdvanceAmount,
    imageUrl: u.imageUrl,
    backgroundImageUrl: u.backgroundImageUrl,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export function UserLimitedInfoDto(u: User) {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    secondName: u.secondName ?? null,
    secondLastName: u.secondLastName ?? null,
    birthPlace: u.birthPlace ?? null,
    identityNumber: u.identityNumber ?? null,
    title: u.title,
    section: u.section,
    phoneNo: u.phoneNo,
    address: u.address,
    companyId: u.companyId,
    companyName: "",
    imageUrl: u.imageUrl,
  };
}