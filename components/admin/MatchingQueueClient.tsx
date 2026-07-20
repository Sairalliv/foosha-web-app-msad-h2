'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseService } from '@/lib/supabaseService.client'
import type { Donation, HelpRequest, Priority } from '@/lib/supabaseService'

// Lower number = higher priority. "General" is last, per the matching rules.
const PRIORITY_ORDER: Record<Priority, number> = {
  elderly: 0,
  pwd: 1,
  infant: 2,
  general: 3,
}

/**
 * Finds the single best donation/request pair from the given pools, following
 * the auto-match rules:
 *   1. Type must match (food<->food, cash<->cash)
 *   2. Requests are considered in priority order: elderly > pwd > infant > general
 *   3. Ties within the same tier go to whoever has waited longest (oldest date)
 *   4/5. Only items present in the pools passed in are considered (callers are
 *        responsible for excluding already-matched or already-suggested items)
 */
function findBestPair(
  donations: Donation[],
  requests: HelpRequest[]
): { donation: Donation; request: HelpRequest } | null {
  const sortedRequests = [...requests].sort((a, b) => {
    const tierDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (tierDiff !== 0) return tierDiff
    // Oldest submission first (ascending date)
    return a.date.localeCompare(b.date)
  })

  for (const request of sortedRequests) {
    const eligibleDonations = donations
      .filter((d) => d.type === request.type)
      .sort((a, b) => a.date.localeCompare(b.date)) // oldest donation first

    if (eligibleDonations.length > 0) {
      return { donation: eligibleDonations[0], request }
    }
  }

  return null
}

