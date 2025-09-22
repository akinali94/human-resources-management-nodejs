// src/lib/api.ts
type ErrorEnvelope = {
  error?: {
    code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "VALIDATION_ERROR"
      | "CONFLICT"
      | "NOT_FOUND"
      | "INTERNAL";
    message?: string;
  };
};

const BASE = import.meta.env.VITE_API_BASE_URL ?? ""; 


export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${BASE}${path}`;

  const resp = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!resp.ok) {
    let msg = `HTTP ${resp.status}`;
    try {
      const data: ErrorEnvelope = await resp.json();
      if (data?.error?.message) msg = data.error.message;
    } catch {}
    throw new Error(msg);
  }
  // status 204 has no body
  if (resp.status === 204) return {} as T;

  return (await resp.json()) as T;
}

export type Me = {
  id: string;
  email: string;
  role: "Admin" | "Manager" | "Employee";
  firstName: string;
  lastName: string;
};
