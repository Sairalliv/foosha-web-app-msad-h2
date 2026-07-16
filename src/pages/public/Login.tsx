import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // The user is now set in context — figure out where to go
    // We need to read the role from the stored users since login just resolved
    const users = JSON.parse(localStorage.getItem("foosha:auth_users") || "[]");
    const matched = users.find(
      (u: { email: string }) => u.email.toLowerCase() === email.toLowerCase().trim(),
    );
    const destination = matched?.role === "recipient"
      ? "/recipient"
      : matched?.role === "admin"
        ? "/admin"
        : "/donor";

    navigate(destination);
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
            Welcome back to <em>Foosha</em>
          </h2>
          <p className="sub">
            Mandaue's food assistance network — where every donation is
            matched, tracked, and confirmed.
          </p>

          {/* Decorative stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
            <div className="stat-card" style={{ background: "var(--bg-panel)", textAlign: "center", padding: 18 }}>
              <div className="num" style={{ fontSize: 22 }}>208</div>
              <div className="lbl">Families helped</div>
            </div>
            <div className="stat-card" style={{ background: "var(--bg-panel)", textAlign: "center", padding: 18 }}>
              <div className="num" style={{ fontSize: 22 }}>96%</div>
              <div className="lbl">Confirmed in 24h</div>
            </div>
            <div className="stat-card" style={{ background: "var(--bg-panel)", textAlign: "center", padding: 18 }}>
              <div className="num" style={{ fontSize: 22 }}>₱312K</div>
              <div className="lbl">Total donated</div>
            </div>
            <div className="stat-card" style={{ background: "var(--bg-panel)", textAlign: "center", padding: 18 }}>
              <div className="num" style={{ fontSize: 22 }}>4</div>
              <div className="lbl">Barangays active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="eyebrow">Welcome back</div>
          <h1>Log in to Foosha</h1>
          <p className="sub">Enter your email and password to continue.</p>

          {error && <div className="auth-error" key={error}>{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldErrors.email ? "error" : ""}
                autoComplete="email"
                autoFocus
              />
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            </div>

            {/* Password */}
            <div className="auth-field" style={{ animationDelay: ".06s" }}>
              <label htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldErrors.password ? "error" : ""}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? "◡" : "◉"}
                </button>
              </div>
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>

            <button
              type="submit"
              className={`auth-submit${loading ? " loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <Link to="/login/roles" className="btn btn-ghost btn-block" style={{ marginBottom: 8 }}>
            Quick demo — pick a role
          </Link>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
