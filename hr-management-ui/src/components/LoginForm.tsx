import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, type Me } from "../lib/api";

export default function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // 1) Login
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe: remember }),
      });

      // 2) Me
      const me = await apiFetch<Me>("/api/auth/me");

      // 3) Role-based redirect
      if (me.role === "Admin") nav("/admin", { replace: true });
      else if (me.role === "Manager") nav("/manager/leaves", { replace: true });
      else nav("/leaves", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Giriş başarısız.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-card" id="login">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="you@example.com"
            required
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        <label className="remember">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.currentTarget.checked)}
          />
          Remember Me
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Trying to log in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
