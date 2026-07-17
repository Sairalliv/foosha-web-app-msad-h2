'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { DonationForm } from '@/components/forms/DonationForm'

export function DonorDashboard({ displayName, initials }: { displayName: string; initials: string }) {
  const [showDonationForm, setShowDonationForm] = useState(false)

  return (
    <>
      <div className="welcome-card relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-panel), #1e3a33)' }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="welcome-text relative z-10">
          <div className="eyebrow text-kalamansi">Donor Dashboard</div>
          <h1 className="text-4xl font-display mb-2">Welcome back, {displayName.split(' ')[0]}</h1>
          <p className="sub text-paper-dim">Thank you for helping make Mandaue City a better place.</p>
        </div>
        <div className="welcome-avatar relative z-10 border-2 border-primary">{initials || 'D'}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 mt-8">
        <div className="panel flex-1 bg-[var(--bg-panel)] border border-[var(--line)]">
          <h3 className="text-xl font-display text-kalamansi mb-2">Ready to contribute?</h3>
          <p className="sub mb-6 text-paper-dim">
            Every donation counts. Whether it's food, clothing, or a financial pledge, your support is vital.
          </p>
          <button 
            className="btn w-full md:w-auto" 
            style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: 'bold' }}
            onClick={() => setShowDonationForm(true)}
          >
            + Make a Donation
          </button>
        </div>

        <div className="panel flex-1 bg-[var(--bg-panel)] border border-[var(--line)] flex flex-col justify-center items-center text-center">
          <div className="text-4xl font-bold text-teal mb-2">3</div>
          <div className="text-sm uppercase tracking-wider text-paper-dim">Total Donations</div>
        </div>
      </div>

      <h3 className="text-2xl font-display mb-4">Recent Activity</h3>
      <div className="panel bg-[var(--bg-panel)] border border-[var(--line)] p-0 overflow-hidden">
        <div className="divide-y divide-[var(--line)]">
          {[
            { type: 'Cash Donation', amount: 'PHP 1,000', date: '2 days ago', status: 'Completed' },
            { type: 'Food Supplies', amount: '10 bags of rice', date: '1 week ago', status: 'Completed' },
            { type: 'Medical Supplies', amount: '2 boxes of masks', date: '1 month ago', status: 'Completed' },
          ].map((item, i) => (
            <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div>
                <div className="font-semibold">{item.type}</div>
                <div className="text-sm text-paper-dim">{item.amount}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-teal">{item.status}</div>
                <div className="text-xs text-paper-dim">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDonationForm && (
        <Modal onClose={() => setShowDonationForm(false)}>
          <DonationForm onCancel={() => setShowDonationForm(false)} />
        </Modal>
      )}
    </>
  )
}
