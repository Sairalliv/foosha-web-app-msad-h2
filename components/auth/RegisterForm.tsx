'use client'

import { useActionState } from 'react'
import { registerAction } from '@/actions/auth-actions'
import { SubmitButton } from './SubmitButton'
import Link from 'next/link'
import Image from 'next/image'

const initialState = {
  error: '',
}

export function RegisterForm() {
  const [state, formAction] = useActionState(async (prevState: { error: string }, formData: FormData) => {
    const res = await registerAction(formData)
    if (res?.error) {
      return { error: res.error }
    }
    return prevState
  }, initialState)

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
            Join the <em>Foosha</em> network
          </h2>
          <p className="sub">
            Give food or cash, ask for help when you&apos;re short — every handoff confirmed with a one-time code.
          </p>

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
          <div className="eyebrow">Get started</div>
          <h1>Create your account</h1>
          <p className="sub">It only takes a minute to join the network.</p>

          {state?.error && <div className="auth-error">{state.error}</div>}

          <form action={formAction} noValidate>
            <div className="auth-field">
              <label htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Juan Dela Cruz"
                autoComplete="name"
                required
                autoFocus
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
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
              />
            </div>

            <SubmitButton pendingText="Creating account...">Sign up</SubmitButton>
          </form>

          <p className="auth-footer">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
