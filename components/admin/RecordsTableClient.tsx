'use client'

import React, { useState } from 'react'

type RecordType = 'donations' | 'requests'

interface RecordItem {
  id: string
  status: string
  neighborhood: string
  date: string
  [key: string]: any
}

export function RecordsTableClient({ title, type, initialData }: { title: string, type: RecordType, initialData: RecordItem[] }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filters = ['All', 'Unmatched', 'Matching', 'Awaiting', 'Confirmed']

  const filteredData = initialData.filter(item => {
    if (filter !== 'All') {
      // Map generic filters to specific data statuses.
      // In the mock, statuses might be "Available", "Pending", "Matched", etc.
      // We will do a simple text match for the sake of the mock demo,
      // but in reality we'd map "Unmatched" -> "Available"/"Pending", "Confirmed" -> "Matched", etc.
      const s = item.status.toLowerCase()
      const f = filter.toLowerCase()
      if (f === 'unmatched' && !(s === 'available' || s === 'pending')) return false
      if (f === 'matching' && s !== 'matching') return false
      if (f === 'awaiting' && s !== 'awaiting') return false
      if (f === 'confirmed' && s !== 'matched') return false
    }

    if (search) {
      const searchLower = search.toLowerCase()
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0', color: 'var(--paper)' }}>{title}</h1>
      
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  background: filter === f ? 'var(--kalamansi)' : 'rgba(255,255,255,0.05)',
                  color: filter === f ? 'var(--bg-deep)' : 'var(--paper-dim)',
                  border: filter === f ? 'none' : '1px solid var(--line)',
                  padding: '6px 16px',
                  borderRadius: '99px',
                  fontSize: '13px',
                  fontWeight: filter === f ? 600 : 400,
                  cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <input 
            type="text" 
            placeholder="Search records..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--line)',
              color: 'var(--paper)',
              padding: '8px 16px',
              borderRadius: '99px',
              fontSize: '13px',
              width: '250px'
            }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--paper-dim)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>ID</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>{type === 'donations' ? 'Donor' : 'Requestor'}</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>{type === 'donations' ? 'Item' : 'Need'}</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Neighborhood</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '16px 24px', color: 'var(--paper-dim)' }}>{row.id}</td>
                <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--paper)' }}>
                  {type === 'donations' ? row.donor : row.requestor}
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--paper)' }}>
                  {type === 'donations' ? row.item : row.need}
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--paper-dim)' }}>{row.neighborhood}</td>
                <td style={{ padding: '16px 24px', color: 'var(--paper-dim)' }}>{row.date}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    padding: '4px 10px', 
                    borderRadius: '99px', 
                    fontSize: '12px', 
                    background: (row.status === 'Available' || row.status === 'Pending') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(143, 184, 168, 0.15)',
                    color: (row.status === 'Available' || row.status === 'Pending') ? '#fbbf24' : 'var(--teal)',
                    fontWeight: 500
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--paper-dim)' }}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
