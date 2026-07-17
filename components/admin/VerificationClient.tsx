'use client'

import React, { useState, useTransition } from 'react'
import { supabaseService, type EligibilityReviewItem } from '@/lib/supabaseService'

export function VerificationClient({
  initialFeed,
  initialEligibilityReview,
}: {
  initialFeed: any[]
  initialEligibilityReview: EligibilityReviewItem[]
}) {
  const [feed] = useState(initialFeed)
  const [eligibility, setEligibility] = useState(initialEligibilityReview)
  const [pendingId, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    setBusyId(id)
    startTransition(async () => {
      try {
        await supabaseService.approveEligibility(id)
        setEligibility((prev) => prev.filter((item) => item.id !== id))
      } catch (e) {
        console.error(e)
        alert('Failed to approve — please try again.')
      } finally {
        setBusyId(null)
      }
    })
  }

  const handleRequestInfo = (id: string) => {
    setBusyId(id)
    startTransition(async () => {
      try {
        await supabaseService.requestMoreInfo(id)
        setEligibility((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'needs_info' } : item))
        )
      } catch (e) {
        console.error(e)
        alert('Failed to request more info — please try again.')
      } finally {
        setBusyId(null)
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Top Section: OTP Pickup Verification */}
      <section>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Verification Center</h1>
          <p style={{ color: 'var(--paper-dim)', margin: '0 0 24px 0', fontSize: '15px' }}>Verify active pick-ups and review new recipient eligibility.</p>
        </div>

        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--paper)' }}>OTP Pickup Verification List</h3>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--paper-dim)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Ticket ID</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Recipient</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Donor</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Item</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Code</th>
                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {feed.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '16px 24px', color: 'var(--kalamansi)', fontFamily: 'var(--font-mono)' }}>{item.id}</td>
                  <td style={{ padding: '16px 24px', fontWeight: 500, color: 'var(--paper)' }}>{item.recipient}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--paper)' }}>{item.donor}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--paper-dim)' }}>{item.item}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>{item.code}</span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--paper-dim)' }}>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Section: Recipient Eligibility Review */}
      <section>
        <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: 'var(--paper)' }}>Recipient Eligibility Review</h3>
            <p style={{ fontSize: '13px', color: 'var(--paper-dim)', margin: '4px 0 0 0' }}>Evaluate uploaded documents for assistance approval.</p>
          </div>
          
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {eligibility.length === 0 && (
              <div style={{ color: 'var(--paper-dim)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                No pending eligibility reviews.
              </div>
            )}
            {eligibility.map(doc => {
              const isBusy = pendingId && busyId === doc.id
              return (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '20px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--paper-dim)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)', marginBottom: '4px' }}>{doc.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--paper-dim)' }}>
                        {doc.type} • Flagged {doc.uploaded}
                        {doc.status === 'needs_info' && (
                          <span style={{ color: 'var(--jeepney)', marginLeft: 8 }}>• Info requested</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleRequestInfo(doc.id)}
                      disabled={!!isBusy}
                      style={{ background: 'transparent', color: 'var(--paper)', border: '1px solid var(--line)', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: isBusy ? 'not-allowed' : 'pointer', opacity: isBusy ? 0.5 : 1 }}
                    >
                      Request Info
                    </button>
                    <button
                      onClick={() => handleApprove(doc.id)}
                      disabled={!!isBusy}
                      style={{ background: 'var(--kalamansi)', color: 'var(--bg-deep)', border: 'none', padding: '8px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: isBusy ? 'not-allowed' : 'pointer', opacity: isBusy ? 0.5 : 1 }}
                    >
                      {isBusy ? 'Working…' : 'Approve Tier Status'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
