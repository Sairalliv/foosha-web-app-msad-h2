'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RoleAuth.module.css'; // Reusing our beautiful styling!
import { createClient } from '@/lib/supabase/client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }

    setIsLoading(false);
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
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className={styles.continueWrapper}>
          {error && <div className={styles.error}>{error}</div>}
          
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                color: '#C7D94D', 
                backgroundColor: 'rgba(199, 217, 77, 0.1)', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(199, 217, 77, 0.3)'
              }}>
                Check your email for the reset link!
              </div>
              <Link href="/login" className={styles.toggleButton} style={{ marginLeft: 0 }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!success && (
            <div className={styles.toggleContainer} style={{ marginTop: '1.5rem' }}>
              Remember your password? 
              <Link href="/login" className={styles.toggleButton}>
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
