'use client'

import React, { useState } from 'react'
import { Package, Banknote, MapPin, Tag } from 'lucide-react'
import type { Donation, DonationType } from '@/lib/supabase/types'
import { FOOD_CATEGORIES } from '@/lib/constants/foodCategories'
import { createDonationAction } from '@/actions/donation-actions'

interface DonationFormProps {
  /** auth.users.id of the signed-in donor, used to scope the insert */
  donorId: string
  onCancel: () => void
  /** Called with the newly-inserted row so the parent can update local state */
  onCreated: (donation: Donation) => void
}

export function DonationForm({ donorId: _donorId, onCancel, onCreated }: DonationFormProps) {
  const [type, setType] = useState<DonationType>('food')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [location, setLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleTypeChange = (nextType: DonationType) => {
    setType(nextType)
    // Fields mean different things per type (quantity vs. peso amount,
    // food category doesn't apply to cash) — clear them on switch so a
    // leftover value can't get submitted under the wrong meaning.
    setCategory('')
    setDescription('')
    setAmount('')
  }

  const isValid =
    location.trim().length > 0 &&
    Number(amount) > 0 &&
    (type === 'food' ? description.trim().length > 0 && category.trim().length > 0 : true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await createDonationAction({
        type,
        category: type === 'food' ? category : null,
        description: type === 'food' ? description.trim() : null,
        quantity: type === 'food' ? Number(amount) : null,
        amount: type === 'cash' ? Number(amount) : null,
        location: location.trim(),
      })

      setIsSubmitting(false)

      if (!response.success || !response.data) {
        setError(response.error || 'Something went wrong while submitting your donation. Please try again.')
        return
      }

      onCreated(response.data)
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
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
              onClick={() => handleTypeChange('food')}
              className={type === 'food' ? 'active' : ''}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Package size={16} /> Food
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('cash')}
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
            <>
              <div className="field">
                <label htmlFor="category">Category *</label>
                <div className="input-icon-wrap">
                  <Tag size={16} />
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {FOOD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="amount">Amount *</label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="e.g. 5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="type-toggle-caption" style={{ margin: '6px 0 0' }}>
                  Number of kilos, packs, or sacks — whichever unit makes sense for this item.
                </p>
              </div>

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
            </>
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
