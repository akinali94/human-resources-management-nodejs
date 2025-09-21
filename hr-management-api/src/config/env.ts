import { z } from "zod";


const EnvSchema = z.object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(16, "Minimum 16 characters for JWT_SECRET"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().regex(/^\d+$/).default("3000"),
    ENFORCE_EXPENDITURE_RANGE: z
        .union([z.string(), z.boolean()])
        .optional()
        .transform((v) => {
        if (typeof v === "boolean") return v;
        if (typeof v === "string") return v.toLowerCase() === "true";
        return false; // default
        }),
    CORS_ORIGINS: z.string().optional().transform((s) =>
        (s ?? "http://localhost:5173,http://localhost:3001")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
    ),
});


const parsed = EnvSchema.parse(process.env);

export const env = {
  DATABASE_URL: parsed.DATABASE_URL,
  JWT_SECRET: parsed.JWT_SECRET,
  NODE_ENV: parsed.NODE_ENV,
  PORT: parsed.PORT,
  ENFORCE_EXPENDITURE_RANGE: parsed.ENFORCE_EXPENDITURE_RANGE as boolean,
  CORS_ORIGINS: parsed.CORS_ORIGINS as string[],
}