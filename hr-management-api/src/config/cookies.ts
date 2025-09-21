import type { CookieOptions } from "express";
import { env } from "./env.js";

/** Session cookie seçenekleri (cross-site dağıtım içindir). */
export function sessionCookieOptions(): CookieOptions {
  const sameSite =
    env.COOKIE_SAMESITE === "none" ? "none" :
    env.COOKIE_SAMESITE === "strict" ? "strict" : "lax";

  // If SameSite=None, browser is mandatory,  Secure=true (https)
  const secure = sameSite === "none" ? true : !!env.COOKIE_SECURE;

  const base: CookieOptions = {
    httpOnly: true,
    sameSite,         // "lax" | "strict" | "none"
    secure,           // prod’da https + proxy arkasında true
    path: "/",
  };

  //No domain for localhost
  if (env.COOKIE_DOMAIN && env.COOKIE_DOMAIN !== "localhost") {
    base.domain = env.COOKIE_DOMAIN; // ör: ".example.com"
  }

  return base;
}
