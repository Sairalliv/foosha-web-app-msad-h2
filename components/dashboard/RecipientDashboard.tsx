'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { HelpRequestForm } from '@/components/forms/HelpRequestForm'

export function RecipientDashboard({ displayName, initials }: { displayName: string; initials: string }) {
  const [showRequestForm, setShowRequestForm] = useState(false)

  return (
    <>
      <div className="welcome-card relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-panel), #3a221e)' }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-jeepney/20 rounded-full blur-3xl"></div>
        <div className="welcome-text relative z-10">
          <div className="eyebrow text-jeepney">Assistance Dashboard</div>
          <h1 className="text-4xl font-display mb-2">Welcome back, {displayName.split(' ')[0]}</h1>
          <p className="sub text-paper-dim">We are here to help. Request assistance when you need it.</p>
        </div>
        <div className="welcome-avatar relative z-10 border-2 border-jeepney">{initials || 'R'}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 mt-8">
        <div className="panel flex-1 bg-[var(--bg-panel)] border border-[var(--line)]">
          <h3 className="text-xl font-display text-jeepney mb-2">Need Assistance?</h3>
          <p className="sub mb-6 text-paper-dim">
            Submit a new request for food, cash, or medical assistance and we'll connect you with a verified donor.
          </p>
          <button 
            className="btn w-full md:w-auto" 
            style={{ background: 'var(--jeepney)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: 'bold' }}
            onClick={() => setShowRequestForm(true)}
          >
            + Request Help
          </button>
        </div>

        <div className="panel flex-1 bg-[var(--bg-panel)] border border-[var(--line)] flex flex-col justify-center items-center text-center">
          <div className="text-4xl font-bold text-paper mb-2">1</div>
          <div className="text-sm uppercase tracking-wider text-paper-dim">Active Request</div>
        </div>
      </div>

      <h3 className="text-2xl font-display mb-4">Your Requests</h3>
      <div className="panel bg-[var(--bg-panel)] border border-[var(--line)] p-0 overflow-hidden">
        <div className="divide-y divide-[var(--line)]">
          {[
            { type: 'Food & Groceries', reason: 'Family of 4 needs weekly supplies', date: '2 days ago', status: 'In Progress', color: 'text-amber-400' },
            { type: 'Medical Assistance', reason: 'Prescription medicines needed', date: '1 month ago', status: 'Fulfilled', color: 'text-teal' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div>
                <div className="font-semibold">{item.type}</div>
                <div className="text-sm text-paper-dim">{item.reason}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${item.color}`}>{item.status}</div>
                <div className="text-xs text-paper-dim">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRequestForm && (
        <Modal onClose={() => setShowRequestForm(false)}>
          <HelpRequestForm onCancel={() => setShowRequestForm(false)} />
        </Modal>
      )}
    </>
  )
}
