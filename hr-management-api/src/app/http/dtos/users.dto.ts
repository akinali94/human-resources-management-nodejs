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

/*
export const UserPublicDto = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  secondLastName: z.string().nullable(),
  role: z.enum(["Employee","Manager","Admin"]),
  birthPlace: z.string().nullable(),
  identityNumber: z.string().nullable(),
  hiredDate: z.date().nullable(),
  resignationDate: z.date().nullable(),
  title: z.string(),
  section: z.string(),
  phoneNo: z.string(),
  address: z.string(),
  isActive: z.boolean(),
  companyId: z.string().uuid(),
  salary: z.number(),
  advanceAmount: z.number(),
  maxAdvanceAmount: z.number(),
  imageUrl: z.string().url().nullable(),
  backgroundImageUrl: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserPublic = z.infer<typeof UserPublicDto>;

// tek noktadan çevirici
export function toUserPublic(u: any): UserPublic {
  // repo zaten Decimal→number yaptı; burada sadece şekli garantiliyoruz
  return UserPublicDto.parse(u);
}
  */