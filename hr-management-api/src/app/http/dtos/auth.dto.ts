import { z } from "zod";


export const LoginBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginBody = z.infer<typeof LoginBody>;