'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const ROLES = [
  {
    key: 'donor',
    label: 'Act as Donor',
    desc: 'Submit donations, view history',
    href: '/donor',
    color: 'var(--kalamansi)',
    bg: 'rgba(199, 217, 77, 0.12)',
    icon: '🤝',
  },
  {
    key: 'requestor',
    label: 'Act as Requestor',
    desc: 'Request help, see OTP codes',
    href: '/requestor',
    color: 'var(--jeepney)',
    bg: 'rgba(232, 84, 47, 0.12)',
    icon: '🏠',
  },
  {
    key: 'admin',
    label: 'Act as Admin',
    desc: 'Full admin console',
    href: '/admin',
    color: 'var(--teal)',
    bg: 'rgba(143, 184, 168, 0.12)',
    icon: '🛡️',
  },
]

export function DemoSwitcher() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Determine current active role from the pathname
  const currentRole = pathname.startsWith('/admin')
    ? 'admin'
    : pathname.startsWith('/donor')
      ? 'donor'
      : pathname.startsWith('/requestor')
        ? 'requestor'
        : null

  // Close panel on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Don't render on auth pages or landing
  if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/') {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 49,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            zIndex: 51,
            width: '320px',
            background: 'var(--bg-deep)',
            border: '1px solid var(--line)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 24px 80px -12px rgba(0,0,0,0.7)',
            animation: 'slideUp 0.25s ease both',
          }}
        >
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--kalamansi)', marginBottom: '6px' }}>
              DEMO MODE
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)' }}>
              Switch Role Perspective
            </div>
            <div style={{ fontSize: '13px', color: 'var(--paper-dim)', marginTop: '4px' }}>
              Preview how different users see the app.
            </div>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ROLES.map(role => {
              const isActive = currentRole === role.key
              return (
                <button
                  key={role.key}
                  onClick={() => {
                    router.push(role.href)
                    setOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: isActive ? `1.5px solid ${role.color}` : '1px solid var(--line)',
                    background: isActive ? role.bg : 'transparent',
                    color: 'var(--paper)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{role.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: isActive ? role.color : 'var(--paper)' }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--paper-dim)', marginTop: '2px' }}>
                      {role.desc}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: role.color, flexShrink: 0 }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        title="Switch demo role"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: open ? 'var(--jeepney)' : 'var(--kalamansi)',
          color: 'var(--bg-deep)',
          cursor: 'pointer',
          boxShadow: open
            ? '0 8px 32px -4px rgba(232, 84, 47, 0.5)'
            : '0 8px 32px -4px rgba(199, 217, 77, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          fontWeight: 700,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {open ? '✕' : '⟐'}
      </button>
    </>
  )
}
