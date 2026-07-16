// ── Legacy role picker ────────────────────────────────────────────
// Kept as a quick-demo fallback at /login/roles. The primary auth
// flow is now Sign Up → /signup and Log In → /login.

import { useNavigate, Link } from "react-router-dom";
import { useAuth, type Role } from "../../context/AuthContext";

const OPTIONS: { role: Role; title: string; desc: string; to: string }[] = [
  { role: "donor", title: "I'm a donor", desc: "Give food or cash, track your matches, earn badges.", to: "/donor" },
  { role: "recipient", title: "I need help", desc: "Request assistance, browse available donations, confirm pickups.", to: "/recipient" },
  { role: "admin", title: "City admin", desc: "Oversee matching, records, verification, and reports.", to: "/admin" },
];

export default function RoleSelect() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  function choose(role: Role, to: string) {
    setRole(role);
    navigate(to);
  }

  return (
    <div className="role-picker">
      <div className="role-picker-inner">
        <img src={`${import.meta.env.BASE_URL}assets/foosha-logo.png`} alt="Foosha" style={{ height: 36, marginBottom: 32 }} />
        <div className="eyebrow">Quick demo</div>
        <h1 style={{ marginBottom: 28 }}>Pick a role to explore</h1>

        {OPTIONS.map((opt) => (
          <button className="role-option" key={opt.role} onClick={() => choose(opt.role, opt.to)}>
            <div>
              <h3>{opt.title}</h3>
              <p>{opt.desc}</p>
            </div>
            <span style={{ color: "var(--paper-dim)" }}>→</span>
          </button>
        ))}

        <p className="helper" style={{ marginTop: 20 }}>
          This is a quick demo — no account needed. For the full experience,{" "}
          <Link to="/signup" style={{ color: "var(--kalamansi)", fontWeight: 600, textDecoration: "none" }}>
            create an account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
