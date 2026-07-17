'use client'

import React, { useState } from 'react'
import { Package, Banknote } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Donation, DonationType } from '@/lib/supabase/types'

interface DonationFormProps {
  /** auth.users.id of the signed-in donor, used to scope the insert */
  donorId: string
  onCancel: () => void
  /** Called with the newly-inserted row so the parent can update local state */
  onCreated: (donation: Donation) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid rgba(0,0,0,0.15)',
  background: 'transparent',
  color: 'inherit',
  fontSize: '14px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  opacity: 0.75,
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
        Make a Donation
      </h2>
      <p className="mb-6 opacity-70 text-sm">Your contribution goes straight to a family in Mandaue City.</p>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Type toggle */}
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.04)', padding: '6px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setType('food')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: type === 'food' ? 'var(--primary)' : 'transparent',
              color: type === 'food' ? 'white' : 'inherit',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Package size={16} /> Food
          </button>
          <button
            type="button"
            onClick={() => setType('cash')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: type === 'cash' ? 'var(--primary)' : 'transparent',
              color: type === 'cash' ? 'white' : 'inherit',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Banknote size={16} /> Cash
          </button>
        </div>

        {type === 'food' ? (
          <div className="flex flex-col gap-1">
            <label htmlFor="description" style={labelStyle}>
              Item Details *
            </label>
            <textarea
              id="description"
              rows={3}
              required
              placeholder="e.g. rice, canned goods, instant noodles"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label htmlFor="amount" style={labelStyle}>
              Amount (₱) *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6, fontWeight: 600 }}>
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
                style={{ ...inputStyle, paddingLeft: '28px' }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="location" style={labelStyle}>
            Barangay / Location *
          </label>
          <input
            id="location"
            type="text"
            required
            placeholder="e.g. Barangay Basak, Mandaue City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{ padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', color: 'inherit' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '10px 18px',
              borderRadius: '6px',
              fontWeight: 600,
              border: 'none',
              cursor: !isValid || isSubmitting ? 'not-allowed' : 'pointer',
              opacity: !isValid || isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? 'Submitting…' : 'Confirm Donation'}
          </button>
        </div>
      </form>
    </div>
  )
}
