import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import SearchInput from "../../../shared/SearchInput";
import EmptyState from "../../../shared/EmptyState";
import StatusBadge from "../../../shared/StatusBadge";

export type CompanyApi = {
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
  foundationYear: string;
  contractStartDate: string;
  contractEndDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CompaniesListResponse = { items: CompanyApi[] } | CompanyApi[];

type CompanyRow = {
  id: string;
  name: string;
  email: string;
  employeeNumber: number;
  title: string | null;
  isActive: boolean;
  foundationYear?: number | null; // ekranda yıl göstermek istersen
};

export default function CompaniesList() {
  const nav = useNavigate();
  const [rows, setRows] = useState<CompanyRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);


  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await apiFetch<CompaniesListResponse>("/api/companies");
        const list: CompanyApi[] = Array.isArray(data) ? data : Array.isArray((data as any)?.items) ? (data as any).items : [];
        const mapped: CompanyRow[] = list.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          employeeNumber: c.employeeNumber,
          title: c.title || null,
          isActive: typeof c.isActive === "boolean" ? c.isActive : true,
          foundationYear: c.foundationYear ? new Date(c.foundationYear).getFullYear() : null,
        }));
        if (!ignore) setRows(mapped);
      } catch (e: any) {
        if (e?.message?.includes("401")) nav("/login", { replace: true });
        else if (e?.message?.includes("403")) setErr("You don’t have permission to view companie.");
        else setErr("Failed to load companies.");
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
      r.name.toLowerCase().includes(k) ||
      (r.email ?? "").toLowerCase().includes(k) ||
      (r.title ?? "").toLowerCase().includes(k) ||
      (r.title ?? "").toLowerCase().includes(k)
    );
  }, [rows, q]);

  if (loading) return <div className="content"><div className="card">Loading…</div></div>;
  if (err) return <div className="content"><div className="card error">{err}</div></div>;

  return (
    <div className="content">
      <div className="toolbar">
        <h2>Companies</h2>
        <div className="toolbar-right">
          <SearchInput placeholder="Search name, email, section, title…" value={q} onChange={setQ} />
          <Link className="btn-primary" to="/admin/companies/new">New Company</Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Company found"
          description="Try a different search or create a new Company."
          action={<Link to="/companies/new" className="btn-primary">Create company</Link>}
        />
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Full name</th>
                <th>Email</th>
                <th>Employee No.</th>
                <th>Title</th>
                <th>Section</th>
                <th>Status</th>
                <th aria-label="actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.name || "—"}</td>
                  <td>{r.email || "—"}</td>
                  <td>{r.employeeNumber || "—"}</td>
                  <td>{r.title || "—"}</td>
                  <td>{r.foundationYear || "—"}</td>
                  <td><StatusBadge active={r.isActive !== false} /></td>
                  <td className="row-actions">
                    <Link to={`${r.id}`} className="btn-secondary">View</Link>
                    <Link to={`${r.id}/edit`} className="btn-secondary">Edit</Link>
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
