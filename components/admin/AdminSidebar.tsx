'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  GitMerge,
  Package,
  HelpCircle,
  BarChart3,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { logoutAction } from '@/actions/auth-actions'

const NAV_GROUPS = [
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Matching queue', href: '/admin/matching', icon: GitMerge },
      { label: 'All donations', href: '/admin/donations', icon: Package },
      { label: 'All requests', href: '/admin/requests', icon: HelpCircle },
    ]
  },
  {
    label: 'INSIGHTS',
    items: [
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Reports & export', href: '/admin/reports', icon: FileText },
    ]
  },
  {
    label: 'PEOPLE',
    items: [
      { label: 'Verification', href: '/admin/verification', icon: ShieldCheck },
    ]
  }
]

export function AdminSidebar({ adminName, adminInitials }: { adminName: string, adminInitials: string }) {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--paper)', margin: 0, lineHeight: 1 }}>Foosha</h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--kalamansi)', marginTop: 4 }}>
          CITY ADMIN CONSOLE
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-soft)', marginBottom: 8, letterSpacing: '0.5px' }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: isActive ? 'var(--kalamansi)' : 'var(--paper-dim)',
                      background: isActive ? 'rgba(199, 217, 77, 0.08)' : 'transparent',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <item.icon size={16} style={{ opacity: isActive ? 1 : 0.6 }} />
                    {item.label}
                    {isActive && (
                      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                        {/* Diamond bullet */}
                        <div style={{ width: 6, height: 6, background: 'var(--kalamansi)', transform: 'rotate(45deg)' }} />
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--line)' }}>
        <form action={logoutAction}>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '8px 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', color: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13 }}>
              {adminInitials}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--paper)' }}>{adminName}</div>
              <div style={{ fontSize: 12, color: 'var(--paper-dim)' }}>admin · Log out</div>
            </div>
          </button>
        </form>
      </div>
    </aside>
  )
}
