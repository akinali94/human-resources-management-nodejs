import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import SearchInput from "../../../shared/SearchInput";
import EmptyState from "../../../shared/EmptyState";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import StatusBadge from "../../../shared/StatusBadge";

type Row = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  section?: string | null;
  title?: string | null;
  isActive?: boolean;
};

export default function ManagersList() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await apiFetch<any>("/api/admin/managers");
        const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        const mapped: Row[] = list.map((u: any) => ({
          id: u.id,
          fullName: u.fullName ?? [u.firstName, u.lastName].filter(Boolean).join(" "),
          email: u.email,
          phone: u.telephoneNumber ?? u.phone ?? null,
          section: u.section ?? null,
          title: u.title ?? null,
          isActive: typeof u.isActive === "boolean" ? u.isActive : true,
        }));
        if (!ignore) setRows(mapped);
      } catch (e: any) {
        if (e?.message?.includes("401")) nav("/login", { replace: true });
        else if (e?.message?.includes("403")) setErr("You don’t have permission to view managers.");
        else setErr("Failed to load managers.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [nav]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return rows;
    return rows.filter(r =>
      r.fullName.toLowerCase().includes(k) ||
      (r.email ?? "").toLowerCase().includes(k) ||
      (r.section ?? "").toLowerCase().includes(k) ||
      (r.title ?? "").toLowerCase().includes(k)
    );
  }, [rows, q]);

  async function onConfirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/users/${deleteId}`, { method: "DELETE" });
      setRows(prev => prev.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch (e: any) {
      // Typical: 409 if there are dependencies (team members, etc.)
      alert(e?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="content"><div className="card">Loading…</div></div>;
  if (err) return <div className="content"><div className="card error">{err}</div></div>;

  return (
    <div className="content">
      <div className="toolbar">
        <h2>Managers</h2>
        <div className="toolbar-right">
          <SearchInput placeholder="Search name, email, section, title…" value={q} onChange={setQ} />
          <Link className="btn-primary" to="/admin/managers/new">New Manager</Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No managers found"
          description="Try a different search or create a new manager."
          action={<Link to="/admin/managers/new" className="btn-primary">Create manager</Link>}
        />
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Section</th>
                <th>Title</th>
                <th>Status</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.fullName || "—"}</td>
                  <td>{r.email || "—"}</td>
                  <td>{r.phone || "—"}</td>
                  <td>{r.section || "—"}</td>
                  <td>{r.title || "—"}</td>
                  <td><StatusBadge active={r.isActive !== false} /></td>
                  <td className="row-actions">
                    <Link to={`/admin/managers/${r.id}`} className="btn-secondary">View</Link>
                    <Link to={`/admin/managers/${r.id}/edit`} className="btn-secondary">Edit</Link>
                    <button className="btn-secondary danger" onClick={() => setDeleteId(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete manager?"
        description="This action cannot be undone."
        confirmText={deleting ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={onConfirmDelete}
        danger
      />
    </div>
  );
}
