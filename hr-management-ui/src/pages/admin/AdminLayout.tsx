import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch, type Me } from "../../lib/api";
import UserMenu from "../../components/admin/UserMenu";
import "./admin-shell.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const m = await apiFetch<Me>("/api/auth/me");
        if (m.role !== "Admin") {
          navigate("/", { replace: true });
          return;
        }
        if (!ignore) setMe(m);
      } catch {
        navigate("/login", { replace: true });
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [navigate]);

  if (loading) return null; // or a small loader

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="sidenav">
        <div className="brand" onClick={() => navigate("/admin")} role="button" tabIndex={0}>
          <img src="/logo.svg" alt="BugBustersHR" />
          <span>BugBustersHR</span>
        </div>

        <nav className="nav-groups" aria-label="Main navigation">
          {/* Account */}
          <div className="nav-group">
            <div className="nav-title">Account</div>
            <NavLink to="/admin" end className="nav-link">
              <i aria-hidden>👤</i><span>Profile</span>
            </NavLink>
          </div>

          {/* Manager */}
          <div className="nav-group">
            <div className="nav-title">Manager</div>
            <NavLink to="/admin/managers/new" className="nav-link">
              <i aria-hidden>➕</i><span>Add Manager</span>
            </NavLink>
            <NavLink to="/admin/managers" className="nav-link">
              <i aria-hidden>📋</i><span>Manager List</span>
            </NavLink>
          </div>

          {/* Company */}
          <div className="nav-group">
            <div className="nav-title">Company</div>
            <NavLink to="/admin/companies/new" className="nav-link">
              <i aria-hidden>🏗️</i><span>Add Company</span>
            </NavLink>
            <NavLink to="/admin/companies" className="nav-link">
              <i aria-hidden>🏢</i><span>Company List</span>
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* Main area */}
      <div className="main">
        <header className="topbar">
          <div />
          <UserMenu me={me!} />
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
