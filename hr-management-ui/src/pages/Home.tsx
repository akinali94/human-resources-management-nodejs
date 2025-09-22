import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { apiFetch, type Me } from "../lib/api";

export default function Home() {
  const nav = useNavigate();

  // Navigate with Role
  useEffect(() => {
    let ignore = false;
    async function check() {
      try {
        const me = await apiFetch<Me>("/api/auth/me");
        if (ignore) return;
        if (me.role === "Admin") nav("/admin", { replace: true });
        else if (me.role === "Manager") nav("/manager/leaves", { replace: true });
        else nav("/leaves", { replace: true });
      } catch {
        // if 401, stay same page
      }
    }
    check();
    return () => { ignore = true; };
  }, [nav]);

  function scrollToLogin() {
    const el = document.getElementById("login");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="home">
      {/* HERO */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="hero-mask" />
        <div className="hero-content">
          <h1>BugBusters HR</h1>
          <p>Employee Management System has never been more engaging and enjoyable.</p>
          <button className="btn-light" onClick={scrollToLogin}>
            Login
          </button>
        </div>
      </section>

      {/* LOGIN SECTION */}
      <section className="login-section">
        <LoginForm />
      </section>
    </div>
  );
}