export function MatchingQueueClient({ initialDonations, initialRequests }: { initialDonations: Donation[], initialRequests: HelpRequest[] }) {
  const router = useRouter()
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null)
  const [isMatching, setIsMatching] = useState(false)
  // IDs already offered as auto-match suggestions this round, so repeated
  // "Auto Match" clicks cycle through pairs instead of repeating the same one.
  const [autoSkipDonationIds, setAutoSkipDonationIds] = useState<Set<string>>(new Set())
  const [autoSkipRequestIds, setAutoSkipRequestIds] = useState<Set<string>>(new Set())
  const [autoMatchNotice, setAutoMatchNotice] = useState<string | null>(null)

  const selectDonation = (donation: Donation) => {
    setAutoMatchNotice(null)
    setAutoSkipDonationIds(new Set())
    setAutoSkipRequestIds(new Set())
    setSelectedDonation((prev) => (prev?.id === donation.id ? null : donation))
  }

  const selectRequest = (request: HelpRequest) => {
    setAutoMatchNotice(null)
    setAutoSkipDonationIds(new Set())
    setAutoSkipRequestIds(new Set())
    setSelectedRequest((prev) => (prev?.id === request.id ? null : request))
  }

  const handleAutoMatch = () => {
    setAutoMatchNotice(null)

    const availableDonations = initialDonations.filter((d) => !autoSkipDonationIds.has(d.id))
    const availableRequests = initialRequests.filter((r) => !autoSkipRequestIds.has(r.id))

    const best = findBestPair(availableDonations, availableRequests)

    if (!best) {
      setAutoMatchNotice('No eligible pairs left to suggest — try a manual match instead.')
      return
    }

    setSelectedDonation(best.donation)
    setSelectedRequest(best.request)
    setAutoSkipDonationIds((prev) => new Set(prev).add(best.donation.id))
    setAutoSkipRequestIds((prev) => new Set(prev).add(best.request.id))
  }

  const handleMatch = async () => {
    if (!selectedDonation || !selectedRequest) return
    setIsMatching(true)
    try {
      const supabaseService = getSupabaseService()
      await supabaseService.createMatch(selectedDonation.id, selectedRequest.id)
      setSelectedDonation(null)
      setSelectedRequest(null)
      setAutoSkipDonationIds(new Set())
      setAutoSkipRequestIds(new Set())
      setAutoMatchNotice(null)
      // Re-fetch the server component's data so the matched pair drops out
      // of the "Available"/"Pending" lists instead of lingering stale.
      router.refresh()
    } catch (e) {
      console.error(e)
      alert('Failed to confirm match')
    } finally {
      setIsMatching(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Matching Queue</h1>
          <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>Select a donation and a request to create a match, or let Auto Match suggest a pair.</p>
          {autoMatchNotice && (
            <p style={{ color: 'var(--kalamansi)', margin: '8px 0 0 0', fontSize: '13px' }}>{autoMatchNotice}</p>
          )}
        </div>

        <button
          onClick={handleAutoMatch}
          disabled={isMatching}
          style={{
            background: 'transparent',
            color: 'var(--kalamansi)',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            border: '1px solid var(--kalamansi)',
            cursor: isMatching ? 'not-allowed' : 'pointer',
            opacity: isMatching ? 0.5 : 1,
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          ✨ Auto Match
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', paddingBottom: '100px' }}>
        {/* Left Column: Pending Donations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Available Donations
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '99px', fontSize: '12px' }}>{initialDonations.length}</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {initialDonations.map(donation => {
              const isSelected = selectedDonation?.id === donation.id
              const isCash = donation.type === 'cash'
              return (
                <div 
                  key={donation.id} 
                  onClick={() => selectDonation(donation)}
                  style={{ 
                    background: isSelected ? 'rgba(199, 217, 77, 0.1)' : 'var(--bg-panel)',
                    border: `1px solid ${isSelected ? 'var(--kalamansi)' : 'var(--line)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)' }}>{donation.item}</div>
                    <span style={{ 
                      background: isCash ? 'rgba(143, 184, 168, 0.15)' : 'rgba(255,255,255,0.1)',
                      color: isCash ? 'var(--teal)' : 'var(--paper)',
                      padding: '4px 10px',
                      borderRadius: '99px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '1px'
                    }}>
                      {isCash ? 'CASH' : 'FOOD'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--paper-dim)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>Donor: {donation.donor}</span>
                    <span>Location: {donation.neighborhood}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Pending Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Pending Requests
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '99px', fontSize: '12px' }}>{initialRequests.length}</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {initialRequests.map(request => {
              const isSelected = selectedRequest?.id === request.id
              let priorityColor = 'var(--paper)'
              let priorityBg = 'rgba(255,255,255,0.1)'
              if (request.priority === 'elderly') { priorityColor = 'var(--kalamansi)'; priorityBg = 'rgba(199, 217, 77, 0.15)' }
              if (request.priority === 'pwd') { priorityColor = 'var(--jeepney)'; priorityBg = 'rgba(232, 84, 47, 0.15)' }
              if (request.priority === 'infant') { priorityColor = 'var(--teal)'; priorityBg = 'rgba(143, 184, 168, 0.15)' }

              return (
                <div 
                  key={request.id} 
                  onClick={() => selectRequest(request)}
                  style={{ 
                    background: isSelected ? 'rgba(199, 217, 77, 0.1)' : 'var(--bg-panel)',
                    border: `1px solid ${isSelected ? 'var(--kalamansi)' : 'var(--line)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--paper)' }}>{request.requestor}</div>
                    <span style={{ 
                      background: priorityBg,
                      color: priorityColor,
                      padding: '4px 10px',
                      borderRadius: '99px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {request.priority} - Tier 1
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--paper-dim)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>Needs: {request.need}</span>
                    <span>Location: {request.neighborhood}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Pair Bottom Shelf */}
      <div style={{
        position: 'fixed',
        bottom: (selectedDonation || selectedRequest) ? 0 : '-200px',
        left: '240px',
        right: 0,
        background: 'rgba(13, 26, 23, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--line)',
        padding: '24px 40px',
        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: 'var(--paper-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Selected Donation</div>
            {selectedDonation ? (
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--paper)' }}>{selectedDonation.item} <span style={{ color: 'var(--paper-dim)', fontWeight: 400 }}>from {selectedDonation.donor}</span></div>
            ) : (
              <div style={{ fontSize: '15px', color: 'var(--ink-soft)' }}>None selected</div>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--kalamansi)', opacity: 0.5 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: 'var(--paper-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Selected Request</div>
            {selectedRequest ? (
              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--paper)' }}>{selectedRequest.requestor} <span style={{ color: 'var(--paper-dim)', fontWeight: 400 }}>in {selectedRequest.neighborhood}</span></div>
            ) : (
              <div style={{ fontSize: '15px', color: 'var(--ink-soft)' }}>None selected</div>
            )}
          </div>
        </div>

        <button 
          onClick={handleMatch}
          disabled={!selectedDonation || !selectedRequest || isMatching}
          style={{ 
            background: 'var(--jeepney)', 
            color: 'white', 
            padding: '16px 32px', 
            borderRadius: '8px', 
            fontWeight: 600, 
            fontSize: '16px',
            border: 'none',
            cursor: (!selectedDonation || !selectedRequest || isMatching) ? 'not-allowed' : 'pointer',
            opacity: (!selectedDonation || !selectedRequest || isMatching) ? 0.5 : 1,
            boxShadow: (!selectedDonation || !selectedRequest || isMatching) ? 'none' : '0 4px 20px rgba(232, 84, 47, 0.4)',
            transition: 'all 0.2s'
          }}
        >
          {isMatching ? 'Processing...' : 'Confirm this match'}
        </button>
      </div>
    </div>
  )
}
