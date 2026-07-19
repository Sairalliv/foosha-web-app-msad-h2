'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Package, Banknote, MapPin, Calendar, PlusCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getSupabaseService } from '@/lib/supabaseService.client'
import { Modal } from '@/components/ui/Modal'
import { DonationForm } from '@/components/forms/DonationForm'
import { NearbyMapPanel } from '@/components/dashboard/NearbyMapPanel'
import type { Donation, Profile } from '@/lib/supabase/types'
import type { LeaderboardEntry } from '@/lib/supabaseService'

export function DonorDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')

    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      setError('You need to be logged in to view your donor dashboard.')
      setIsLoading(false)
      return
    }

    setUserId(user.id)

    // RLS on `donations` should already scope rows to the current donor,
    // but we filter by donor_id explicitly so the query is correct even
    // if RLS isn't enabled yet.
    const [profileResult, donationsResult, leaderboardResult] = await Promise.all([
      supabase.from('profiles').select('id, full_name, barangay, avatar_url, role').eq('id', user.id).single(),
      supabase.from('donations').select('*').eq('donor_id', user.id).order('created_at', { ascending: false }),
      getSupabaseService().getLeaderboard().catch((err) => {
        console.error('Failed to load leaderboard:', err)
        return [] as LeaderboardEntry[]
      }),
    ])

    if (profileResult.error) console.error('Failed to load profile:', profileResult.error)
    if (donationsResult.error) console.error('Failed to load donations:', donationsResult.error)

    setProfile(profileResult.data ?? null)
    setDonations(donationsResult.data ?? [])
    setLeaderboard(leaderboardResult)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional data fetch on mount
    loadData()
  }, [loadData])

  const handleCreated = (donation: Donation) => {
    setDonations((prev) => [donation, ...prev])
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

  const displayName = profile?.full_name || 'Donor'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const activeDonations = donations.filter((d) => d.status === 'Waiting')
  const givenDonations = donations.filter((d) => d.status === 'Given')
  const totalGiven = givenDonations
    .filter((d) => d.type === 'cash')
    .reduce((sum, d) => sum + (d.amount ?? 0), 0)
  const myLeaderboardEntry = leaderboard.find((entry) => entry.donorId === userId)

  return (
    <>
      {/* Header */}
      <div className="welcome-card relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-panel), #1e3a33)' }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="welcome-text relative z-10">
          <div className="eyebrow text-kalamansi">Donor Dashboard</div>
          <h1 className="text-4xl font-display mb-2">Welcome back, {displayName.split(' ')[0]}</h1>
          <p className="sub text-paper-dim">
            {profile?.barangay ? `Brgy. ${profile.barangay} · ` : ''}
            Thank you for helping make Cebu City a better place.
          </p>
        </div>
        <div className="welcome-avatar relative z-10 border-2 border-primary">{initials || 'D'}</div>
      </div>

      {/* Stats */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '28px' }}>
        <div className="stat-card">
          <div className="num">₱{totalGiven.toLocaleString()}</div>
          <div className="lbl">Total Given</div>
        </div>
        <div className="stat-card">
          <div className="num">{givenDonations.length}</div>
          <div className="lbl">Matches Confirmed</div>
        </div>
        <div className="stat-card">
          <div className="num">{myLeaderboardEntry ? `#${myLeaderboardEntry.rank}` : '—'}</div>
          <div className="lbl">City Leaderboard Rank</div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="panel"
        style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}
      >
        <div>
          <h3 className="text-kalamansi mb-2">Ready to contribute?</h3>
          <p className="sub" style={{ marginTop: '4px' }}>
            Every donation counts, whether it&apos;s food or a cash pledge.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <PlusCircle size={16} /> Make a Donation
        </button>
      </div>

      {/* Active donations */}
      <div style={{ marginTop: '32px' }}>
        <div className="panel-head">
          <h3>Active Donations</h3>
          <span className="meta">{activeDonations.length} waiting</span>
        </div>
        {activeDonations.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', color: 'var(--paper-dim)' }}>
            No active donations right now.
          </div>
        ) : (
          <div className="panel" style={{ padding: '4px 26px' }}>
            {activeDonations.map((d) => (
              <div key={d.id} className="row-item">
                <div>
                  <div className="name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {d.type === 'food' ? <Package size={15} /> : <Banknote size={15} />}
                    {d.type === 'cash' ? `₱${(d.amount ?? 0).toLocaleString()}` : d.description}
                  </div>
                  <div className="meta" style={{ display: 'flex', gap: '14px', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {d.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {new Date(d.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className="status-chip awaiting_pickup">Waiting</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation map */}
      <NearbyMapPanel
        title="Donation Map"
        subtitle="See where donation centers, pantries, and NGOs across Cebu are located."
      />

      {/* History + Leaderboard */}
      <div className="grid-2" style={{ marginTop: '32px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Donation History</h3>
          {donations.length === 0 ? (
            <div className="panel" style={{ textAlign: 'center', color: 'var(--paper-dim)' }}>
              No donations yet. Thank you for considering helping out!
            </div>
          ) : (
            <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <span className={`kind-badge ${d.type}`}>
                          {d.type === 'food' ? <Package size={11} /> : <Banknote size={11} />} {d.type}
                        </span>
                      </td>
                      <td>{d.type === 'cash' ? `₱${(d.amount ?? 0).toLocaleString()}` : d.description}</td>
                      <td className="id-cell">{new Date(d.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-chip ${d.status === 'Given' ? 'confirmed' : 'awaiting_pickup'}`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: '16px' }}>City Leaderboard</h3>
          <div className="panel">
            {leaderboard.length === 0 ? (
              <p className="sub" style={{ margin: 0 }}>
                No confirmed cash donations yet — be the first on the board!
              </p>
            ) : (
              <div className="leader-list" style={{ marginTop: 0 }}>
                {leaderboard.map((entry) => (
                  <div key={entry.rank} className={`lrow ${entry.donorId === userId ? 'you' : ''}`}>
                    <div className="rk">{entry.rank}</div>
                    <div className="nm">{entry.donorId === userId ? 'You' : entry.name}</div>
                    <div className="pt">{entry.amount}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && userId && (
        <Modal onClose={() => setShowForm(false)}>
          <DonationForm donorId={userId} onCancel={() => setShowForm(false)} onCreated={handleCreated} />
        </Modal>
      )}
    </>
  )
}
