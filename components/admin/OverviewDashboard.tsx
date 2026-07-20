'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Banknote,
  Clock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react'
import { getSupabaseService } from '@/lib/supabaseService.client'
import { NearbyMapPanel } from '@/components/dashboard/NearbyMapPanel'
import type { MatchingQueueItem, VerificationItem, LeaderboardEntry, OverviewStats } from '@/lib/supabaseService'

interface Props {
  initialMatchingQueue: MatchingQueueItem[]
  initialVerificationFeed: VerificationItem[]
  initialLeaderboard: LeaderboardEntry[]
  stats: OverviewStats
}

function BadgeIcons({ badges }: { badges: string[] }) {
  return (
    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
      {badges.map((b) => (
        <span 
          key={b} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            background: b === 'bayani' ? 'var(--kalamansi)' : 'rgba(255,255,255,0.1)', 
            color: b === 'bayani' ? 'var(--bg-deep)' : 'var(--paper)',
            fontSize: '10px'
          }}
          title={b === 'bayani' ? 'Bayani ng Barangay' : 'First Harvest'}
        >
          {b === 'bayani' ? '★' : '🌱'}
        </span>
      ))}
    </div>
  )
}

export function OverviewDashboard({ initialMatchingQueue, initialVerificationFeed, initialLeaderboard, stats }: Props) {
  const [verificationFeed, setVerificationFeed] = useState(initialVerificationFeed)
  const [otpCodes, setOtpCodes] = useState<Record<string, string>>({})
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const handleVerify = async (id: string) => {
    const code = otpCodes[id]
    if (!code) return
    setVerifyingId(id)
    setVerifyError(null)
    try {
      const supabaseService = getSupabaseService()
      await supabaseService.confirmMatchPickup(id, code)
      setVerificationFeed((prev) => prev.filter((item) => item.id !== id))
      setOtpCodes((prev) => ({ ...prev, [id]: '' }))
    } catch (e) {
      console.error(e)
      setVerifyError('That code is invalid or already used. Double-check and try again.')
    } finally {
      setVerifyingId(null)
    }
  }

  const todayLabel = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '8px' }}>
            <Clock size={14} /> Live overview &middot; {todayLabel}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Logistics &amp; Verification</h1>
          <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>Supply, demand, and delivery status across all barangays.</p>
        </div>
        <Link 
          href="/admin/matching"
          style={{ 
            background: 'var(--jeepney)', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            fontWeight: 600, 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(232, 84, 47, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
        >
          Process matches
          <ChevronRight size={18} />
        </Link>
      </div>

      {/* Top Row Statistics Cards Grid */}
      <div className="stat-row" style={{ display: 'grid', gap: '24px' }}>
        {/* Card 1: Total Active Requests */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--paper-dim)', fontWeight: 500, margin: '0 0 16px 0' }}>Total Active Requests</h4>
          <div style={{ fontSize: '56px', fontWeight: 700, color: 'var(--jeepney)', lineHeight: 1, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
            {stats.activeRequests}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(199, 217, 77, 0.1)', color: 'var(--kalamansi)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              elderly {stats.activeByTier.elderly}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(232, 84, 47, 0.1)', color: 'var(--jeepney)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              PWD {stats.activeByTier.pwd}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(143, 184, 168, 0.1)', color: 'var(--teal)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              infant {stats.activeByTier.infant}
            </span>
          </div>
        </div>

        {/* Card 2: Donations Received */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--paper-dim)', fontWeight: 500, margin: '0 0 24px 0' }}>Donations Received</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(199, 217, 77, 0.1)', color: 'var(--kalamansi)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--paper)', lineHeight: 1, marginBottom: '4px' }}>{stats.foodDonationsCount}</div>
                <div style={{ fontSize: '13px', color: 'var(--paper-dim)' }}>Food Items</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(143, 184, 168, 0.1)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Banknote size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--paper)', lineHeight: 1, marginBottom: '4px' }}>₱{stats.cashTotal.toLocaleString()}</div>
                <div style={{ fontSize: '13px', color: 'var(--paper-dim)' }}>Cash Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Delivery Performance */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--paper-dim)', fontWeight: 500, margin: '0 0 16px 0' }}>Delivery Performance</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* SVG Circular Progress */}
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
              <svg viewBox="0 0 100 100" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-deep)" strokeWidth="12" />
                {/* 50% Delivered Ring */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="var(--kalamansi)" 
                  strokeWidth="12" 
                  strokeDasharray={`${(stats.deliveredPercent / 100) * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--paper)', lineHeight: 1 }}>{stats.deliveredPercent}%</span>
                <span style={{ fontSize: '10px', color: 'var(--paper-dim)', textTransform: 'uppercase' }}>Delivered</span>
              </div>
            </div>
            
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--kalamansi)' }} />
                <span style={{ color: 'var(--paper)' }}>Delivered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--bg-deep)' }} />
                <span style={{ color: 'var(--paper-dim)' }}>Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Locations Map */}
      <NearbyMapPanel
        title="Donation Locations"
        subtitle="City-wide view of donation centers, pantries, and NGOs currently on the map."
        height={360}
        withTopMargin={false}
      />

      <div className="grid-2" style={{ display: 'grid', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Priority Matching Queue Table */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--paper)' }}>Priority Matching Queue</h3>
              <Link href="/admin/matching" style={{ fontSize: '13px', color: 'var(--kalamansi)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--paper-dim)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '16px 24px', fontWeight: 500 }}>Requestor / Priority</th>
                  <th style={{ padding: '16px 24px', fontWeight: 500 }}>Matched Donor</th>
                  <th style={{ padding: '16px 24px', fontWeight: 500 }}>Item Details</th>
                  <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
              {initialMatchingQueue.slice(0, 4).map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--paper)', marginBottom: '4px' }}>{row.requestor}</div>
                      <span style={{ 
                        display: 'inline-flex', 
                        padding: '2px 8px', 
                        borderRadius: '99px', 
                        fontSize: '11px', 
                        background: 'rgba(199, 217, 77, 0.15)', 
                        color: 'var(--kalamansi)',
                        fontWeight: 500
                      }}>
                        {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)} • Tier 1
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--paper)' }}>{row.donor}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--paper-dim)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                          {row.kind === 'food' ? '🍚' : '💵'}
                        </span>
                        {row.item}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        display: 'inline-flex', 
                        padding: '4px 10px', 
                        borderRadius: '99px', 
                        fontSize: '12px', 
                        background: row.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(143, 184, 168, 0.15)',
                        color: row.status === 'pending' ? '#fbbf24' : 'var(--teal)',
                        fontWeight: 500
                      }}>
                        {row.status === 'pending' ? 'Pending Dispatch' : 'Dispatched'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* OTP Security Verification Panel */}
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} color="var(--jeepney)" />
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--paper)' }}>OTP Security Verification</h3>
              </div>
              <Link href="/admin/verification" style={{ fontSize: '13px', color: 'var(--kalamansi)', textDecoration: 'none', fontWeight: 500 }}>
                Verification Center
              </Link>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {verificationFeed.length === 0 && (
                <div style={{ color: 'var(--paper-dim)', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                  No pending pickups awaiting verification.
                </div>
              )}
              {verifyError && (
                <div style={{ color: '#fbbf24', fontSize: '12px' }}>{verifyError}</div>
              )}
              {verificationFeed.slice(0, 3).map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.1)', padding: '12px 16px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--paper)', marginBottom: '4px' }}>{item.recipient}</div>
                    <div style={{ fontSize: '12px', color: 'var(--paper-dim)' }}>Ticket {item.id} • {item.donor}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter OTP"
                      maxLength={6}
                      value={otpCodes[item.id] || ''}
                      onChange={(e) => setOtpCodes(prev => ({ ...prev, [item.id]: e.target.value.toUpperCase() }))}
                      style={{ 
                        width: '100px', 
                        padding: '8px', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--line)', 
                        borderRadius: '4px', 
                        color: 'var(--paper)', 
                        fontFamily: 'var(--font-mono)', 
                        textAlign: 'center',
                        letterSpacing: '2px'
                      }}
                    />
                    <button 
                      onClick={() => handleVerify(item.id)}
                      disabled={!otpCodes[item.id] || verifyingId === item.id}
                      style={{ 
                        background: 'var(--jeepney)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '4px', 
                        fontWeight: 600,
                        cursor: 'pointer',
                        opacity: (!otpCodes[item.id] || verifyingId === item.id) ? 0.5 : 1
                      }}
                    >
                      {verifyingId === item.id ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Donors Leaderboard Widget */}
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--paper)' }}>Top Donors Leaderboard</h3>
            <p style={{ fontSize: '13px', color: 'var(--paper-dim)', margin: '4px 0 0 0' }}>Community engagement rankings</p>
          </div>
          <div style={{ padding: '0', flex: 1 }}>
            {initialLeaderboard.length === 0 && (
              <div style={{ color: 'var(--paper-dim)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
                No confirmed cash donations yet.
              </div>
            )}
            {initialLeaderboard.map((donor, i) => (
              <div key={donor.rank} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderBottom: i < initialLeaderboard.length - 1 ? '1px solid var(--line)' : 'none', background: i === 0 ? 'rgba(199, 217, 77, 0.05)' : 'transparent' }}>
                <div style={{ 
                  width: '28px', height: '28px', borderRadius: '50%', 
                  background: donor.rank === 1 ? '#fbbf24' : donor.rank === 2 ? '#9ca3af' : donor.rank === 3 ? '#b45309' : 'rgba(255,255,255,0.1)',
                  color: donor.rank <= 3 ? '#000' : 'var(--paper-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px'
                }}>
                  {donor.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--paper)' }}>{donor.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--paper-dim)', marginTop: '2px' }}>{donor.amount} contributed</div>
                </div>
                {donor.badges && donor.badges.length > 0 && <BadgeIcons badges={donor.badges} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
