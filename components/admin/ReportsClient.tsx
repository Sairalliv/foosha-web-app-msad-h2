'use client'

import React, { useMemo, useState } from 'react'
import { Download, Calendar, Package, Banknote, HelpCircle } from 'lucide-react'
import type { Donation, HelpRequest } from '@/lib/supabaseService'

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (val: unknown) => {
    const s = String(val ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ]
  return lines.join('\n')
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${accent}1a`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--paper)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>{value}</div>
        <div style={{ fontSize: '13px', color: 'var(--paper-dim)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

export function ReportsClient({
  initialDonations,
  initialRequests,
}: {
  initialDonations: Donation[]
  initialRequests: HelpRequest[]
}) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const inRange = (date: string) => {
    if (from && date < from) return false
    if (to && date > to) return false
    return true
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const donations = useMemo(() => initialDonations.filter((d) => inRange(d.date)), [initialDonations, from, to])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const requests = useMemo(() => initialRequests.filter((r) => inRange(r.date)), [initialRequests, from, to])

  const cashTotal = donations
    .filter((d) => d.type === 'cash')
    .reduce((sum, d) => sum + Number(d.amount ?? 0), 0)
  const foodCount = donations.filter((d) => d.type === 'food').length

  const exportDonations = () =>
    downloadCsv(
      `foosha-donations${from || to ? `_${from || 'start'}_to_${to || 'now'}` : ''}.csv`,
      toCsv(donations.map((d) => ({
        id: d.id, donor: d.donor, type: d.type, item: d.item,
        amount: d.amount ?? '', neighborhood: d.neighborhood, status: d.status, date: d.date,
      })))
    )

  const exportRequests = () =>
    downloadCsv(
      `foosha-requests${from || to ? `_${from || 'start'}_to_${to || 'now'}` : ''}.csv`,
      toCsv(requests.map((r) => ({
        id: r.id, requestor: r.requestor, need: r.need, priority: r.priority,
        barangay: r.barangay, status: r.status, date: r.date,
      })))
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Reports &amp; Export</h1>
          <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>Filter by date range and export city-wide records as CSV.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 16px' }}>
          <Calendar size={16} color="var(--paper-dim)" />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--paper)', fontSize: '13px', colorScheme: 'dark' }}
          />
          <span style={{ color: 'var(--paper-dim)', fontSize: '13px' }}>to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--paper)', fontSize: '13px', colorScheme: 'dark' }}
          />
          {(from || to) && (
            <button
              onClick={() => { setFrom(''); setTo('') }}
              style={{ background: 'transparent', border: 'none', color: 'var(--kalamansi)', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard icon={<Package size={20} />} label="Donations in range" value={String(donations.length)} accent="var(--kalamansi)" />
        <StatCard icon={<Banknote size={20} />} label="Cash donated" value={`₱${cashTotal.toLocaleString()}`} accent="var(--teal)" />
        <StatCard icon={<Package size={20} />} label="Food donations" value={String(foodCount)} accent="var(--jeepney)" />
        <StatCard icon={<HelpCircle size={20} />} label="Requests in range" value={String(requests.length)} accent="var(--paper)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--paper)' }}>Donations Record</h3>
            <p style={{ fontSize: '13px', color: 'var(--paper-dim)', margin: 0 }}>{donations.length} record{donations.length === 1 ? '' : 's'} in the selected range</p>
          </div>
          <button
            onClick={exportDonations}
            disabled={donations.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--kalamansi)', color: 'var(--bg-deep)', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: donations.length === 0 ? 'not-allowed' : 'pointer', opacity: donations.length === 0 ? 0.5 : 1 }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--paper)' }}>Assistance Requests Record</h3>
            <p style={{ fontSize: '13px', color: 'var(--paper-dim)', margin: 0 }}>{requests.length} record{requests.length === 1 ? '' : 's'} in the selected range</p>
          </div>
          <button
            onClick={exportRequests}
            disabled={requests.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--jeepney)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: requests.length === 0 ? 'not-allowed' : 'pointer', opacity: requests.length === 0 ? 0.5 : 1 }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}
