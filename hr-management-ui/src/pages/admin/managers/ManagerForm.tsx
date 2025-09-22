import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

export type ManagerFormValues = {
  // Personal
  firstName: string;
  secondName?: string;
  lastName: string;
  secondSurname?: string;
  email: string;
  birthPlace?: string;
  birthDate?: string; // YYYY-MM-DD
  gender?: "Man" | "Woman";
  nationalId?: string; // TC / national id

  // Company
  companyId?: string;
  title?: string;
  section?: string;
  hiredDate?: string;        // YYYY-MM-DD
  resignationDate?: string;  // YYYY-MM-DD
  salary?: number;
  isActive?: boolean;

  // Contact
  phone?: string;
  address?: string;

  // Media (placeholder for future upload)
  imageUrl?: string | null;
  backgroundImageUrl?: string | null;

  // Invite (create-only)
  invite?: boolean;
};

export type CompanyOption = { id: string; name: string; isActive?: boolean };

type Props = {
  initial?: Partial<ManagerFormValues>;
  submitLabel: string;
  onSubmit: (values: ManagerFormValues) => Promise<void>;
};

export default function ManagerForm({ initial, submitLabel, onSubmit }: Props) {
  // local state
  const [values, setValues] = useState<ManagerFormValues>(() => ({
    firstName: "",
    lastName: "",
    email: "",
    isActive: true,
    invite: true,
    ...initial,
  }));

  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // field-level errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await apiFetch<any[]>("/api/companies");
        if (ignore) return;
        const opts: CompanyOption[] = (Array.isArray(list) ? list : []).map((c: any) => ({
          id: String(c.id),
          name: String(c.name ?? c.companyName ?? "Company"),
          isActive: !!c.isActive,
        }));
        setCompanies(opts);
      } catch (e: any) {
        setFormError(e?.message ?? "Failed to load companies.");
      } finally {
        setLoadingCompanies(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // update values helper
  function set<K extends keyof ManagerFormValues>(key: K, v: ManagerFormValues[K]) {
    setValues(prev => ({ ...prev, [key]: v }));
  }

  // basic client-side validation (keep minimal; backend is source of truth)
  const validation = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!values.firstName?.trim()) errs.firstName = "First name is required.";
    if (!values.lastName?.trim())  errs.lastName  = "Last name is required.";
    if (!values.email?.trim())     errs.email     = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Invalid email.";
    if (values.salary != null && Number.isNaN(Number(values.salary))) errs.salary = "Salary must be a number.";
    if (values.resignationDate && values.hiredDate && values.resignationDate < values.hiredDate) {
      errs.resignationDate = "Resignation date must be after hired date.";
    }
    if (!values.companyId || values.companyId === "") {
      errs.companyId = "Company is required.";
    }
    return errs;
  }, [values]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const errs = validation;
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        // normalize types
        salary: values.salary != null && values.salary !== ("" as unknown as number)
          ? Number(values.salary)
          : undefined,
      });
    } catch (e: any) {
      const msg = e?.message ?? "Submit failed.";
      // heuristic: if backend sends email conflict
      if (/mail|email/i.test(msg)) setErrors(prev => ({ ...prev, email: msg }));
      else setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h2 className="form-title">Manager</h2>
      {formError && <div className="error">{formError}</div>}

      {/* PERSONAL */}
      <section className="form-section">
        <h3>Personal</h3>
        <div className="form-grid">
          <div className="field">
            <label>First name *</label>
            <input
              value={values.firstName}
              onChange={(e) => set("firstName", e.currentTarget.value)}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>

          <div className="field">
            <label>Second name</label>
            <input
              value={values.secondName ?? ""}
              onChange={(e) => set("secondName", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Last name *</label>
            <input
              value={values.lastName}
              onChange={(e) => set("lastName", e.currentTarget.value)}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>

          <div className="field">
            <label>Second surname</label>
            <input
              value={values.secondSurname ?? ""}
              onChange={(e) => set("secondSurname", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Email *</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.currentTarget.value)}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label>Birth place</label>
            <input
              value={values.birthPlace ?? ""}
              onChange={(e) => set("birthPlace", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Birth date</label>
            <input
              type="date"
              value={values.birthDate ?? ""}
              onChange={(e) => set("birthDate", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Gender</label>
            <select
              value={values.gender ?? ""}
              onChange={(e) => set("gender", e.currentTarget.value as ManagerFormValues["gender"])}
            >
              <option value="">—</option>
              <option value="Man">Man</option>
              <option value="Woman">Woman</option>
            </select>
          </div>

          <div className="field">
            <label>National ID</label>
            <input
              value={values.nationalId ?? ""}
              onChange={(e) => set("nationalId", e.currentTarget.value)}
            />
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section className="form-section">
        <h3>Company</h3>
        <div className="form-grid">
          <div className="field">
            <label>Company *</label>
            <select
              value={values.companyId ?? ""}
              onChange={(e) => set("companyId", e.currentTarget.value)}
              aria-invalid={!!errors.companyId}
            >
              <option value="" disabled>{loadingCompanies ? "Loading…" : "Select company"}</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.isActive === false ? " (inactive)" : ""}
                </option>
              ))}
            </select>
            {errors.companyId && <div className="field-error">{errors.companyId}</div>}
          </div>

          <div className="field">
            <label>Title</label>
            <input
              value={values.title ?? ""}
              onChange={(e) => set("title", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Section</label>
            <input
              value={values.section ?? ""}
              onChange={(e) => set("section", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Hired date</label>
            <input
              type="date"
              value={values.hiredDate ?? ""}
              onChange={(e) => set("hiredDate", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Resignation date</label>
            <input
              type="date"
              value={values.resignationDate ?? ""}
              onChange={(e) => set("resignationDate", e.currentTarget.value)}
            />
            {errors.resignationDate && <div className="field-error">{errors.resignationDate}</div>}
          </div>

          <div className="field">
            <label>Salary</label>
            <input
              type="number"
              inputMode="decimal"
              value={values.salary ?? ("" as unknown as number)}
              onChange={(e) => set("salary", (e.currentTarget.value as unknown) as number)}
              aria-invalid={!!errors.salary}
            />
            {errors.salary && <div className="field-error">{errors.salary}</div>}
          </div>

          <div className="field checkbox">
            <label>
              <input
                type="checkbox"
                checked={values.isActive ?? true}
                onChange={(e) => set("isActive", e.currentTarget.checked)}
              />
              Active
            </label>
          </div>

          {"invite" in values && (
            <div className="field checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={values.invite ?? false}
                  onChange={(e) => set("invite", e.currentTarget.checked)}
                />
                Send invitation email
              </label>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="form-section">
        <h3>Contact</h3>
        <div className="form-grid">
          <div className="field">
            <label>Phone</label>
            <input
              value={values.phone ?? ""}
              onChange={(e) => set("phone", e.currentTarget.value)}
              placeholder="+90 5xx xxx xx xx"
              autoComplete="tel"
            />
          </div>

          <div className="field col-2">
            <label>Address</label>
            <textarea
              rows={3}
              value={values.address ?? ""}
              onChange={(e) => set("address", e.currentTarget.value)}
            />
          </div>
        </div>
      </section>

      {/* MEDIA (placeholder) */}
      <section className="form-section">
        <h3>Media</h3>
        <div className="form-grid">
          <div className="field">
            <label>Profile image URL</label>
            <input
              value={values.imageUrl ?? ""}
              onChange={(e) => set("imageUrl", e.currentTarget.value)}
              placeholder="https://…"
            />
          </div>
          <div className="field">
            <label>Background image URL</label>
            <input
              value={values.backgroundImageUrl ?? ""}
              onChange={(e) => set("backgroundImageUrl", e.currentTarget.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </section>

      <div className="form-actions">
        <button className="btn-secondary" type="button" onClick={() => history.back()} disabled={submitting}>
          Cancel
        </button>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
