import { z } from "zod"

export const UpdateMeBody = z
    .object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
    }).refine((v) => v.firstName || v.lastName, {
        message: "At least one of this field should updated: firstName or lastName",
        path: ["firstName"],
    }
);

export type UpdateMeBody = z.infer<typeof UpdateMeBody>;