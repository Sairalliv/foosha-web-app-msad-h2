'use client'

import React, { useState, useEffect } from 'react'
import { supabaseService, Donation, DonationType } from '@/lib/supabaseService'
import { Package, Banknote, MapPin, Calendar, PlusCircle } from 'lucide-react'

export default function DonorPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [type, setType] = useState<DonationType>('food')
  const [item, setItem] = useState('')
  const [quantity, setQuantity] = useState('')
  const [amount, setAmount] = useState('')
  const [expiry, setExpiry] = useState('')
  const [pickup, setPickup] = useState('dropoff')
  const [neighborhood, setNeighborhood] = useState('Basak')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadDonations = async () => {
    // Only show current user's donations. In the mock, we assigned donor: 'You'
    const all = await supabaseService.getDonations()
    setDonations(all.filter(d => d.donor === 'You'))
  }

  useEffect(() => {
    loadDonations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await supabaseService.createDonation({
        type,
        item: type === 'food' ? item : '',
        amount: type === 'cash' ? amount : '',
        quantity,
        expiry,
        pickup,
        neighborhood
      })
      alert('Donation submitted successfully!')
      // Reset form
      setItem('')
      setQuantity('')
      setAmount('')
      setExpiry('')
      loadDonations()
    } catch (e) {
      console.error(e)
      alert('Failed to submit donation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--kalamansi)', color: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            D
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--paper)' }}>Donor Portal</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', margin: '0 0 8px 0', color: 'var(--paper)' }}>Make a Donation</h1>
        <p style={{ color: 'var(--paper-dim)', margin: 0, fontSize: '15px' }}>Help families in Mandaue City by donating food or cash.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        
        {/* Left Column: Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Type Toggle */}
            <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-deep)', padding: '6px', borderRadius: '10px', border: '1px solid var(--line)' }}>
              <button 
                type="button"
                onClick={() => setType('food')}
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: type === 'food' ? 'var(--kalamansi)' : 'transparent',
                  color: type === 'food' ? 'var(--bg-deep)' : 'var(--paper-dim)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Package size={18} /> Food Items
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
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: type === 'cash' ? 'var(--teal)' : 'transparent',
                  color: type === 'cash' ? 'var(--bg-deep)' : 'var(--paper-dim)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Banknote size={18} /> Cash
              </button>
            </div>

            {/* Fields */}
            {type === 'food' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Item Details</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5kg Rice, Canned goods" 
                    required
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Quantity / Weight</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 5 sacks" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Expiry Date (if applicable)</label>
                    <input 
                      type="date" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} 
                    />
                  </div>
                </div>
              </>
            )}

            {type === 'cash' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Amount (PHP)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--paper-dim)', fontWeight: 600 }}>₱</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px 12px 32px', borderRadius: '8px', fontSize: '14px', width: '100%', outline: 'none' }} 
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Handover Preference</label>
                <select 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none' }}
                >
                  <option value="dropoff">I will drop it off</option>
                  <option value="pickup">Request pickup</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--paper-dim)' }}>Your Barangay</label>
                <select 
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--paper)', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', outline: 'none', appearance: 'none' }}
                >
                  <option value="Basak">Basak</option>
                  <option value="Tipolo">Tipolo</option>
                  <option value="Subangdaku">Subangdaku</option>
                  <option value="Ibabao">Ibabao</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || (type === 'food' ? !item : !amount)}
              style={{ 
                background: 'var(--kalamansi)', 
                color: 'var(--bg-deep)', 
                padding: '16px', 
                borderRadius: '8px', 
                fontWeight: 700, 
                fontSize: '15px', 
                border: 'none', 
                cursor: (isSubmitting || (type === 'food' ? !item : !amount)) ? 'not-allowed' : 'pointer',
                opacity: (isSubmitting || (type === 'food' ? !item : !amount)) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
                transition: 'all 0.2s',
                boxShadow: (isSubmitting || (type === 'food' ? !item : !amount)) ? 'none' : '0 4px 14px rgba(199, 217, 77, 0.2)'
              }}
            >
              {isSubmitting ? 'Submitting...' : <><PlusCircle size={18} /> Submit Donation</>}
            </button>
          </form>
        </div>

        {/* Right Column: History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--paper)', margin: 0 }}>My Donations</h3>
          
          {donations.length === 0 ? (
            <div style={{ background: 'var(--bg-panel)', border: '1px dashed var(--line)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--paper-dim)' }}>
              No donations yet. Thank you for considering helping out!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {donations.map(d => (
                <div key={d.id} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--paper)' }}>{d.item}</div>
                    <span style={{ 
                      background: d.status === 'Available' ? 'rgba(244, 236, 216, 0.1)' : d.status === 'Matched' ? 'rgba(232, 84, 47, 0.15)' : 'rgba(143, 184, 168, 0.15)',
                      color: d.status === 'Available' ? 'var(--paper-dim)' : d.status === 'Matched' ? '#fbbf24' : 'var(--teal)',
                      padding: '4px 10px',
                      borderRadius: '99px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {d.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: 'var(--paper-dim)', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {d.neighborhood}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {d.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
