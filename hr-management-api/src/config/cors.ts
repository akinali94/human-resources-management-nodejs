import type { CorsOptions } from "cors";
import { env } from "./env.js";

export function buildCorsOptions(): CorsOptions {
  return {
    origin: env.CORS_ORIGINS,   // array -> allowlist
    credentials: true,          // Cookie gönderimi için gerekli
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  };
}
