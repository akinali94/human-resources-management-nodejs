import { z } from "zod";

const DateNullableOpt = z.union([z.coerce.date(), z.date()]).nullable().optional();
const UrlNullableOpt = z.string().url().nullable().optional();


export const CreateManagerBodySchema = z.object({
  firstName: z.string().min(2).max(100),
  secondName: z.string().trim().nullable().optional(),
  lastName: z.string().min(2).max(100),
  secondLastName: z.string().trim().nullable().optional(),

  email: z.string().email(),

  birthPlace: z.string().trim().nullable().optional(),
  birthDate: DateNullableOpt,

  nationalId: z.string().trim().nullable().optional(),

  companyId: z.string().uuid(),
  title: z.string().min(2).max(100),
  section: z.string().min(2).max(100),

  hiredDate: DateNullableOpt,
  resignationDate: DateNullableOpt,

  salary: z.coerce.number().min(0),

  phoneNo: z.string().min(1),
  address: z.string().min(1),

  profileImageUrl: UrlNullableOpt,
  backgroundImageUrl: UrlNullableOpt,
  
  isActive: z.boolean().optional(),
})
.strict();
export type CreateManagerBody = z.infer<typeof CreateManagerBodySchema>;


export const UpdateManagerBody = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  managerId: z.string().uuid().nullish(), // null → kaldır
  companyId: z.string().uuid().optional(),
  role: z.literal("Manager").optional(),  // manager rolünü koru (opsiyonel)
});
export type UpdateManagerBody = z.infer<typeof UpdateManagerBody>;