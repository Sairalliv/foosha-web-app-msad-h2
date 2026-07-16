import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  { value: "donor" as const, icon: "🤝", name: "Donor", desc: "Give food or cash" },
  { value: "recipient" as const, icon: "🏠", name: "Recipient", desc: "Request assistance" },
  { value: "admin" as const, icon: "🏛", name: "City Admin", desc: "Oversee the network" },
];

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [role, setRole] = useState<"donor" | "recipient" | "admin">("donor");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (password !== confirmPw) errs.confirmPw = "Passwords don't match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const result = await signUp(email, password, name, role);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Redirect to the role's dashboard
    navigate(role === "donor" ? "/donor" : role === "recipient" ? "/recipient" : "/admin");
  }

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <img
            className="logo-mark"
            src={`${import.meta.env.BASE_URL}assets/foosha-logo.png`}
            alt="Foosha"
          />
          <h2>
            Every extra plate
            <br />
            finds <em>the right</em> table.
          </h2>
          <p className="sub">
            Join Mandaue City's food assistance network — give, receive, and
            make sure every handoff is verified with a one-time code.
          </p>
          <div className="ticket" style={{ transform: "rotate(-2deg)" }}>
            <div className="ticket-top">
              <div>
                <div className="ticket-label">Match ticket</div>
                <div className="ticket-id">#MC-0417</div>
              </div>
              <div className="stamp">PICKUP READY</div>
            </div>
            <div className="ticket-row"><span>Donor</span><span>Basak Sari-Sari Store</span></div>
            <div className="ticket-row"><span>Recipient</span><span>P. Ramos household</span></div>
            <div className="ticket-row"><span>Contents</span><span>Rice, canned goods, milk</span></div>
            <div className="ticket-code">7Q3K&nbsp;9XM2</div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <img
            className="logo-mark"
            src={`${import.meta.env.BASE_URL}assets/foosha-logo.png`}
            alt="Foosha"
            style={{ display: "none" }}
          />
          <div className="eyebrow">Join the network</div>
          <h1>Create your account</h1>
          <p className="sub">Start giving or receiving food assistance in Mandaue City.</p>

          {error && <div className="auth-error" key={error}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Role selector */}
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--paper-dim)" }}>
              I'm joining as
            </label>
            <div className="role-select-grid">
              {ROLES.map((r) => (
                <div
                  key={r.value}
                  className={`role-select-card${role === r.value ? " selected" : ""}`}
                  onClick={() => setRole(r.value)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setRole(r.value)}
                >
                  <div className="check-mark">✓</div>
                  <div className="role-icon">{r.icon}</div>
                  <div className="role-name">{r.name}</div>
                  <div className="role-desc">{r.desc}</div>
                </div>
              ))}
            </div>

            {/* Name */}
            <div className="auth-field" style={{ animationDelay: ".05s" }}>
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Juan Dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldErrors.name ? "error" : ""}
                autoComplete="name"
              />
              {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
            </div>

            {/* Email */}
            <div className="auth-field" style={{ animationDelay: ".1s" }}>
              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldErrors.email ? "error" : ""}
                autoComplete="email"
              />
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            </div>

            {/* Password */}
            <div className="auth-field" style={{ animationDelay: ".15s" }}>
              <label htmlFor="signup-password">Password</label>
              <div className="password-wrap">
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldErrors.password ? "error" : ""}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPw(!showPw)} aria-label="Toggle password visibility">
                  {showPw ? "◡" : "◉"}
                </button>
              </div>
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>

            {/* Confirm password */}
            <div className="auth-field" style={{ animationDelay: ".2s" }}>
              <label htmlFor="signup-confirm">Confirm password</label>
              <input
                id="signup-confirm"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className={fieldErrors.confirmPw ? "error" : ""}
                autoComplete="new-password"
              />
              {fieldErrors.confirmPw && <div className="field-error">{fieldErrors.confirmPw}</div>}
            </div>

            <button
              type="submit"
              className={`auth-submit${loading ? " loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
