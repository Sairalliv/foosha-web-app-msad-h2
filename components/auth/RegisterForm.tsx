'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { registerAction } from '@/actions/auth-actions'
import { createClient } from '@/lib/supabase/client'
import { SubmitButton } from './SubmitButton'
import Link from 'next/link'
import Image from 'next/image'

const initialState = {
  error: '',
  success: '',
}

type RegistrationState = {
  error?: string
  success?: string
}

type Role = 'donor' | 'recipient' | 'admin'

const ROLES: { key: Role; name: string; desc: string; icon: string }[] = [
  { key: 'donor', name: 'Donor', desc: 'Give food or cash', icon: '🎁' },
  { key: 'recipient', name: 'Recipient', desc: 'Request assistance', icon: '🏠' },
]

export function RegisterForm() {
  const [role, setRole] = useState<Role>('donor')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmTouched, setConfirmTouched] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const passwordsMismatch = confirmTouched && confirmPassword.length > 0 && password !== confirmPassword

  const [state, formAction] = useActionState(async (prevState: RegistrationState, formData: FormData) => {
    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }
    formData.set('role', role)
    const res = await registerAction(formData)
    if (res?.error) {
      return { error: res.error }
    }
    return res ?? prevState
  }, initialState)

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    const supabase = createClient()

    // `role` needs to travel through the OAuth round trip so our callback
    // route can save it — options.queryParams only gets sent to Google's
    // authorization request and never comes back to us. Putting it on the
    // redirectTo URL works because Supabase preserves that URL (including
    // its query string) and calls it again after the provider redirects back.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    })

    if (error) {
      console.error('Google sign up error:', error.message)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <Image
            className="logo-mark"
            src="/assets/foosha-logo.png"
            alt="Foosha"
            width={712}
            height={201}
          />
          <h2>
            Every extra plate finds <em>the right</em> table.
          </h2>
          <p className="sub">
            Join Cebu City&apos;s food assistance network — give, receive, and make sure every
            handoff is verified with a one-time code.
          </p>

          <div className="ticket">
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
          <Link href="/" className="auth-back-link">
            ← Back to Landing Page
          </Link>
          <div className="eyebrow">Join the network</div>
          <h1>Create your account</h1>
          <p className="sub">Start giving or receiving food assistance in Cebu City.</p>

          {state?.error && <div className="auth-error">{state.error}</div>}
          {state?.success && <div className="auth-success" role="status">{state.success}</div>}

          <form action={formAction} noValidate>
            <div className="auth-field">
              <label>I&apos;m joining as</label>
              <div className="role-select-grid">
                {ROLES.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    className={`role-select-card${role === r.key ? ' selected' : ''}`}
                    onClick={() => setRole(r.key)}
                    aria-pressed={role === r.key}
                  >
                    {role === r.key && <span className="check-mark">✓</span>}
                    <span className="role-icon">{r.icon}</span>
                    <div className="role-name">{r.name}</div>
                    <div className="role-desc">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="full_name">Full name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="e.g. Juan Dela Cruz"
                autoComplete="name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirm_password">Confirm password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                className={passwordsMismatch ? 'error' : ''}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
              />
              {passwordsMismatch && (
                <div className="field-error">Passwords don&apos;t match</div>
              )}
            </div>

            <SubmitButton pendingText="Creating account...">Create account</SubmitButton>
          </form>

          <div className="auth-divider">OR</div>

          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? 'Redirecting...' : 'Sign up with Google'}
          </button>

          <p className="auth-footer">
            Already have an account? <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
