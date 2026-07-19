'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth-actions'
import { SubmitButton } from './SubmitButton'
import Link from 'next/link'
import Image from 'next/image'

const initialState = {
  error: '',
}

export function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const [state, formAction] = useActionState(async (prevState: { error: string }, formData: FormData) => {
    const res = await loginAction(formData)
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
            Welcome back to <em>Foosha</em>
          </h2>
          <p className="sub">
            Cebu City&apos;s food assistance network — where every donation is matched, tracked, and confirmed.
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
            <div className="ticket-code">7Q3K&nbsp;9XM2</div>
            <div className="ticket-hint">Recipient enters this code on pickup to confirm</div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="eyebrow">Welcome back</div>
          <h1>Log in to Foosha</h1>
          <p className="sub">Enter your email and password to continue.</p>

          {state?.error && <div className="auth-error">{state.error}</div>}

          <form action={formAction} noValidate>
            {nextUrl && <input type="hidden" name="next" value={nextUrl} />}

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            <SubmitButton pendingText="Signing in...">Log in</SubmitButton>
          </form>

          <p className="auth-footer">
            Not a member? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
