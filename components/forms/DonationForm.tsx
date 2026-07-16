'use client'

import React, { useActionState, useState } from 'react'
import { createDonationAction } from '@/actions/dashboard-actions'

const initialState = {
  error: '',
  success: false,
  message: '',
}

export function DonationForm({ onCancel }: { onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await createDonationAction(formData)
      if (res?.error) {
        return { error: res.error, success: false, message: '' }
      }
      return { success: true, message: res.message || '', error: '' }
    },
    initialState
  )

  if (state.success) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-primary mb-2">Success!</h3>
        <p className="mb-6">{state.message}</p>
        <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }} onClick={onCancel}>
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Make a Donation</h2>
      <p className="mb-6 opacity-80">Your contribution helps us provide essential support to the community.</p>

      {state.error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">{state.error}</div>}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium">Donation Type *</label>
          <select id="type" name="type" required className="p-2 border rounded" style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}>
            <option value="">Select type...</option>
            <option value="food">Food Supplies</option>
            <option value="cash">Financial Contribution</option>
            <option value="supplies">Other Supplies (Medical, Clothing)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium">Amount or Quantity *</label>
          <input 
            type="text" 
            id="amount" 
            name="amount" 
            required 
            placeholder="e.g. 50 packs of rice, or 1000 PHP" 
            className="p-2 border rounded" 
            style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pickup" className="text-sm font-medium">Pickup/Delivery Address (Optional)</label>
          <input 
            type="text" 
            id="pickup" 
            name="pickup" 
            placeholder="Where should we pick this up?" 
            className="p-2 border rounded" 
            style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            rows={3} 
            placeholder="Any other details..." 
            className="p-2 border rounded"
            style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-ghost" 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className="btn"
            style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? 'Submitting...' : 'Confirm Donation'}
          </button>
        </div>
      </form>
    </div>
  )
}
