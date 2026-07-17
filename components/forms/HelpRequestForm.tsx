'use client'

import React, { useState } from 'react'
import { Package, Banknote } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { HelpRequest, PriorityTier, RequestType } from '@/lib/supabase/types'

interface HelpRequestFormProps {
  /** auth.users.id of the signed-in recipient, used to scope the insert */
  recipientId: string
  onCancel: () => void
  /** Called with the newly-inserted row so the parent can update local state */
  onCreated: (request: HelpRequest) => void
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

// Vulnerability checkboxes -> priority_tier. When more than one box is
// checked, the most vulnerable flag wins: elderly > pwd > infant > general.
const VULNERABILITY_OPTIONS: { key: Exclude<PriorityTier, 'general'>; label: string }[] = [
  { key: 'elderly', label: 'Household includes elderly (60+)' },
  { key: 'pwd', label: 'PWD (Person with Disability)' },
  { key: 'infant', label: 'Infant / young child' },
]
const TIER_PRIORITY: PriorityTier[] = ['elderly', 'pwd', 'infant', 'general']

function computeTier(flags: Record<string, boolean>): PriorityTier {
  return TIER_PRIORITY.find((tier) => flags[tier]) ?? 'general'
}

export function HelpRequestForm({ recipientId, onCancel, onCreated }: HelpRequestFormProps) {
  const [type, setType] = useState<RequestType>('food')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('') // optional even for cash requests
  const [address, setAddress] = useState('')
  const [flags, setFlags] = useState<Record<string, boolean>>({ elderly: false, pwd: false, infant: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const priorityTier = computeTier(flags)
  const isValid = address.trim().length > 0 && (type === 'food' ? description.trim().length > 0 : true)

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
        Request Assistance
      </h2>
      <p className="mb-6 opacity-70 text-sm">Submit your request and we&apos;ll connect you with a verified donor.</p>

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
              What does your household need? *
            </label>
            <textarea
              id="description"
              rows={3}
              required
              placeholder="e.g. rice, canned goods, powdered milk"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label htmlFor="amount" style={labelStyle}>
              Amount needed (₱, optional)
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
                placeholder="Leave blank if any amount helps"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '28px' }}
              />
            </div>
          </div>
        )}

        {/* Vulnerability checkboxes -> priority_tier */}
        <div className="flex flex-col gap-2">
          <label style={labelStyle}>Household situation</label>
          {VULNERABILITY_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.12)',
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              <input type="checkbox" checked={flags[opt.key]} onChange={() => toggleFlag(opt.key)} style={{ width: 'auto' }} />
              {opt.label}
            </label>
          ))}
          <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}>
            Priority tier for this request: <strong>{priorityTier}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" style={labelStyle}>
            Pickup / Delivery Address *
          </label>
          <input
            id="address"
            type="text"
            required
            placeholder="Complete address in Mandaue City"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            {isSubmitting ? 'Submitting…' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
