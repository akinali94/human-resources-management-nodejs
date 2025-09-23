import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManagerForm, { type ManagerFormValues } from "./ManagerForm";
import { apiFetch } from "../../../lib/api";

export default function ManagerEdit() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initial, setInitial] = useState<Partial<ManagerFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const u = await apiFetch<any>(`/api/admin/managers/${id}`);
        if (ignore) return;
        setInitial({
          email: u.email ?? "",
          firstName: u.firstName ?? "",
          secondName: u.secondName ?? "",
          lastName: u.lastName ?? u.surname ?? "",
          secondLastName: u.secondLastName ?? "",
          phoneNo: u.phoneNo ?? "",
          address: u.address ?? "",
          birthPlace: u.birthPlace ?? "",
          identityNumber: u.identityNumber ?? u.tc ?? "",
          companyId: u.companyId ?? "",
          role: (u.role === "Manager" || u.role === "Employee") ? u.role : "",
          title: u.title ?? "",
          section: u.section ?? "",
          hiredDate: u.hiredDate ? new Date(u.hiredDate).toISOString().slice(0,10) : "",
          resignationDate: u.resignationDate ? new Date(u.resignationDate).toISOString().slice(0,10) : "",
          salary: typeof u.salary === "number" ? u.salary : (u.salary ? Number(u.salary) : undefined),
          imageUrl: u.imageUrl ?? null,
          backgroundImageUrl: u.backgroundImageUrl ?? null,
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


  async function handleSubmit(values: ManagerFormValues) {
    await apiFetch(`/api/admin/managers/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        firstName: values.firstName,
        secondName: values.secondName,
        lastName: values.lastName,
        secondLastName: values.secondLastName,
        email: values.email,
        phoneNo: values.phoneNo,
        role: values.role,
        address: values.address,
        birthPlace: values.birthPlace,
        identityNumber: values.identityNumber,
        companyId: values.companyId,
        title: values.title,
        section: values.section,
        hiredDate: dateToISO(values.hiredDate),
        resignationDate: dateToISO(values.resignationDate),
        salary: values.salary,
        imageUrl: values.imageUrl,
        backgroundImageUrl: values.backgroundImageUrl,
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
      <ManagerForm initial={initial} submitLabel="Save changes" onSubmit={handleSubmit} />
    </div>
  );
}
