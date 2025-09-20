import { z } from "zod";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(s => new Date(s));

export const CreateCompanyBody = z.object({
  name: z.string().min(2).max(100),
  title: z.string().max(100).nullish(),
  mersisNo: z.string().max(50).nullish(),
  taxNumber: z.string().max(50).nullish(),
  logo: z.string().url().nullish(),
  telephoneNumber: z.string().max(50).nullish(),
  address: z.string().max(300).nullish(),
  email: z.string().email().nullish(),
  employeeNumber: z.string().max(50).nullish(),
  foundationYear: dateStr.nullish(),
  contractStartDate: dateStr.nullish(),
  contractEndDate: dateStr.nullish(),
  isActive: z.boolean().optional(),
});
export type CreateCompanyBody = z.infer<typeof CreateCompanyBody>;

export const UpdateCompanyBody = CreateCompanyBody.partial().extend({
  name: z.string().min(2).max(100).optional(),
});
export type UpdateCompanyBody = z.infer<typeof UpdateCompanyBody>;
