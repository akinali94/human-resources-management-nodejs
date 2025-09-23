import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import StatusBadge from "../../../shared/StatusBadge";
import { type CompanyApi } from "./CompaniesList";

type CompanyDetail = {
  id: string;
  name: string;
  title: string;
  mersisNo: string;
  taxNumber: string;
  logo: string;
  telephoneNumber: string;
  address: string;
  email: string;
  employeeNumber: number;
  foundationYear?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


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

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // delete dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const u = await apiFetch<CompanyApi>(`/api/companies/${id}`);

        if (ignore) return;

        setDetail({
            id: u.id,
            name: u.name,
            title: u.title,
            mersisNo: u.mersisNo,
            taxNumber: u.taxNumber,
            logo: u.logo,
            telephoneNumber: u.telephoneNumber,
            address: u.address,
            email: u.email,
            employeeNumber: toNumber(u. employeeNumber),
            foundationYear: isoToDateInput(u.foundationYear),
            contractStartDate: isoToDateInput(u.contractStartDate),
            contractEndDate: isoToDateInput(u.contractEndDate),
            isActive: u.isActive,
            createdAt: isoToDateInput(u.createdAt),
            updatedAt: isoToDateInput(u.updatedAt),

        });
      } catch (e: any) {
        if (e?.message?.includes("401")) nav("/login", { replace: true });
        else if (e?.message?.includes("403")) setErr("You don’t have permission to view this company.");
        else setErr("Failed to load company details.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [id, nav]);

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/companies/${id}`, { method: "DELETE" });
      nav("/companies", { replace: true });
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
            <h2>Detailed Company Information</h2>
            <Link to="/admin/companies" title="Back to list" className="icon-link">↩</Link>
          </div>
        </div>

        <div className="profile-grid">
          <Avatar src={detail.logo} alt={detail.name} />

          <div className="profile-name">
            <h3>{detail.name}</h3>
            <div className="muted">{detail.title || "—"}</div>
            <li><strong>Status:</strong> <StatusBadge active={detail.isActive !== false} /></li>
          </div>

          <div className="profile-col">
            <ul>
              <li></li><li></li><li></li><li></li>
              <li><strong>Name:</strong> {detail.name || "—"}</li>
              <li><strong>Title:</strong> {detail.title || "—"}</li>
              <li><strong>MersisNo:</strong> {detail.mersisNo || "—"}</li>
              <li><strong>Tax No:</strong> {detail.taxNumber || "—"}</li>

            </ul>
          </div>

          <div className="profile-col">
            <ul>
              <li><strong>Address:</strong> {detail.address || "—"}</li>
              <li><strong>Email:</strong> {detail.email || "—"}</li>
              <li><strong>Employee No:</strong> {detail.employeeNumber || "—"}</li>
            </ul>
          </div>

          <div className="profile-col">
            <ul>
              <li><strong>Foundation Year:</strong> {detail.foundationYear || "—"}</li>
              <li><strong>Contract Start Date:</strong> {detail.contractStartDate || "—"}</li>
              <li><strong>Contract End Date:</strong> {detail.contractEndDate || "—"}</li>
              
            </ul>
          </div>

          <div className="profile-col">
            <ul>
              <li><strong>Created At:</strong> {detail.createdAt || "—"}</li>
              <li><strong>Updated At:</strong> {detail.updatedAt || "—"}</li>              
            </ul>
          </div>
        </div>

        <hr />
        <div className="actions">
          <Link className="btn-secondary" to={`/companies/${detail.id}/edit`}>Update info</Link>
          <button className="btn-secondary danger" onClick={() => setConfirmOpen(true)}>Delete</button>
          <Link className="btn-secondary" to="/companies">Back to list</Link>
          <Link className="btn-primary" to="/admin">Home</Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Company?"
        description={`Are you sure you want to delete ${detail.name}?`}
        confirmText={deleting ? "Deleting…" : "Yes, delete"}
        cancelText="Cancel"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
