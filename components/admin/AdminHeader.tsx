'use client'

import React, { useState } from 'react'
import { Search, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AdminHeader({ title, adminName, adminInitials }: { title: string, adminName: string, adminInitials: string }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
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
        {/* Search Pill */}
        <form 
          onSubmit={handleSearch}
          style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'rgba(255, 255, 255, 0.05)', 
          border: '1px solid var(--line)', 
          borderRadius: '99px',
          padding: '8px 16px',
          width: '320px',
          gap: 8
        }}>
          <Search size={16} color="var(--paper-dim)" />
          <input 
            type="text" 
            placeholder="Search families, donors, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
