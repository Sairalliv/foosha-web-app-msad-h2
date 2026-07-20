'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Package, Banknote, MapPin, Calendar, PlusCircle, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/Modal'
import { HelpRequestForm } from '@/components/forms/HelpRequestForm'
import { NearbyMapPanel } from '@/components/dashboard/NearbyMapPanel'
import type { Donation, HelpRequest, PriorityTier, Profile } from '@/lib/supabase/types'

const TIER_LABELS: Record<PriorityTier, string> = {
  elderly: 'Elderly · Tier 1',
  pwd: 'PWD · Tier 1',
  infant: 'Infant / Young Child · Tier 1',
  general: 'General Household · Tier 2',
}

function ticketNumber(id: string) {
  return `FSH-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

// requests.status -> { chip modifier class, display label }.
// Note the 'matching' status value means "matched, ticket issued, awaiting
// pickup" here, so it's styled/labelled as such rather than reusing the
// (differently-meaning) `.status-chip.matching` class from globals.css.
const STATUS_DISPLAY: Record<HelpRequest['status'], { chipClass: string; label: string }> = {
  unmatched: { chipClass: 'unmatched', label: 'Matching' },
  matching: { chipClass: 'awaiting_pickup', label: 'Awaiting Pickup' },
  confirmed: { chipClass: 'confirmed', label: 'Confirmed' },
}

const CODE_LENGTH = 6

export function RecipientDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [requests, setRequests] = useState<HelpRequest[]>([])
  const [nearby, setNearby] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      setError('You need to be logged in to view your dashboard.')
      setIsLoading(false)
      return
    }

    setUserId(user.id)

    const [profileResult, requestsResult] = await Promise.all([
      supabase.from('profiles').select('id, full_name, barangay, avatar_url, role').eq('id', user.id).single(),
      // RLS on `requests` should already scope rows to the current recipient,
      // but we filter by recipient_id explicitly so the query is correct
      // even if RLS isn't enabled yet.
      supabase.from('requests').select('*').eq('recipient_id', user.id).order('created_at', { ascending: false }),
    ])

    if (profileResult.error) console.error('Failed to load profile:', profileResult.error)
    if (requestsResult.error) console.error('Failed to load requests:', requestsResult.error)

    const loadedProfile = profileResult.data ?? null
    setProfile(loadedProfile)
    setRequests(requestsResult.data ?? [])

    // Read-only "available nearby" catalog: open donations, optionally
    // narrowed to the recipient's own barangay when we know it.
    let nearbyQuery = supabase.from('donations').select('*').eq('status', 'Waiting').order('created_at', { ascending: false }).limit(6)
    if (loadedProfile?.barangay) {
      nearbyQuery = nearbyQuery.ilike('location', `%${loadedProfile.barangay}%`)
    }
    const { data: nearbyData, error: nearbyError } = await nearbyQuery
    if (nearbyError) console.error('Failed to load nearby donations:', nearbyError)
    setNearby(nearbyData ?? [])

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount
    loadData()
  }, [loadData])

  // ── Realtime: refresh the moment this recipient's requests change status
  // (e.g. system matches a request, or a pickup gets confirmed). ──────────
  useEffect(() => {
    if (!userId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`requests-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests', filter: `recipient_id=eq.${userId}` },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, loadData])

  // ── Realtime: also refresh when a match tied to one of this recipient's
  // requests changes (e.g. a match gets confirmed by the OTP flow below,
  // possibly from another device/tab). ───────────────────────────────────
  const activeRequestIds = useMemo(() => requests.map((r) => r.id).join(','), [requests])
  useEffect(() => {
    if (!activeRequestIds) return
    const supabase = createClient()

    const channel = supabase
      .channel(`matches-${activeRequestIds}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches', filter: `request_id=in.(${activeRequestIds})` },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeRequestIds, loadData])

  const handleCreated = (request: HelpRequest) => {
    setRequests((prev) => [request, ...prev])
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div className="panel" style={{ textAlign: 'center', color: 'var(--paper-dim)' }}>
        Loading your dashboard…
      </div>
    )
  }

  if (error) {
    return (
      <div className="panel" style={{ textAlign: 'center', color: '#ff8a63' }}>
        {error}
      </div>
    )
  }

  const householdName = profile?.full_name || 'Household'
  const initials = householdName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // The header shows the household's *current* flag: the highest-priority
  // tier across their active (non-confirmed) requests, defaulting to General.
  const activeRequests = requests.filter((r) => r.status !== 'confirmed')
  const headerTier: PriorityTier =
    (['elderly', 'pwd', 'infant'] as PriorityTier[]).find((tier) => activeRequests.some((r) => r.priority_tier === tier)) ?? 'general'

  // Status meanings, per the `requests.status` enum:
  //  - 'unmatched'  -> submitted, system is still searching for a match ("Currently Matching")
  //  - 'matching'   -> a match/ticket has been generated, waiting on pickup confirmation ("Awaiting Pickup")
  //  - 'confirmed'  -> pickup verified, request closed
  const awaitingPickup = requests.filter((r) => r.status === 'matching').length
  const currentlyMatching = requests.filter((r) => r.status === 'unmatched').length
  const confirmedAllTime = requests.filter((r) => r.status === 'confirmed').length

  return (
    <>
      {/* Header */}
      <div className="welcome-card relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-panel), #3a221e)' }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-jeepney/20 rounded-full blur-3xl"></div>
        <div className="welcome-text relative z-10">
          <div className="eyebrow text-jeepney">Assistance Dashboard</div>
          <h1 className="text-4xl font-display mb-2">Kamusta, {householdName}</h1>
          <p className="sub text-paper-dim" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`priority-tag ${headerTier}`}>{TIER_LABELS[headerTier]}</span>
            We are here to help. Request assistance when you need it.
          </p>
        </div>
        <div className="welcome-avatar relative z-10 border-2 border-jeepney">{initials || 'R'}</div>
      </div>

      {/* Stats */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '28px' }}>
        <div className="stat-card">
          <div className="num">{awaitingPickup}</div>
          <div className="lbl">Awaiting Pickup</div>
        </div>
        <div className="stat-card">
          <div className="num">{currentlyMatching}</div>
          <div className="lbl">Currently Matching</div>
        </div>
        <div className="stat-card">
          <div className="num">{confirmedAllTime}</div>
          <div className="lbl">Confirmed (All-Time)</div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="panel"
        style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
      >
        <div>
          <h3 className="text-jeepney mb-2">Need assistance?</h3>
          <p className="sub" style={{ marginTop: '4px' }}>
            Submit a new request for food or cash assistance and we&apos;ll connect you with a verified donor.
          </p>
        </div>
        <button className="btn" style={{ background: 'var(--jeepney)', color: 'white' }} onClick={() => setShowForm(true)}>
          <PlusCircle size={16} /> Request Help
        </button>
      </div>

      {/* Active requests */}
      <div style={{ marginTop: '32px' }}>
        <div className="panel-head">
          <h3>Your Requests</h3>
          <span className="meta">{activeRequests.length} active</span>
        </div>
        {requests.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', color: 'var(--paper-dim)' }}>
            No requests yet. Tap &quot;Request Help&quot; when your household needs assistance.
          </div>
        ) : (
          <div className="panel" style={{ padding: '4px 26px' }}>
            {requests.map((r) => (
              <div key={r.id} className="row-item">
                <div>
                  <div className="name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {r.type === 'food' ? <Package size={15} /> : <Banknote size={15} />}
                    {r.type === 'cash' ? (r.amount ? `₱${r.amount.toLocaleString()} needed` : 'Cash assistance') : r.description}
                    <span className="id-cell" style={{ marginLeft: '4px' }}>
                      {ticketNumber(r.id)}
                    </span>
                  </div>
                  <div className="meta" style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
                    {r.type === 'food' && (r.category || r.amount != null) && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {/* Removed icon to match edit request */}
                        {r.category}
                        {r.category && r.amount != null ? ' · ' : ''}
                        {r.amount != null ? `Qty ${r.amount}` : ''}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {r.address}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    <span className={`priority-tag ${r.priority_tier}`}>{TIER_LABELS[r.priority_tier]}</span>
                  </div>
                </div>
                <span className={`status-chip ${STATUS_DISPLAY[r.status].chipClass}`}>{STATUS_DISPLAY[r.status].label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm pickup + nearby preview */}
      <div className="grid-2" style={{ marginTop: '32px' }}>
        <ConfirmPickupModule onConfirmed={loadData} />

        <div>
          <h3 style={{ marginBottom: '16px' }}>Available Nearby</h3>
          <div className="panel">
            {nearby.length === 0 ? (
              <p className="sub" style={{ margin: 0 }}>
                No open donations nearby right now — check back soon.
              </p>
            ) : (
              nearby.map((d) => (
                <div key={d.id} className="listing-card">
                  <div className="listing-top">
                    <div>
                      <div className="name">{d.type === 'cash' ? `₱${(d.amount ?? 0).toLocaleString()} cash pledge` : d.description}</div>
                      <div className="from">{d.location}</div>
                    </div>
                    <span className={`kind-badge ${d.type}`}>{d.type}</span>
                  </div>
                </div>
              ))
            )}
            <p style={{ fontSize: '11.5px', color: 'var(--paper-dim)', marginTop: '12px' }}>
              This list is informational only — matching to your requests is handled automatically by the system.
            </p>
          </div>
        </div>
      </div>

      {/* Donation map */}
      <NearbyMapPanel
        title="Find Help Nearby"
        subtitle="Donation centers, pantries, and NGOs across Cebu you can walk in to."
      />

      {showForm && userId && (
        <Modal onClose={() => setShowForm(false)}>
          <HelpRequestForm recipientId={userId} onCancel={() => setShowForm(false)} onCreated={handleCreated} />
        </Modal>
      )}
    </>
  )
}

// ──────────────────────────────────────────────────────────────────
// Confirm Pickup Module
//
// The recipient types in the 6-character verification code printed on
// their match ticket. Verification is delegated to a Postgres RPC
// function so the three-table cascade (matches -> donations -> requests)
// happens as a single atomic transaction rather than sequential client
// updates, which could race or partially fail.
//
// Expected Supabase function (create via SQL editor / migration):
//
//   create or replace function confirm_pickup(p_verification_code text)
//   returns void
//   language plpgsql
//   security definer
//   as $$
//   declare
//     v_match matches%rowtype;
//   begin
//     select * into v_match from matches
//       where verification_code = p_verification_code and status = 'pending'
//       for update;
//
//     if not found then
//       raise exception 'Invalid or already-used verification code';
//     end if;
//
//     update matches   set status = 'confirmed' where id = v_match.id;
//     update donations  set status = 'Given'     where id = v_match.donation_id;
//     update requests   set status = 'confirmed' where id = v_match.request_id;
//   end;
//   $$;
//
// ──────────────────────────────────────────────────────────────────
function ConfirmPickupModule({ onConfirmed }: { onConfirmed: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const code = digits.join('')
  const isComplete = code.length === CODE_LENGTH

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1).toUpperCase()
    setDigits((prev) => {
      const next = [...prev]
      next[index] = char
      return next
    })
    setError('')
    if (char && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    let errorMsg = ''
    try {
      const { confirmPickupByCodeAction } = await import('@/actions/dashboard-actions')
      await confirmPickupByCodeAction(code)
    } catch (e: any) {
      errorMsg = e.message
    }

    setIsSubmitting(false)

    if (errorMsg) {
      console.error(errorMsg)
      setError('That code is invalid or has already been used. Double-check your ticket and try again.')
      return
    }

    setSuccess(true)
    setDigits(Array(CODE_LENGTH).fill(''))
    onConfirmed()
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Confirm Pickup</h3>
      <div className="panel confirm-wrap">
        <p className="confirm-helper" style={{ marginBottom: 0 }}>
          Enter the {CODE_LENGTH}-digit code from your match ticket to confirm you received your assistance.
        </p>

        {success ? (
          <div className="confirmed-badge" style={{ margin: '20px auto 0' }}>
            <ShieldCheck size={16} /> Pickup confirmed — thank you!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="code-entry">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el
                  }}
                  className="code-box"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  inputMode="text"
                  autoComplete="off"
                />
              ))}
            </div>
            {error && (
              <div className="error-text" style={{ textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-block"
              style={{ background: 'var(--kalamansi)', color: 'var(--bg-deep)', marginTop: '16px' }}
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? 'Verifying…' : 'Confirm Pickup'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
