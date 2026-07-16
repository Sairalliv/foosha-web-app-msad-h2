'use client';

import React, { useState, useActionState } from 'react';
import styles from './RoleAuth.module.css';
import { createClient } from '@/lib/supabase/client';
import { loginAction, registerAction } from '@/actions/auth-actions';

type Role = 'donor' | 'recipient' | 'admin';
type ViewState = 'signup' | 'login';

const initialState = {
  error: '',
};

export function RoleAuth() {
  const [view, setView] = useState<ViewState>('signup');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Use Action State for server form submissions
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

  const [registerState, formRegisterAction, isRegisterPending] = useActionState(
    async (prevState: { error: string }, formData: FormData) => {
      if (!selectedRole) {
        return { error: 'Please select a role first' };
      }
      formData.append('role', selectedRole);
      const res = await registerAction(formData);
      if (res?.error) {
        return { error: res.error };
      }
      return prevState;
    },
    initialState
  );

  const handleGoogleSignIn = async () => {
    if (view === 'signup' && !selectedRole) return;
    setIsGoogleLoading(true);

    const supabase = createClient();
    
    const queryParams: Record<string, string> = {};
    if (view === 'signup' && selectedRole) {
      queryParams.role = selectedRole;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: queryParams
      }
    });

    if (error) {
      console.error('Google Login error:', error.message);
      setIsGoogleLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === 'login' ? 'signup' : 'login');
    setSelectedRole(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {view === 'login' ? 'Welcome Back' : 'Join Project Foosha'}
          </h1>
          <p className={styles.subtitle}>
            {view === 'login' 
              ? 'Log in to continue managing your impact.' 
              : 'Select your role to help make a difference in Mandaue City.'}
          </p>
        </div>

        {view === 'signup' && (
          <div className={styles.roleContainer}>
            {/* DONOR BUTTON */}
            <button
              type="button"
              className={`${styles.roleButton} ${styles.donor} ${selectedRole === 'donor' ? styles.selected : ''}`}
              onClick={() => setSelectedRole('donor')}
              aria-pressed={selectedRole === 'donor'}
            >
              <span className={styles.roleTitle}>I WANT TO DONATE</span>
              <span className={styles.roleDesc}>Give food or cash, track your impact, and earn badges.</span>
            </button>

            {/* RECIPIENT BUTTON */}
            <button
              type="button"
              className={`${styles.roleButton} ${styles.recipient} ${selectedRole === 'recipient' ? styles.selected : ''}`}
              onClick={() => setSelectedRole('recipient')}
              aria-pressed={selectedRole === 'recipient'}
            >
              <span className={styles.roleTitle}>I NEED ASSISTANCE</span>
              <span className={styles.roleDesc}>Connect with local donors and receive verified support.</span>
            </button>

            {/* ADMIN BUTTON */}
            <button
              type="button"
              className={`${styles.roleButton} ${styles.admin} ${selectedRole === 'admin' ? styles.selected : ''}`}
              onClick={() => setSelectedRole('admin')}
              aria-pressed={selectedRole === 'admin'}
            >
              <span className={styles.roleTitle}>CITY ADMIN</span>
              <span className={styles.roleDesc}>Manage verifications, view analytics, and oversee operations.</span>
            </button>
          </div>
        )}

        {((view === 'signup' && selectedRole) || view === 'login') && (
          <div className={styles.continueWrapper}>
            {view === 'signup' && registerState?.error && (
              <div className={styles.error}>{registerState.error}</div>
            )}
            {view === 'login' && loginState?.error && (
              <div className={styles.error}>{loginState.error}</div>
            )}

            <form action={view === 'login' ? formLoginAction : formRegisterAction} className={styles.form}>
              {view === 'signup' && (
                <div className={styles.field}>
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>
              )}
              
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
                  autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={view === 'login' ? isLoginPending : isRegisterPending}
              >
                {view === 'login' 
                  ? (isLoginPending ? 'Logging in...' : 'Log In') 
                  : (isRegisterPending ? 'Creating Account...' : 'Sign Up')}
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
              {isGoogleLoading ? 'Redirecting...' : (view === 'login' ? 'Log in with Google' : 'Sign up with Google')}
            </button>
          </div>
        )}

        <div className={styles.toggleContainer}>
          {view === 'login' ? (
            <>
              Don't have an account? 
              <button onClick={toggleView} className={styles.toggleButton}>Sign Up</button>
            </>
          ) : (
            <>
              Already have an account? 
              <button onClick={toggleView} className={styles.toggleButton}>Log In</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
