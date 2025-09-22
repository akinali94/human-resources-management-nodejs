import { z } from "zod";

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
