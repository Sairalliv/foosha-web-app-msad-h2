'use client'

import React, { useActionState, useState } from 'react'
import { createHelpRequestAction } from '@/actions/dashboard-actions'

const initialState = {
  error: '',
  success: false,
  message: '',
}

export function HelpRequestForm({ onCancel }: { onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await createHelpRequestAction(formData)
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
        <h3 className="text-xl font-semibold text-primary mb-2">Request Submitted</h3>
        <p className="mb-6">{state.message}</p>
        <button className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }} onClick={onCancel}>
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Request Assistance</h2>
      <p className="mb-6 opacity-80">Submit your request below and we will connect you with available support.</p>

      {state.error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4 text-sm">{state.error}</div>}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium">Assistance Type *</label>
          <select id="type" name="type" required className="p-2 border rounded" style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}>
            <option value="">Select type...</option>
            <option value="food">Food & Groceries</option>
            <option value="cash">Financial Aid</option>
            <option value="medical">Medical Assistance</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="reason" className="text-sm font-medium">Reason for Request *</label>
          <textarea 
            id="reason" 
            name="reason" 
            required 
            rows={3} 
            placeholder="Please briefly explain your situation..." 
            className="p-2 border rounded"
            style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="familySize" className="text-sm font-medium">Family Size</label>
          <input 
            type="number" 
            id="familySize" 
            name="familySize" 
            placeholder="Number of dependents" 
            min="1"
            className="p-2 border rounded" 
            style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'transparent', color: 'inherit' }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address" className="text-sm font-medium">Delivery Address *</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            required
            placeholder="Complete address in Mandaue City" 
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
            {isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
