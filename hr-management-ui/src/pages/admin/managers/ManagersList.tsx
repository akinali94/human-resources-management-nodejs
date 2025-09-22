import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api";

type Row = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  section?: string;
  title?: string;
};

export default function ManagersList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        // Prefer the admin users endpoint; else fallback
        const data = await apiFetch<any>("/api/admin/users?role=Manager");
        const mapped: Row[] = (data.items ?? data ?? []).map((u: any) => ({
          id: u.id,
          fullName: u.fullName ?? [u.firstName, u.lastName].filter(Boolean).join(" "),
          email: u.email,
          phone: u.telephoneNumber ?? u.phone ?? "",
          section: u.section ?? "",
          title: u.title ?? "",
        }));
        if (!ignore) setRows(mapped);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load managers.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

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

  if (loading) return <div className="container"><div className="skeleton">Loading…</div></div>;
  if (err) return <div className="container"><div className="error">{err}</div></div>;

  return (
    <div className="container">
      <div className="toolbar">
        <h2>Managers</h2>
        <div className="toolbar-right">
          <input
            className="search"
            placeholder="Search name, email, section, title…"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <a className="btn-primary" href="/admin/managers/new">New Manager</a>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No managers found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Full name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Section</th>
              <th>Title</th>
              <th />
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
                <td className="row-actions">
                  <a href={`/admin/managers/${r.id}`} className="btn-secondary">View</a>
                  <a href={`/admin/managers/${r.id}/edit`} className="btn-secondary">Edit</a>
                  {/* Delete button can open a confirm dialog → call DELETE */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
