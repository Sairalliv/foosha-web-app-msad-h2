'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  Gift,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { logoutAction } from '@/actions/auth-actions'

const STORAGE_KEY = 'foosha-sidebar-collapsed'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Donation Map', href: '/map', icon: Map },
]

interface DashboardSidebarProps {
  displayName: string
  initials: string
  role: string
  avatarUrl?: string | null
  showAdminLink?: boolean
}

export function DashboardSidebar({
  displayName,
  initials,
  role,
  showAdminLink,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') setCollapsed(true)
    setMounted(true)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  // Prevent hydration mismatch — render expanded by default on server
  const isCollapsed = mounted ? collapsed : false

  return (
    <aside className={`sidebar ds-sidebar ${isCollapsed ? 'ds-collapsed' : 'ds-expanded'}`}>
      {/* Toggle button */}
      <button
        type="button"
        className="ds-toggle"
        onClick={toggleCollapsed}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo */}
      <div className="ds-logo-wrap">
        {isCollapsed ? (
          <Image
            className="ds-logo-icon"
            src="/assets/foosha-logo.png"
            alt="Foosha"
            width={712}
            height={201}
          />
        ) : (
          <Image
            className="logo-mark"
            src="/assets/foosha-logo.png"
            alt="Foosha"
            width={712}
            height={201}
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="ds-nav" aria-label="Dashboard navigation">
        <div className="nav-group">
          {!isCollapsed && <div className="nav-label">Menu</div>}
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`ds-nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={18} className="ds-nav-icon" aria-hidden="true" />
                <span className="ds-nav-text">{item.label}</span>
              </Link>
            )
          })}
          {showAdminLink && (
            <Link
              href="/admin"
              className={`ds-nav-item ${pathname === '/admin' ? 'active' : ''}`}
              title={isCollapsed ? 'Admin Portal' : undefined}
            >
              <Settings size={18} className="ds-nav-icon" aria-hidden="true" />
              <span className="ds-nav-text">Admin Portal</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Footer with user profile & logout */}
      <div className="sidebar-foot">
        <form action={logoutAction}>
          <button type="submit" className="ds-profile-btn" title={isCollapsed ? `${displayName} · Log out` : undefined}>
            <div className="avatar">{initials || 'U'}</div>
            <div className="ds-profile-info">
              <div className="who">{displayName}</div>
              <div className="role">{role} · Log out</div>
            </div>
            <LogOut size={16} className="ds-logout-icon" aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  )
}
