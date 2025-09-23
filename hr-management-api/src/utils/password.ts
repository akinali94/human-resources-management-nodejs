// utils/password.ts
import { randomInt } from "crypto";

const LOWER   = "abcdefghjkmnpqrstuvwxyz";   // i,l çıkarıldı
const UPPER   = "ABCDEFGHJKMNPQRSTUVWXYZ";   // I,O çıkarıldı
const DIGITS  = "23456789";                  // 0,1 çıkarıldı
const SYMBOLS = "!@#$%^&*()-_=+[]{}?";

export function generatePassword(length = 12): string {
  const sets = [LOWER, UPPER, DIGITS, SYMBOLS];
  if (length < sets.length) length = sets.length;

  const pick = (pool: string) => pool[randomInt(0, pool.length)];

  //guaranteed at least one character
  const required = sets.map(pick);

  // fill other characters
  const all = sets.join("");
  const remaining = Array.from({ length: length - required.length }, () => pick(all));

  // mix (Fisher–Yates)
  const out = [...required, ...remaining];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}
