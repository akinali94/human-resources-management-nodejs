import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import SearchInput from "../../../shared/SearchInput";
import EmptyState from "../../../shared/EmptyState";
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

export default function EmployeesList() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);


  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await apiFetch<any>("/api/manager/employees");
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
        else if (e?.message?.includes("403")) setErr("You don’t have permission to view employees.");
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

  if (loading) return <div className="content"><div className="card">Loading…</div></div>;
  if (err) return <div className="content"><div className="card error">{err}</div></div>;

  return (
    <div className="content">
      <div className="toolbar">
        <h2>Employees</h2>
        <div className="toolbar-right">
          <SearchInput placeholder="Search name, email, section, title…" value={q} onChange={setQ} />
          <Link className="btn-primary" to="/manager/employees/new">New Employee</Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Employee found"
          description="Try a different search or create a new employee."
          action={<Link to="/manager/employees/new" className="btn-primary">Create Employee</Link>}
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
                    <Link to={`/manager/employees/${r.id}`} className="btn-secondary">View</Link>
                    <Link to={`/manager/employees/${r.id}/edit`} className="btn-secondary">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
