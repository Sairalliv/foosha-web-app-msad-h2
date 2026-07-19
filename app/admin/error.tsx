'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin portal error:', error)
  }, [error])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        background: 'var(--bg-panel)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '560px',
      }}
    >
      <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--paper)' }}>
        Couldn&apos;t load this admin page
      </h2>
      <p style={{ margin: 0, color: 'var(--paper-dim)', fontSize: '15px', lineHeight: 1.5 }}>
        This usually means the Supabase backend isn&apos;t fully set up yet — missing tables,
        migrations that haven&apos;t been run, or env vars that aren&apos;t configured for this
        deployment. The rest of the app can still work; this section just needs the database
        behind it to be ready.
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: 'var(--primary, #E8542F)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
