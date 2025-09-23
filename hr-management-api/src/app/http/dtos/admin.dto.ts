import { z } from "zod";

const DateNullableOpt = z.union([z.coerce.date(), z.date()]).nullable().optional();
const UrlNullableOpt = z.string().url().nullable().optional();
const NullableStringOpt = z.preprocess(
  v => (v === "" ? null : v),
  z.string().trim().min(1).nullable().optional()
);


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



export const UpdateManagerBodySchema = z.object({
  //required
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  companyId: z.string().uuid(),
  title: z.string().min(2).max(100),
  section: z.string().min(2).max(100),
  phoneNo: z.string().min(1),
  address: z.string().min(1),
  isActive: z.boolean(),
  salary: z.coerce.number().min(0),

  role: z.string().min(1),

  //nullable
  secondName: NullableStringOpt,
  secondLastName: NullableStringOpt,
  birthPlace: NullableStringOpt,
  nationalId: NullableStringOpt,

  hiredDate: DateNullableOpt,
  resignationDate: DateNullableOpt,

  imageUrl: UrlNullableOpt,
  backgroundImageUrl: UrlNullableOpt,
});
export type UpdateManagerBody = z.infer<typeof UpdateManagerBodySchema>;