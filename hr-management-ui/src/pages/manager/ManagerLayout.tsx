import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch, type Me } from "../../lib/api";
import UserMenu from "../../components/manager/UserMenu";
import "./manager-shell.css";

export default function ManagerLayout() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const m = await apiFetch<Me>("/api/auth/me");
        if (m.role !== "Manager") {
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
              👤<span>Profile</span>
            </NavLink>
          </div>

          {/* Employee */}
          <div className="nav-group">
            <div className="nav-title">Employee</div>
            <NavLink to="/manager/employees/new" className="nav-link">
              ➕<span>Add Employee</span>
            </NavLink>
            <NavLink to="/manager/employees" className="nav-link">
              📋<span>Employee List</span>
            </NavLink>
          </div>

          {/* Leaves */}
          <div className="nav-group">
            <div className="nav-title">Leave</div>
            <NavLink to="/manager/leaverequests" className="nav-link">
              🌊<span>Leave Requests List</span>
            </NavLink>
          </div>
          {/* Expenditures */}
          <div className="nav-group">
            <div className="nav-title">Expenditures</div>
            <NavLink to="/manager/expenditures" className="nav-link">
              💶<span>Expenditure Requests List</span>
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