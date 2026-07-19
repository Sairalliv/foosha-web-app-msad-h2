'use client';

import React, { useState, useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RoleAuth.module.css';
import { createClient } from '@/lib/supabase/client';
import { loginAction } from '@/actions/auth-actions';

const initialState = {
  error: '',
};

export function RoleAuth() {
  const searchParams = useSearchParams();
  const urlError = searchParams?.get('error');

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [loginState, formLoginAction, isLoginPending] = useActionState(
    async (prevState: { error: string }, formData: FormData) => {
      const res = await loginAction(formData);
      if (res?.error) {
        return { error: res.error };
      }
      return prevState;
    },
    initialState
  );

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google Login error:', error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <Image
            src="/assets/foosha-logo.png"
            alt="Foosha Logo"
            width={712}
            height={201}
            className="logo-mark"
          />
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to continue managing your impact.</p>
        </div>

        <div className={styles.continueWrapper}>
          {urlError && <div className={styles.error}>{urlError}</div>}
          {loginState?.error && <div className={styles.error}>{loginState.error}</div>}

          <form action={formLoginAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="juan@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className={styles.submitButton} disabled={isLoginPending}>
              {isLoginPending ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className={styles.divider}>OR</div>

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGoogleLoading ? 'Redirecting...' : 'Log in with Google'}
          </button>
        </div>

        <div className={styles.toggleContainer}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.toggleButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
