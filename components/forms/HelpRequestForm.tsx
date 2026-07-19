'use client'

import React, { useState } from 'react'
import { Package, Banknote, HandHeart, CircleUserRound, Accessibility, Baby, Check, MapPin, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { HelpRequest, PriorityTier, RequestType } from '@/lib/supabase/types'
import { FOOD_CATEGORIES } from '@/lib/constants/foodCategories'

interface HelpRequestFormProps {
  /** auth.users.id of the signed-in recipient, used to scope the insert */
  recipientId: string
  onCancel: () => void
  /** Called with the newly-inserted row so the parent can update local state */
  onCreated: (request: HelpRequest) => void
}

// Vulnerability checkboxes -> priority_tier. When more than one box is
// checked, the most vulnerable flag wins: elderly > pwd > infant > general.
const VULNERABILITY_OPTIONS: { key: Exclude<PriorityTier, 'general'>; label: string; icon: typeof CircleUserRound }[] = [
  { key: 'elderly', label: 'Household includes elderly (60+)', icon: CircleUserRound },
  { key: 'pwd', label: 'PWD (Person with Disability)', icon: Accessibility },
  { key: 'infant', label: 'Infant / young child', icon: Baby },
]
const TIER_PRIORITY: PriorityTier[] = ['elderly', 'pwd', 'infant', 'general']
const TIER_LABELS: Record<PriorityTier, string> = {
  elderly: 'Elderly · Tier 1',
  pwd: 'PWD · Tier 1',
  infant: 'Infant / Young Child · Tier 1',
  general: 'General Household · Tier 2',
}

function computeTier(flags: Record<string, boolean>): PriorityTier {
  return TIER_PRIORITY.find((tier) => flags[tier]) ?? 'general'
}

export function HelpRequestForm({ recipientId, onCancel, onCreated }: HelpRequestFormProps) {
  const [type, setType] = useState<RequestType>('food')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('') // required quantity for food, optional peso amount for cash
  const [address, setAddress] = useState('')
  const [flags, setFlags] = useState<Record<string, boolean>>({ elderly: false, pwd: false, infant: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const priorityTier = computeTier(flags)
  const isValid =
    address.trim().length > 0 &&
    (type === 'food' ? description.trim().length > 0 && category.trim().length > 0 && Number(amount) > 0 : true)

  const handleTypeChange = (nextType: RequestType) => {
    setType(nextType)
    // Fields mean different things per type (quantity vs. peso amount,
    // food category doesn't apply to cash) — clear them on switch so a
    // leftover value can't get submitted under the wrong meaning.
    setCategory('')
    setDescription('')
    setAmount('')
  }

  const toggleFlag = (key: string) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    const supabase = createClient()

    // Re-confirm the active session so recipient_id matches auth.uid() for
    // RLS, rather than trusting the recipientId prop alone.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || user.id !== recipientId) {
      setError('Your session has expired. Please log in again.')
      setIsSubmitting(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('requests')
      .insert({
        recipient_id: user.id,
        type,
        category: type === 'food' ? category : null,
        description: type === 'food' ? description.trim() : null,
        amount: amount.trim() ? Number(amount) : null,
        priority_tier: priorityTier,
        address: address.trim(),
        status: 'unmatched', // the system picks this up for matching
      })
      .select()
      .single()

    setIsSubmitting(false)

    if (insertError || !data) {
      console.error(insertError)
      setError('Something went wrong while submitting your request. Please try again.')
      return
    }

    onCreated(data as HelpRequest)
  }

  return (
    <div>
      <div className="modal-header kalamansi-theme">
        <div className="icon-badge">
          <HandHeart size={20} />
        </div>
        <div className="eyebrow">Foosha · Request</div>
        <h2>Request Assistance</h2>
        <p className="sub">Submit your request and we&apos;ll connect you with a verified donor.</p>
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
              ? 'Tell us what food items your household needs.'
              : 'Cash requests are reviewed the same way and matched with a verified donor.'}
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
                <label htmlFor="amount">Amount Needed *</label>
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
                <label htmlFor="description">What does your household need? *</label>
                <textarea
                  id="description"
                  rows={3}
                  required
                  placeholder="e.g. rice, canned goods, powdered milk"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="field">
              <label htmlFor="amount">Amount needed (₱, optional)</label>
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
                  placeholder="Leave blank if any amount helps"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ paddingLeft: '30px' }}
                />
              </div>
            </div>
          )}

          {/* Vulnerability checkboxes -> priority_tier */}
          <div className="field">
            <label>Household situation</label>
            <div className="vuln-grid">
              {VULNERABILITY_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const isSelected = flags[opt.key]
                return (
                  <label key={opt.key} className={`vuln-chip${isSelected ? ' selected' : ''}`}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleFlag(opt.key)} />
                    <span className="vuln-icon"><Icon size={17} /></span>
                    <span className="vuln-label">{opt.label}</span>
                    <span className="vuln-check">{isSelected && <Check size={13} strokeWidth={3} />}</span>
                  </label>
                )
              })}
            </div>
            <p className="tier-note">
              Priority tier for this request:
              <span className={`priority-tag ${priorityTier}`}>{TIER_LABELS[priorityTier]}</span>
            </p>
          </div>

          <div className="field">
            <label htmlFor="address">Pickup / Delivery Address *</label>
            <div className="input-icon-wrap">
              <MapPin size={16} />
              <input
                id="address"
                type="text"
                required
                placeholder="Complete address in Cebu City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
