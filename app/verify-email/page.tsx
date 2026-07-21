import Image from 'next/image'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import styles from '@/components/auth/RoleAuth.module.css'

export const metadata = {
  title: 'Check Your Email - Foosha',
  description: 'Verify your email address to activate your Foosha account',
}

export default function VerifyEmailPage() {
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

          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(199, 217, 77, 0.1)',
              border: '1px solid rgba(199, 217, 77, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0.5rem auto 1.5rem auto',
            }}
          >
            <MailCheck size={30} color="#C7D94D" strokeWidth={2} />
          </div>

          <h1 className={styles.title}>Check Your Email</h1>
          <p className={styles.subtitle}>
            Success! We&apos;ve sent a verification link to your inbox.
            Please click the link in that email to verify your account
            before logging in.
          </p>
        </div>

        <div className={styles.continueWrapper}>
          <div
            style={{
              color: '#8FB8A8',
              backgroundColor: 'rgba(143, 184, 168, 0.08)',
              padding: '1rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              textAlign: 'center',
              border: '1px solid rgba(143, 184, 168, 0.2)',
            }}
          >
            Didn&apos;t get an email? Check your spam folder, or make sure
            you entered the correct address when signing up.
          </div>

          <div className={styles.toggleContainer} style={{ marginTop: '2rem' }}>
            Already verified?
            <Link href="/login" className={styles.toggleButton}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
