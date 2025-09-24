import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch, type Me } from "../../lib/api";

type Props = { me: Me };

export default function UserMenu({ me }: Props) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click or Escape
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  async function handleLogout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      navigate("/login", { replace: true });
    }
  }

  const fullName = `${me.firstName} ${me.lastName}`.trim() || me.email;

  return (
    <div className="user-menu" ref={ref}>
      <button
        className="user-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* In the future: load avatar from /api/employees/me */}
        <div className="avatar-small" aria-hidden>{fullName[0]?.toUpperCase()}</div>
        <span className="user-name">{fullName}</span>
        <span className="chev" aria-hidden>▾</span>
      </button>

      {open && (
        <div className="menu" role="menu">
          <Link to="/admin" role="menuitem" className="item" onClick={() => setOpen(false)}>Profile</Link>

          <div className="submenu">
            <div className="item label" aria-disabled>Employee</div>
            <Link to="/manager/employees/new" role="menuitem" className="item" onClick={() => setOpen(false)}>Add</Link>
            <Link to="/manager/employees" role="menuitem" className="item" onClick={() => setOpen(false)}>List</Link>
          </div>

          <div className="submenu">
            <div className="item label" aria-disabled>Leaves</div>
            <Link to="/manager/leaves" role="menuitem" className="item" onClick={() => setOpen(false)}>List</Link>
          </div>

          <div className="submenu">
            <div className="item label" aria-disabled>Expenditures</div>
            <Link to="/manager/expenditures" role="menuitem" className="item" onClick={() => setOpen(false)}>List</Link>
          </div>

          <button className="item danger" role="menuitem" onClick={() => { setOpen(false); setShowConfirm(true); }}>
            Logout
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>Sign out</h3>
            </div>
            <div className="modal-body">
              Once you log out, you’ll need to sign in again to continue.
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleLogout}>Confirm logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
