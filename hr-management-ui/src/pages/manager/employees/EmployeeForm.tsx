import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";


export type EmployeeFormValues = {
  // Personal
  firstName: string;
  secondName?: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  birthPlace?: string;
  identityNumber?: string; // TC / national id

  // Company
  companyId: string;
  companyName: string;
  title: string;
  section: string;
  role: string;
  hiredDate?: string;        // YYYY-MM-DD
  resignationDate?: string;  // YYYY-MM-DD
  salary: number;
  isActive: boolean;

  // Contact
  phoneNo: string;
  address: string;

  // Media
  imageUrl?: string | null;
  backgroundImageUrl?: string | null;

};


type Props = {
  initial?: Partial<EmployeeFormValues>;
  submitLabel: string;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
};

export default function EmployeeForm({ initial, submitLabel, onSubmit }: Props) {

  // local state
  const [values, setValues] = useState<EmployeeFormValues>(() => ({
    firstName: "",
    lastName: "",
    email: "",
    companyId: "",
    companyName: "",
    title: "",
    section: "",
    role: "Employee",
    salary: 0,
    phoneNo: "",
    address: "",
    isActive: true,
    invite: true,
    ...initial,
  }));

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingMe(true);
        const me = await apiFetch<any>("/api/manager/me");

        const compName = me.companyName;

        if (!cancelled) {
          setValues(prev => ({
            ...prev,
            companyName: compName,
          }));
        }
      } catch (e: any) {
        if (!cancelled) setFormError(e?.message ?? "can not get company Info ");
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // field-level errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // update values helper
  function set<K extends keyof EmployeeFormValues>(key: K, v: EmployeeFormValues[K]) {
    setValues(prev => ({ ...prev, [key]: v }));
  }

  // basic client-side validation
  const validation = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!values.firstName?.trim()) errs.firstName = "First name is required.";
    if (!values.lastName?.trim())  errs.lastName  = "Last name is required.";
    if (!values.email?.trim())     errs.email     = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Invalid email.";
    if (values.salary != null && Number.isNaN(Number(values.salary))) errs.salary = "Salary must be a number.";
    if (values.salary == null) errs.salary = "Salary is required";
    if (values.resignationDate && values.hiredDate && values.resignationDate < values.hiredDate) {
      errs.resignationDate = "Resignation date must be after hired date.";
    }
    if (!values.title?.trim()) errs.title = "Title is required.";
    if (!values.section?.trim()) errs.section = "Section is required.";
    if (!values.phoneNo?.trim()) errs.phoneNo = "Phone Number is required.";
    if (!values.address?.trim()) errs.address = "Address is required.";
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
      <h2 className="form-title">Employee</h2>
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
              value={values.secondLastName ?? ""}
              onChange={(e) => set("secondLastName", e.currentTarget.value)}
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
            <label>National ID</label>
            <input
              value={values.identityNumber ?? ""}
              onChange={(e) => set("identityNumber", e.currentTarget.value)}
            />
          </div>
        </div>
      </section>

      {/* COMPANY */}
      <section className="form-section">
        <h3>Company</h3>
        <div className="form-grid">
          <div className="field">
            <label>Company</label>
            <input value={values.companyName} readOnly/>
            {errors.companyName && <div className="field-error">{errors.companyName}</div>}
          </div>

          <div className="field">
            <label>Role</label>
            <input value={values.role} readOnly/>
            {errors.role && <div className="field-error">{errors.role}</div>}
          </div>



          <div className="field">
            <label>Title *</label>
            <input
              value={values.title ?? ""}
              onChange={(e) => set("title", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Section *</label>
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
            <label>Salary *</label>
              <input
                type="number"
                inputMode="decimal"
                value={Number.isFinite(values.salary) ? values.salary : ("" as unknown as number)}
                onChange={(e) => set("salary", e.currentTarget.value === "" ? (NaN as unknown as number) : Number(e.currentTarget.value))}
                aria-invalid={!!errors.salary}
              />
            {errors.salary && <div className="field-error">{errors.salary}</div>}
          </div>

          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => set("isActive", e.currentTarget.checked)}
              />
              Is Active *
            </label>
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section className="form-section">
        <h3>Contact</h3>
        <div className="form-grid">
          <div className="field">
            <label>Phone *</label>
            <input
              value={values.phoneNo ?? ""}
              onChange={(e) => set("phoneNo", e.currentTarget.value)}
              placeholder="+90 5xx xxx xx xx"
              autoComplete="tel"
            />
          </div>

          <div className="field col-2">
            <label>Address *</label>
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
