import { useEffect, useMemo, useState } from "react";

export type CompanyFormValues = {
  name: string;
  title: string;
  mersisNo: string;
  taxNumber: string;
  logo?: string;
  telephoneNumber: string;
  address: string; // TC / national id
  email: string;
  foundationYear?: string;        // YYYY-MM-DD
  contractStartDate?: string;  // YYYY-MM-DD
  contractEndDate?: string;
  isActive: boolean;
};

export type CompanyOption = { id: string; name: string; isActive?: boolean };

type Props = {
  initial?: Partial<CompanyFormValues>;
  submitLabel: string;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
};

export default function ManagerForm({ initial, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<CompanyFormValues>(() => ({
    name: "",
    title: "",
    mersisNo: "",
    taxNumber: "",
    logo: "",
    telephoneNumber: "",
    address: "",
    email: "",
    foundationYear: "",
    contractStartDate: "",
    contractEndDate: "",
    isActive: true,
  }));

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // field-level errors
  const [errors, setErrors] = useState<Record<string, string>>({});

 useEffect(() => {
    if (initial) {
      setValues((prev) => ({ ...prev, ...initial }));
    }
  }, [initial]);

  // update values helper
  function set<K extends keyof CompanyFormValues>(key: K, v: CompanyFormValues[K]) {
    setValues(prev => ({ ...prev, [key]: v }));
  }

  // basic client-side validation
  const validation = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!values.name?.trim()) errs.name = "Name is required.";
    if (!values.title?.trim())  errs.title  = "Title is required.";
    if (!values.email?.trim())     errs.email     = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Invalid email.";
    if (values.contractStartDate && values.contractEndDate && values.contractEndDate < values.contractStartDate) {
      errs.resignationDate = "Contract End Date must be after start date.";
    }
    if (!values.mersisNo?.trim()) errs.mersisNo = "Mersis No is required.";
    if (!values.taxNumber?.trim()) errs.taxNumber = "Tax Number is required.";
    if (!values.telephoneNumber?.trim()) errs.telephoneNumber = "Phone No is required.";
    if (!values.address?.trim()) errs.address = "Address is required.";
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
      <h2 className="form-title">Company</h2>
      {formError && <div className="error">{formError}</div>}

      {/* COMPANY INFO */}
      <section className="form-section">
        <h3>Company Info</h3>
        <div className="form-grid">
          <div className="field">
            <label>Name *</label>
            <input
              value={values.name}
              onChange={(e) => set("name", e.currentTarget.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label>Title *</label>
            <input
              value={values.title}
              onChange={(e) => set("title", e.currentTarget.value)}
              aria-invalid={!!errors.title}
            />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          <div className="field">
            <label>MERSIS No *</label>
            <input
              value={values.mersisNo}
              onChange={(e) => set("mersisNo", e.currentTarget.value)}
              aria-invalid={!!errors.mersisNo}
            />
            {errors.mersisNo && <div className="field-error">{errors.mersisNo}</div>}
          </div>

          <div className="field">
            <label>Tax Number *</label>
            <input
              value={values.taxNumber}
              onChange={(e) => set("taxNumber", e.currentTarget.value)}
              aria-invalid={!!errors.taxNumber}
            />
            {errors.taxNumber && <div className="field-error">{errors.taxNumber}</div>}
          </div>

          <div className="field">
            <label>Foundation Date</label>
            <input
              type="date"
              value={values.foundationYear ?? ""}
              onChange={(e) => set("foundationYear", e.currentTarget.value)}
            />
          </div>


          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => set("isActive", e.currentTarget.checked)}
              />
              Is Active
            </label>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="form-section">
        <h3>Contact</h3>
        <div className="form-grid">
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
            <label>Telephone Number *</label>
            <input
              value={values.telephoneNumber}
              onChange={(e) => set("telephoneNumber", e.currentTarget.value)}
              placeholder="+90 2xx xxx xx xx"
              autoComplete="tel"
              aria-invalid={!!errors.telephoneNumber}
            />
            {errors.telephoneNumber && (
              <div className="field-error">{errors.telephoneNumber}</div>
            )}
          </div>

          <div className="field col-2">
            <label>Address *</label>
            <textarea
              rows={3}
              value={values.address}
              onChange={(e) => set("address", e.currentTarget.value)}
              aria-invalid={!!errors.address}
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>
        </div>
      </section>

      {/* CONTRACT */}
      <section className="form-section">
        <h3>Contract</h3>
        <div className="form-grid">
          <div className="field">
            <label>Contract Start Date</label>
            <input
              type="date"
              value={values.contractStartDate ?? ""}
              onChange={(e) => set("contractStartDate", e.currentTarget.value)}
            />
          </div>

          <div className="field">
            <label>Contract End Date</label>
            <input
              type="date"
              value={values.contractEndDate ?? ""}
              onChange={(e) => set("contractEndDate", e.currentTarget.value)}
              aria-invalid={!!errors.contractEndDate}
            />
            {errors.contractEndDate && (
              <div className="field-error">{errors.contractEndDate}</div>
            )}
          </div>
        </div>
      </section>

      {/* MEDIA */}
      <section className="form-section">
        <h3>Media</h3>
        <div className="form-grid">
          <div className="field col-2">
            <label>Logo URL</label>
            <input
              value={values.logo ?? ""}
              onChange={(e) => set("logo", e.currentTarget.value)}
              placeholder="https://…"
            />
          </div>
        </div>
      </section>

      <div className="form-actions">
        <button
          className="btn-secondary"
          type="button"
          onClick={() => history.back()}
          disabled={submitting}
        >
          Cancel
        </button>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}