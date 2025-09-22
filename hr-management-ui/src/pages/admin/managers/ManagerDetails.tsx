import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import StatusBadge from "../../../shared/StatusBadge";

type Detail = {
  id: string;
  imageUrl?: string | null;
  fullName: string;
  title?: string | null;

  // Personal
  birthDate?: string | null;     // ISO or YYYY-MM-DD
  birthPlace?: string | null;
  nationalId?: string | null;    // TC / national id

  // Company
  isActive?: boolean;
  companyName?: string | null;
  section?: string | null;
  hiredDate?: string | null;

  // Contact
  telephoneNumber?: string | null;
  email?: string | null;
  address?: string | null;
};

function formatDateDDMMYYYY(value?: string | null) {
  if (!value) return "—";
  // Accepts ISO or YYYY-MM-DD
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  if (src) return <img src={src} alt={alt} className="avatar-lg" />;
  const initials =
    alt?.split(" ").map(s => s[0]?.toUpperCase()).slice(0, 2).join("") || "U";
  return <div className="avatar-lg fallback">{initials}</div>;
}

export default function ManagerDetails() {
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
        const u = await apiFetch<any>(`/api/admin/managers/${id}`);

        if (ignore) return;
        const fullName =
          u.fullName ??
          [u.firstName, u.secondName, u.lastName, u.secondSurname]
            .filter(Boolean)
            .join(" ");

        setDetail({
          id: u.id,
          imageUrl: u.imageUrl ?? null,
          fullName: fullName || "—",
          title: u.title ?? null,

          birthDate: u.birthDate ?? u.birthdate ?? null,
          birthPlace: u.birthPlace ?? u.placeOfBirth ?? null,
          nationalId: u.tc ?? u.nationalId ?? null,

          isActive: typeof u.isActive === "boolean" ? u.isActive : true,
          companyName: u.companyName ?? u.company?.name ?? null,
          section: u.section ?? null,
          hiredDate: u.hiredDate ?? u.startedDate ?? null,

          telephoneNumber: u.telephoneNumber ?? u.phone ?? null,
          email: u.email ?? null,
          address: u.address ?? null,
        });
      } catch (e: any) {
        if (e?.message?.includes("401")) nav("/login", { replace: true });
        else if (e?.message?.includes("403")) setErr("You don’t have permission to view this manager.");
        else setErr("Failed to load manager details.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [id, nav]);

  const hiredDate = useMemo(() => formatDateDDMMYYYY(detail?.hiredDate), [detail]);
  const birthDate = useMemo(() => formatDateDDMMYYYY(detail?.birthDate), [detail]);

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      // If your backend uses /api/admin/users/:id instead, change the URL here:
      await apiFetch(`/api/admin/managers/${id}`, { method: "DELETE" });
      nav("/admin/managers", { replace: true });
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
            <Link to="/admin/managers" title="Back to list" className="icon-link">↩</Link>
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
              <li><strong>Birth date:</strong> {birthDate}</li>
              <li><strong>Place of birth:</strong> {detail.birthPlace || "—"}</li>
              <li><strong>Nationality:</strong> World</li>
              <li><strong>Identity:</strong> {detail.nationalId || "—"}</li>
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
              <li><strong>Mobile:</strong> {detail.telephoneNumber || "—"}</li>
              <li><strong>Email:</strong> {detail.email || "—"}</li>
              <li><strong>Address:</strong> {detail.address || "—"}</li>
            </ul>
          </div>
        </div>

        <hr />
        <div className="actions">
          <Link className="btn-secondary" to={`/admin/managers/${detail.id}/edit`}>Update info</Link>
          <button className="btn-secondary danger" onClick={() => setConfirmOpen(true)}>Delete</button>
          <Link className="btn-secondary" to="/admin/managers">Back to list</Link>
          <Link className="btn-primary" to="/admin">Home</Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete manager?"
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
