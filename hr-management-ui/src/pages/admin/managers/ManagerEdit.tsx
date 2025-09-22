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
        const u = await apiFetch<any>(`/api/admin/users/${id}`);
        if (ignore) return;
        setInitial({
          firstName: u.firstName ?? "",
          secondName: u.secondName ?? "",
          lastName: u.lastName ?? u.surname ?? "",
          secondSurname: u.secondSurname ?? "",
          email: u.email ?? "",
          phone: u.telephoneNumber ?? u.phone ?? "",
          address: u.address ?? "",
          birthPlace: u.birthPlace ?? "",
          birthDate: u.birthDate ?? "",
          gender: u.gender ?? "",
          nationalId: u.nationalId ?? u.tc ?? "",
          companyId: u.companyId ?? "",
          title: u.title ?? "",
          section: u.section ?? "",
          hiredDate: u.hiredDate ?? u.startedDate ?? "",
          resignationDate: u.resignationDate ?? "",
          salary: typeof u.salary === "number" ? u.salary : (u.salary ? Number(u.salary) : undefined),
          imageUrl: u.imageUrl ?? null,
          backgroundImageUrl: u.backgroundImageUrl ?? null,
          isActive: typeof u.isActive === "boolean" ? u.isActive : true,
          // no invite in edit
        });
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load manager.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  async function handleSubmit(values: ManagerFormValues) {
    await apiFetch(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        firstName: values.firstName,
        secondName: values.secondName,
        lastName: values.lastName,
        secondSurname: values.secondSurname,
        email: values.email,
        phone: values.phone,
        address: values.address,
        birthPlace: values.birthPlace,
        birthDate: values.birthDate,
        gender: values.gender,
        nationalId: values.nationalId,
        companyId: values.companyId,
        title: values.title,
        section: values.section,
        hiredDate: values.hiredDate,
        resignationDate: values.resignationDate,
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
