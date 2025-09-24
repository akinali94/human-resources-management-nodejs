import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import StatusBadge from "../../../shared/StatusBadge";

export type EmployeeApiResponse = {
  id: string;                                      // uuid
  email: string;
  firstName: string;
  lastName: string;
  role: "Manager" | "Employee" | string;          
  secondName?: string | null;
  secondLastName?: string | null;
  birthPlace?: string | null;
  identityNumber?: string | null;
  hiredDate?: string | null;                        // ISO datetime
  resignationDate?: string | null;                  // ISO datetime
  title: string;
  section: string;
  phoneNo: string;
  address: string;
  isActive: boolean;
  companyId: string;
  companyName: string;                               
  salary: string | number;                         
  advanceAmount: string;                           
  maxAdvanceAmount: string;                        
  imageUrl?: string | null;
  backgroundImageUrl?: string | null;
  createdAt: string;                               // ISO
  updatedAt: string;                               // ISO
};


export type Detail = {
  id: string;

  // Personal
  fullName: string;
  firstName: string;
  secondName?: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  birthPlace?: string;
  identityNumber?: string;

  // Company
  companyName: string;
  title: string;
  section: string;
  role: "Manager" | "Employee" | "";
  hiredDate?: string;                  // YYYY-MM-DD
  resignationDate?: string;            // YYYY-MM-DD
  salary: number;
  isActive: boolean;
  advanceAmount: string;
  maxAdvanceAmount: string;

  // Contact
  phoneNo: string;
  address: string;

  // Media
  imageUrl?: string | null;
  backgroundImageUrl?: string | null;

  createdAt: string;                   // ISO olarak tutmak genelde daha iyi
  updatedAt: string;                   // ISO
};
function isoToDateInput(value?: string | null): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function toNumber(n: string | number): number {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : 0;
}

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  if (src) return <img src={src} alt={alt} className="avatar-lg" />;
  const initials =
    alt?.split(" ").map(s => s[0]?.toUpperCase()).slice(0, 2).join("") || "U";
  return <div className="avatar-lg fallback">{initials}</div>;
}

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // delete dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const u = await apiFetch<EmployeeApiResponse>(`/api/manager/employees/${id}`);

        if (ignore) return;
        const fullName = [u.firstName, u.secondName, u.lastName, u.secondLastName]
            .filter(Boolean)
            .join(" ");

        setDetail({
            id: u.id,
            fullName: fullName,
            firstName: u.firstName,
            secondName: u.secondName ?? undefined,
            lastName: u.lastName,
            secondLastName: u.secondLastName ?? undefined,
            email: u.email,
            birthPlace: u.birthPlace ?? undefined,
            identityNumber: u.identityNumber ?? undefined,

            companyName: u.companyName,
            title: u.title,
            section: u.section,
            role: u.role === "Employee" ? u.role : "",

            hiredDate: isoToDateInput(u.hiredDate),
            resignationDate: isoToDateInput(u.resignationDate),

            salary: toNumber(u.salary),
            isActive: u.isActive,
            advanceAmount: u.advanceAmount,
            maxAdvanceAmount: u.maxAdvanceAmount,

            phoneNo: u.phoneNo,
            address: u.address,

            imageUrl: u.imageUrl ?? null,
            backgroundImageUrl: u.backgroundImageUrl ?? null,

            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
        });
      } catch (e: any) {
        if (e?.message?.includes("401")) nav("/login", { replace: true });
        else if (e?.message?.includes("403")) setErr("You don’t have permission to view this employee.");
        else setErr("Failed to load employee details.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [id, nav]);

  const hiredDate = useMemo(() => isoToDateInput(detail?.hiredDate), [detail]);

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/manager/employees/${id}`, { method: "DELETE" });
      nav("/manager/employees", { replace: true });
    } catch (e: any) {
      alert(e?.message || "Delete failed.");
      setDeleting(false);
    }
  }

  if (loading) return <div className="content"><div className="card">Loading…</div></div>;
  if (err) return <div className="content"><div className="card error">{err}</div></div>;
  if (!detail) return null;

  return (
    <div className="content">
      <div className="dash-banner" />
      <div className="card">
        <div className="card-header">
          <div className="card-header-row">
            <h2>Detailed Manager Information</h2>
            <Link to="/manager/employees" title="Back to list" className="icon-link">↩</Link>
          </div>
        </div>

        <div className="profile-grid">
          <Avatar src={detail.imageUrl} alt={detail.fullName} />

          <div className="profile-name">
            <h3>{detail.fullName}</h3>
            <div className="muted">{detail.title || "—"}</div>
          </div>

          {/* Column 1 — Personal */}
          <div className="profile-col">
            <ul>
              <li><strong>Full name:</strong> {detail.fullName || "—"}</li>
              <li><strong>Place of birth:</strong> {detail.birthPlace || "—"}</li>
              <li><strong>Nationality:</strong> World</li>
              <li><strong>Identity:</strong> {detail.identityNumber || "—"}</li>
            </ul>
          </div>

          {/* Column 2 — Company */}
          <div className="profile-col">
            <ul>
              <li><strong>Status:</strong> <StatusBadge active={detail.isActive !== false} /></li>
              <li><strong>Company:</strong> {detail.companyName || "—"}</li>
              <li><strong>Title:</strong> {detail.title || "—"}</li>
              <li><strong>Section:</strong> {detail.section || "—"}</li>
              <li><strong>Hired date:</strong> {hiredDate}</li>
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div className="profile-col">
            <ul>
              <li><strong>Mobile:</strong> {detail.phoneNo || "—"}</li>
              <li><strong>Email:</strong> {detail.email || "—"}</li>
              <li><strong>Address:</strong> {detail.address || "—"}</li>
            </ul>
          </div>
        </div>

        <hr />
        <div className="actions">
          <Link className="btn-secondary" to={`/manager/employees/${detail.id}/edit`}>Update info</Link>
          <button className="btn-secondary danger" onClick={() => setConfirmOpen(true)}>Delete</button>
          <Link className="btn-secondary" to="/manager/employees">Back to list</Link>
          <Link className="btn-primary" to="/manager">Home</Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete employee?"
        description={`Are you sure you want to delete ${detail.fullName}?`}
        confirmText={deleting ? "Deleting…" : "Yes, delete"}
        cancelText="Cancel"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
