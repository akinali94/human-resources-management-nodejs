import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, type Me } from "../../lib/api";

type Profile = {
  imageUrl: string | null;
  firstName: string;
  lastName: string;
  role: string;
  title?: string | null;
  section?: string | null;
  phoneNo?: string | null;
  email: string;
  address?: string | null;
  companyName: string;
};

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  if (src) return <img src={src} alt={alt} className="avatar" />;
  const initials = alt
    .split(" ")
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return <div className="avatar fallback">{initials}</div>;
}

export default function AdminLanding() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const me = await apiFetch<Me>("/api/auth/me");
        if (me.role !== "Admin") {
          nav("/", { replace: true });
          return;
        }
        const p = await apiFetch<Me>("/api/admin/me");
        if (!ignore) {
          setProfile({
            imageUrl: p.imageUrl ?? null,
            firstName: p.firstName ?? "",
            lastName: p.lastName ?? "",
            title: p.title ?? null,
            section: p.section ?? null,
            phoneNo: p.phoneNo ?? null,
            email: p.email ?? "",
            address: p.address ?? null,
            companyName: p.companyName,
            role: p.role,
          });
        }
      } catch (e: any) {
        if (e?.message?.includes("401")) nav("/login", { replace: true });
        else if (e?.message?.includes("403")) setErr("Not Authorized");
        else setErr("An error occured");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [nav]);

  if (loading) {
    return <div className="container"><div className="skeleton">Loading...</div></div>;
  }
  if (err) {
    return <div className="container"><div className="error">{err}</div></div>;
  }
  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="container">
      <div className="banner" />
      <div className="card">
        <div className="card-header">
          <h2>Profile Information</h2>
        </div>

        <div className="profile-row">
          <Avatar src={profile.imageUrl ?? undefined} alt={fullName || "Profile"} />

          <div className="profile-name">
            <h3>{fullName || "—"}</h3>
            <div className="muted">{profile.title || "—"}</div>
          </div>

          <div className="profile-col">
            <ul>
              <li><strong>Full Name:</strong> {fullName || "—"}</li>
              <li><strong>Title:</strong> {profile.title || "—"}</li>
              <li><strong>Section:</strong> {profile.section || "—"}</li>
            </ul>
          </div>

          <div className="profile-col">
            <ul>
              <li><strong>Mobile:</strong> {profile.phoneNo || "—"}</li>
              <li><strong>Email:</strong> {profile.email || "—"}</li>
              <li><strong>Address:</strong> {profile.address || "—"}</li>
            </ul>
          </div>
        </div>

        <hr />
        <div className="actions">
          <Link className="btn-secondary" to={`/admin/profile/`}>
            Update Info
          </Link>
          <Link className="btn-secondary" to={`/admin/profile/edit`}>
            Detailed Info
          </Link>
        </div>
      </div>
    </div>
  );
}