'use client'

import React, { useState, useEffect } from 'react'
import { supabaseService, HelpRequest, Priority } from '@/lib/supabaseService'
import { Home, Calendar, Clock, MapPin, Send, ShieldAlert, BadgeCheck } from 'lucide-react'

export default function RequestorPage() {
  const [requests, setRequests] = useState<HelpRequest[]>([])
  
  // Form State
  const [barangay, setBarangay] = useState('Basak')
  const [priority, setPriority] = useState<Priority>('general')
  const [need, setNeed] = useState('Food')
  const [items, setItems] = useState('')
  const [familySize, setFamilySize] = useState('1')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadRequests = async () => {
    // Only show current user's requests. Mocked as 'Your Household'
    const all = await supabaseService.getRequests()
    setRequests(all.filter(r => r.requestor === 'Your Household'))
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await supabaseService.createRequest({
        need,
        priority,
        barangay,
        familySize: parseInt(familySize) || 1,
        items
      })
      alert('Request submitted successfully!')
      // Reset form
      setItems('')
      loadRequests()
    } catch (e) {
      console.error(e)
      alert('Failed to submit request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--jeepney)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            R
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--paper)' }}>Requestor Portal</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Request Assistance</h1>
        <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>Submit a request for food or cash assistance from the community.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        
        {/* Left Column: Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Your Barangay</label>
                <select 
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none' }}
                >
                  <option value="Basak">Basak</option>
                  <option value="Tipolo">Tipolo</option>
                  <option value="Subangdaku">Subangdaku</option>
                  <option value="Ibabao">Ibabao</option>
                  <option value="Centro">Centro</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Family Size</label>
                <input 
                  type="number"
                  min="1" 
                  value={familySize}
                  onChange={(e) => setFamilySize(e.target.value)}
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Priority Category (Tier 1)</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { id: 'general', label: 'General Household', color: 'var(--paper)' },
                  { id: 'elderly', label: 'Elderly (60+)', color: 'var(--kalamansi)' },
                  { id: 'pwd', label: 'PWD', color: 'var(--jeepney)' },
                  { id: 'infant', label: 'Infant / Toddler', color: 'var(--teal)' },
                ].map(p => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: priority === p.id ? 'rgba(255,255,255,0.05)' : 'transparent', border: `1px solid ${priority === p.id ? p.color : 'var(--line)'}`, padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input 
                      type="radio" 
                      name="priority" 
                      value={p.id}
                      checked={priority === p.id}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `1.5px solid ${priority === p.id ? p.color : 'var(--paper-dim)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {priority === p.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />}
                    </div>
                    <span style={{ fontSize: '14px', color: priority === p.id ? p.color : 'var(--paper-dim)', fontWeight: priority === p.id ? 600 : 400 }}>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Type of Need</label>
              <select 
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none' }}
              >
                <option value="Food">Food / Groceries</option>
                <option value="Cash Assistance">Cash Assistance</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Baby Supplies">Baby Supplies</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Specific Items Needed</label>
              <textarea 
                placeholder="e.g. 5kg Rice, Canned goods, Powdered Milk..." 
                required
                value={items}
                onChange={(e) => setItems(e.target.value)}
                rows={4}
                style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }} 
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !items}
              style={{ 
                background: 'var(--jeepney)', 
                color: 'white', 
                padding: '16px', 
                borderRadius: '8px', 
                fontWeight: 700, 
                fontSize: '15px', 
                border: 'none', 
                cursor: (isSubmitting || !items) ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || !items) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
                transition: 'all 0.2s',
                boxShadow: (isSubmitting || !items) ? 'none' : '0 4px 14px rgba(232, 84, 47, 0.2)'
              }}
            >
              {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
            </button>
          </form>
        </div>

        {/* Right Column: History & OTPs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--paper)', margin: 0 }}>My Active Requests</h3>
          
          {requests.length === 0 ? (
            <div style={{ background: 'var(--bg-panel)', border: '1px dashed var(--line)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--paper-dim)' }}>
              No active requests.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {requests.map(r => (
                <div key={r.id} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
                  
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--paper)' }}>{r.need}</div>
                      <span style={{ 
                        background: r.status === 'Pending' ? 'rgba(244, 236, 216, 0.1)' : r.status === 'Matched' ? 'rgba(232, 84, 47, 0.15)' : 'rgba(143, 184, 168, 0.15)',
                        color: r.status === 'Pending' ? 'var(--paper-dim)' : r.status === 'Matched' ? '#fbbf24' : 'var(--teal)',
                        padding: '4px 10px',
                        borderRadius: '99px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}>
                        {r.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--paper-dim)', lineHeight: 1.4 }}>
                      {r.items}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {r.neighborhood}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {r.date}</span>
                    </div>
                  </div>

                  {/* OTP Section for Matched Requests */}
                  {r.status === 'Matched' && r.otpCode && (
                    <div style={{ background: 'var(--bg-deep)', padding: '20px', borderTop: '1px dashed rgba(244, 236, 216, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--paper)', fontSize: '14px', fontWeight: 600 }}>
                        <ShieldAlert size={16} color="var(--jeepney)" />
                        Verification Code
                      </div>
                      <div style={{ 
                        background: 'var(--bg-panel)', 
                        border: '1px solid var(--jeepney)', 
                        color: 'var(--jeepney)', 
                        fontSize: '24px', 
                        fontWeight: 700, 
                        letterSpacing: '4px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {r.otpCode}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--paper-dim)', textAlign: 'center' }}>
                        Show this code to <strong>{r.matchedDonor}</strong> or the delivery rider to claim your assistance.
                      </div>
                    </div>
                  )}

                  {/* Confirmed / Claimed State */}
                  {r.status === 'Confirmed' && (
                    <div style={{ background: 'rgba(143, 184, 168, 0.1)', padding: '16px 20px', borderTop: '1px solid rgba(143, 184, 168, 0.2)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--teal)' }}>
                      <BadgeCheck size={18} />
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>Assistance received successfully!</span>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
