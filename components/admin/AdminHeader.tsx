'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  CornerDownLeft,
  LayoutDashboard,
  GitMerge,
  Package,
  HelpCircle,
  BarChart3,
  FileText,
  ShieldCheck,
} from 'lucide-react'

// Kept in sync with the routes in AdminSidebar.tsx so "page shortcut"
// suggestions always point somewhere real.
interface PageShortcut {
  label: string
  href: string
  keywords: string[]
  icon: React.ComponentType<{ size?: number }>
}

const PAGE_SHORTCUTS: PageShortcut[] = [
  { label: 'Overview', href: '/admin', keywords: ['overview', 'dashboard', 'home'], icon: LayoutDashboard },
  { label: 'Matching queue', href: '/admin/matching', keywords: ['matching', 'queue', 'match'], icon: GitMerge },
  { label: 'All donations', href: '/admin/donations', keywords: ['donations', 'donation', 'donor', 'donors'], icon: Package },
  { label: 'All requests', href: '/admin/requests', keywords: ['requests', 'request', 'requestor'], icon: HelpCircle },
  { label: 'Analytics', href: '/admin/analytics', keywords: ['analytics', 'stats', 'statistics'], icon: BarChart3 },
  { label: 'Reports & export', href: '/admin/reports', keywords: ['reports', 'report', 'export'], icon: FileText },
  { label: 'Verification', href: '/admin/verification', keywords: ['verification', 'verify', 'otp'], icon: ShieldCheck },
]

const MAX_PAGE_SUGGESTIONS = 4

export function AdminHeader({ title, adminName, adminInitials }: { title: string, adminName: string, adminInitials: string }) {
  const router = useRouter()

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const trimmedQuery = query.trim()
  const lowerQuery = trimmedQuery.toLowerCase()

  const matchedPages = trimmedQuery
    ? PAGE_SHORTCUTS.filter(
        (page) =>
          page.label.toLowerCase().includes(lowerQuery) ||
          page.keywords.some((keyword) => keyword.includes(lowerQuery))
      ).slice(0, MAX_PAGE_SUGGESTIONS)
    : []

  const showSearchOption = trimmedQuery.length > 0
  const totalRows = matchedPages.length + (showSearchOption ? 1 : 0)
  const showDropdown = isOpen && totalRows > 0

  // Close the dropdown on outside clicks, YouTube-style.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function closeDropdown() {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  function goToPage(href: string) {
    setQuery('')
    closeDropdown()
    router.push(href)
  }

  function runSearch(rawQuery: string) {
    const clean = rawQuery.trim()
    if (!clean) return
    closeDropdown()
    inputRef.current?.blur()
    router.push(`/admin/search?q=${encodeURIComponent(clean)}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (highlightedIndex >= 0 && highlightedIndex < matchedPages.length) {
      goToPage(matchedPages[highlightedIndex].href)
      return
    }
    runSearch(query)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % totalRows)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + totalRows) % totalRows)
    } else if (e.key === 'Escape') {
      closeDropdown()
    }
  }

  return (
    <header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '24px 40px',
      borderBottom: '1px solid var(--line)',
      background: 'rgba(19, 36, 32, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: 0, fontWeight: 500 }}>
        {title}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Search Pill + Suggestions Dropdown */}
        <div ref={containerRef} style={{ position: 'relative', width: '320px' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--line)',
              borderRadius: '99px',
              padding: '8px 16px',
              width: '100%',
              gap: 8
            }}
          >
            <Search size={16} color="var(--paper-dim)" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search families, donors, or ID..."
              value={query}
              autoComplete="off"
              onChange={(e) => {
                const value = e.target.value
                setQuery(value)
                setHighlightedIndex(-1)
                setIsOpen(value.trim().length > 0)
              }}
              onFocus={() => {
                if (trimmedQuery.length > 0) setIsOpen(true)
              }}
              onKeyDown={handleKeyDown}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--paper)',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                fontFamily: 'var(--font-body)'
              }}
            />
          </form>

          {showDropdown && (
            <div
              role="listbox"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: 'var(--bg-panel)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                zIndex: 20
              }}
            >
              {matchedPages.length > 0 && (
                <div style={{ padding: '8px' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    padding: '6px 10px 4px'
                  }}>
                    Pages
                  </div>
                  {matchedPages.map((page, idx) => {
                    const isHighlighted = highlightedIndex === idx
                    return (
                      <button
                        key={page.href}
                        type="button"
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => goToPage(page.href)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          background: isHighlighted ? 'rgba(199, 217, 77, 0.1)' : 'transparent',
                          color: 'var(--paper)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px',
                          fontSize: '14px',
                          fontFamily: 'var(--font-body)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <page.icon size={16} />
                        <span style={{ fontWeight: 500 }}>{page.label}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--paper-dim)' }}>
                          Jump to page
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {showSearchOption && (
                <div style={{
                  padding: '8px',
                  borderTop: matchedPages.length > 0 ? '1px solid var(--line)' : 'none'
                }}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlightedIndex(matchedPages.length)}
                    onClick={() => runSearch(query)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      background: highlightedIndex === matchedPages.length ? 'rgba(199, 217, 77, 0.1)' : 'transparent',
                      color: 'var(--paper)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Search size={16} color="var(--paper-dim)" />
                    <span>
                      Press Enter to search for <span style={{ fontWeight: 600, color: 'var(--kalamansi)' }}>&ldquo;{trimmedQuery}&rdquo;</span>
                    </span>
                    <CornerDownLeft size={14} style={{ marginLeft: 'auto', color: 'var(--paper-dim)' }} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--paper)' }}>
          <Bell size={20} />
        </button>

        {/* Profile Circle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', color: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13 }}>
            {adminInitials}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{adminName.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  )
}
