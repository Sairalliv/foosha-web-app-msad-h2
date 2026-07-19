'use client'

import React, { useState } from 'react'
import { Package, Banknote, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Donation, DonationType } from '@/lib/supabase/types'

interface DonationFormProps {
  /** auth.users.id of the signed-in donor, used to scope the insert */
  donorId: string
  onCancel: () => void
  /** Called with the newly-inserted row so the parent can update local state */
  onCreated: (donation: Donation) => void
}

export function DonationForm({ donorId, onCancel, onCreated }: DonationFormProps) {
  const [type, setType] = useState<DonationType>('food')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [location, setLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isValid =
    location.trim().length > 0 &&
    (type === 'food' ? description.trim().length > 0 : Number(amount) > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    const supabase = createClient()

    // Re-confirm the active session so donor_id matches auth.uid() for RLS,
    // rather than trusting the donorId prop alone.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== donorId) {
      setError('Your session has expired. Please log in again.')
      setIsSubmitting(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('donations')
      .insert({
        donor_id: user.id,
        type,
        description: type === 'food' ? description.trim() : null,
        amount: type === 'cash' ? Number(amount) : null,
        location: location.trim(),
        status: 'Waiting', // all new submissions start out unconfirmed
      })
      .select()
      .single()

    setIsSubmitting(false)

    if (insertError || !data) {
      console.error(insertError)
      setError('Something went wrong while submitting your donation. Please try again.')
      return
    }

    onCreated(data as Donation)
  }

  return (
    <div>
      <div className="modal-header jeepney-theme">
        <div className="icon-badge">
          <Package size={20} />
        </div>
        <div className="eyebrow">Foosha · Give</div>
        <h2>Make a Donation</h2>
        <p className="sub">Your contribution goes straight to a family in Cebu City.</p>
      </div>

      <div className="modal-body">
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Type toggle */}
          <div className="type-toggle" style={{ marginBottom: '20px', maxWidth: 'none' }}>
            <button
              type="button"
              onClick={() => setType('food')}
              className={type === 'food' ? 'active' : ''}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Package size={16} /> Food
            </button>
            <button
              type="button"
              onClick={() => setType('cash')}
              className={type === 'cash' ? 'active' : ''}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Banknote size={16} /> Cash
            </button>
          </div>
          <p className="type-toggle-caption">
            {type === 'food'
              ? 'Non-perishable items work best — they stay safe until pickup is confirmed.'
              : 'Cash donations are pooled and released once a match is confirmed.'}
          </p>

          {type === 'food' ? (
            <div className="field">
              <label htmlFor="description">Item Details *</label>
              <textarea
                id="description"
                rows={3}
                required
                placeholder="e.g. rice, canned goods, instant noodles"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="amount">Amount (₱) *</label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--paper-dim)',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    pointerEvents: 'none',
                  }}
                >
                  ₱
                </span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ paddingLeft: '30px' }}
                />
              </div>
            </div>
          )}

          <div className="field">
            <label htmlFor="location">Barangay / Location *</label>
            <div className="input-icon-wrap">
              <MapPin size={16} />
              <input
                id="location"
                type="text"
                required
                placeholder="e.g. Barangay Basak, Cebu City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Confirm Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
