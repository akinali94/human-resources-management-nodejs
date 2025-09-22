import { z } from "zod";

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
