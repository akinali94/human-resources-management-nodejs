import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompanyForm, { type CompanyFormValues } from "./CompanyForm";
import { apiFetch } from "../../../lib/api";

export default function CompanyEdit() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initial, setInitial] = useState<Partial<CompanyFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const u = await apiFetch<any>(`/api/companies/${id}`);
        if (ignore) return;
        setInitial({
          email: u.email ?? "",
          name: u.name ?? "",
          title: u.title ?? "",
          mersisNo: u.mersisNo ?? "",
          taxNumber: u.taxNumber ?? "",
          telephoneNumber: u.telephoneNumber ?? "",
          address: u.address ?? "",
          foundationYear: u.foundationYear ? new Date(u.foundationYear).toISOString().slice(0,10) : "",
          contractStartDate: u.contractStartDate ? new Date(u.contractStartDate).toISOString().slice(0,10) : "",
          contractEndDate: u.contractEndDate ? new Date(u.contractEndDate).toISOString().slice(0,10) : "",
          logo: u.logo ?? null,
          isActive: typeof u.isActive === "boolean" ? u.isActive : true,
        });
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load manager.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  function dateToISO(dateStr?: string | null) {
    if (!dateStr) return undefined;                 // boşsa hiç gönderme
    const d = new Date(dateStr);                    // "YYYY-MM-DD" kabul edilir
    if (isNaN(d.getTime())) return undefined;
    return d.toISOString();                         // RFC3339
  }


  async function handleSubmit(values: CompanyFormValues) {
    await apiFetch(`/api/managers/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        email: values.email,
        name: values.name,
        title: values.title,
        mersisNo: values.mersisNo,
        taxNumber: values.taxNumber,
        telephoneNumber: values.telephoneNumber,
        address: values.address,
        foundationYear: dateToISO(values.foundationYear),
        contractStartDate: dateToISO(values.contractStartDate),
        contractEndDate: dateToISO(values.contractEndDate),
        logo: values.logo,
        isActive: values.isActive,
      }),
    });

    nav(`/admin/managers`, { replace: true });
  }

  if (loading) return <div className="content"><div className="card">Loading…</div></div>;
  if (err) return <div className="content"><div className="card error">{err}</div></div>;
  if (!initial) return null;

  return (
    <div className="content">
      <CompanyForm initial={initial} submitLabel="Save changes" onSubmit={handleSubmit} />
    </div>
  );
}
