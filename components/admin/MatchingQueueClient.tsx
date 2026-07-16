'use client'

import React, { useState } from 'react'
import { supabaseService } from '@/lib/supabaseService'

type Donation = any
type Request = any

export function MatchingQueueClient({ initialDonations, initialRequests }: { initialDonations: Donation[], initialRequests: Request[] }) {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [isMatching, setIsMatching] = useState(false)

  const handleMatch = async () => {
    if (!selectedDonation || !selectedRequest) return
    setIsMatching(true)
    try {
      await supabaseService.createMatch(selectedDonation.id, selectedRequest.id)
      alert('Match confirmed successfully!')
      setSelectedDonation(null)
      setSelectedRequest(null)
      // In a real app, you would refresh the data here.
    } catch (e) {
      console.error(e)
      alert('Failed to confirm match')
    } finally {
      setIsMatching(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', height: '100%', position: 'relative' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Matching Queue</h1>
        <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>Select a donation and a request to create a match.</p>
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
              const isCash = donation.item.toLowerCase().includes('cash')
              return (
                <div 
                  key={donation.id} 
                  onClick={() => setSelectedDonation(donation)}
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
                  onClick={() => setSelectedRequest(request)}
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
