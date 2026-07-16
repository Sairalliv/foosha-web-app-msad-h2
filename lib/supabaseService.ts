import { createClient } from './supabase/client'

/* ─────────────────────────────────────────────────────────────────
   Types
   ───────────────────────────────────────────────────────────────── */
export type DonationType = 'food' | 'cash'
export type DonationStatus = 'Available' | 'Matched' | 'Confirmed'
export type RequestStatus = 'Pending' | 'Matched' | 'Confirmed'
export type Priority = 'elderly' | 'pwd' | 'infant' | 'general'

export interface Donation {
  id: string
  donor: string
  type: DonationType
  item: string
  amount?: string
  quantity?: string
  expiry?: string
  pickup?: string
  neighborhood: string
  status: DonationStatus
  date: string
}

export interface HelpRequest {
  id: string
  requestor: string
  need: string
  priority: Priority
  barangay: string
  neighborhood: string
  familySize?: number
  items?: string
  status: RequestStatus
  date: string
  otpCode?: string
  matchedDonor?: string
}

export interface MatchingQueueItem {
  id: string
  requestor: string
  priority: string
  donor: string
  item: string
  kind: string
  status: string
}

export interface VerificationItem {
  id: string
  donor: string
  recipient: string
  item: string
  code: string
  time: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  amount: string
  badges: string[]
}

/* ─────────────────────────────────────────────────────────────────
   Mock data — Mandaue City flavor
   ───────────────────────────────────────────────────────────────── */

const MATCHING_QUEUE: MatchingQueueItem[] = [
  { id: 'MC-0512', requestor: 'Lola Remedios Canoy', priority: 'elderly', donor: 'Basak Sari-Sari Store', item: 'Rice (5kg), Canned Sardines ×4', kind: 'food', status: 'pending' },
  { id: 'MC-0513', requestor: 'Baby Althea Fernandez', priority: 'infant', donor: 'Tipolo Bakeshop', item: 'Powdered Milk ×3, Cerelac ×2', kind: 'food', status: 'pending' },
  { id: 'MC-0514', requestor: 'Roberto Escaño (PWD)', priority: 'pwd', donor: 'Dela Peña Family', item: '₱1,500 Cash Assistance', kind: 'cash', status: 'dispatched' },
  { id: 'MC-0515', requestor: 'Garcia Household', priority: 'general', donor: 'Subangdaku Rotary Club', item: 'Rice (10kg), Cooking Oil ×2', kind: 'food', status: 'pending' },
  { id: 'MC-0516', requestor: 'Lolo Vicente Daan', priority: 'elderly', donor: 'M. Fernandez', item: '₱800 Cash Assistance', kind: 'cash', status: 'dispatched' },
]

const VERIFICATION_FEED: VerificationItem[] = [
  { id: 'MC-0498', donor: 'Basak Sari-Sari Store', recipient: 'P. Ramos household', item: 'Rice, canned goods, milk', code: '7Q3K', time: '2 min ago' },
  { id: 'MC-0496', donor: 'Anonymous cash gift', recipient: 'Lolo Vicente, 74', item: '₱1,200 Cash', code: '9XM2', time: '18 min ago' },
  { id: 'MC-0493', donor: 'Dela Peña Family', recipient: 'Marcelo Household', item: 'Rice (5kg), cooking oil', code: 'A4KN', time: '45 min ago' },
  { id: 'MC-0491', donor: 'Tipolo Bakeshop', recipient: 'Baby Jenna Cruz', item: 'Powdered Milk ×2, bread', code: 'R8PQ', time: '1 hr ago' },
]

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Basak Sari-Sari Store', amount: '₱18,400', badges: ['bayani', 'first'] },
  { rank: 2, name: 'Dela Peña Family', amount: '₱11,050', badges: ['first'] },
  { rank: 3, name: 'Tipolo Bakeshop', amount: '₱7,900', badges: ['first'] },
  { rank: 4, name: 'Subangdaku Rotary Club', amount: '₱6,200', badges: [] },
  { rank: 5, name: 'M. Fernandez', amount: '₱4,850', badges: [] },
]

const DONATIONS: Donation[] = [
  { id: 'D-101', donor: 'You', type: 'cash', item: '₱5,000 Cash', neighborhood: 'Basak', status: 'Available', date: '2026-07-15' },
  { id: 'D-102', donor: 'You', type: 'food', item: 'Assorted Bread (20 pcs)', quantity: '20', neighborhood: 'Tipolo', status: 'Matched', date: '2026-07-14' },
  { id: 'D-103', donor: 'You', type: 'food', item: 'Rice (50kg)', quantity: '50', neighborhood: 'Subangdaku', status: 'Confirmed', date: '2026-07-13' },
  { id: 'D-104', donor: 'You', type: 'cash', item: '₱2,500 Cash', neighborhood: 'Ibabao', status: 'Available', date: '2026-07-16' },
]

const REQUESTS: HelpRequest[] = [
  { id: 'R-201', requestor: 'Your Household', need: 'Food & Cash', priority: 'elderly', barangay: 'Basak', neighborhood: 'Basak', familySize: 4, items: '5kg Rice, canned goods, cooking oil', status: 'Matched', date: '2026-07-16', otpCode: 'FS-8842', matchedDonor: 'Basak Sari-Sari Store' },
  { id: 'R-202', requestor: 'Your Household', need: 'Milk & Baby Supplies', priority: 'infant', barangay: 'Tipolo', neighborhood: 'Tipolo', familySize: 5, items: 'Powdered Milk, Cerelac, Diapers', status: 'Pending', date: '2026-07-15' },
  { id: 'R-203', requestor: 'Your Household', need: 'Cash Assistance', priority: 'pwd', barangay: 'Subangdaku', neighborhood: 'Subangdaku', familySize: 3, items: '₱1,500 for medication', status: 'Confirmed', date: '2026-07-12', otpCode: 'FS-3391', matchedDonor: 'Dela Peña Family' },
]

/* ─────────────────────────────────────────────────────────────────
   Service layer — swap mock implementations for real Supabase
   queries once the database schema is finalized.
   ───────────────────────────────────────────────────────────────── */

// In-memory stores so that newly created items appear instantly
let localDonations = [...DONATIONS]
let localRequests = [...REQUESTS]

export const supabaseService = {

  /* ── READ operations ──────────────────────────────────────────── */

  async getMatchingQueue(): Promise<MatchingQueueItem[]> {
    // const supabase = createClient()
    // const { data, error } = await supabase.from('matches').select('*').order('created_at', { ascending: false })
    // if (error) throw error
    // return data
    return [...MATCHING_QUEUE]
  },

  async getVerificationFeed(): Promise<VerificationItem[]> {
    return [...VERIFICATION_FEED]
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return [...LEADERBOARD]
  },

  async getDonations(): Promise<Donation[]> {
    return [...localDonations]
  },

  async getRequests(): Promise<HelpRequest[]> {
    return [...localRequests]
  },

  /* ── WRITE operations ─────────────────────────────────────────── */

  async createDonation(data: {
    type: DonationType
    item: string
    amount?: string
    quantity?: string
    expiry?: string
    pickup?: string
    neighborhood?: string
  }): Promise<Donation> {
    // const supabase = createClient()
    // const { data: row, error } = await supabase.from('donations').insert([data]).select().single()
    // if (error) throw error
    // return row

    const newDonation: Donation = {
      id: `D-${Date.now().toString().slice(-4)}`,
      donor: 'You',
      type: data.type,
      item: data.type === 'cash' ? `₱${data.amount} Cash` : data.item,
      amount: data.amount,
      quantity: data.quantity,
      expiry: data.expiry,
      pickup: data.pickup,
      neighborhood: data.neighborhood || 'Basak',
      status: 'Available',
      date: new Date().toISOString().split('T')[0],
    }
    localDonations = [newDonation, ...localDonations]
    return newDonation
  },

  async createRequest(data: {
    need: string
    priority: Priority
    barangay: string
    familySize?: number
    items?: string
  }): Promise<HelpRequest> {
    // const supabase = createClient()
    // const { data: row, error } = await supabase.from('requests').insert([data]).select().single()
    // if (error) throw error
    // return row

    const newRequest: HelpRequest = {
      id: `R-${Date.now().toString().slice(-4)}`,
      requestor: 'Your Household',
      need: data.need,
      priority: data.priority,
      barangay: data.barangay,
      neighborhood: data.barangay,
      familySize: data.familySize,
      items: data.items,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    }
    localRequests = [newRequest, ...localRequests]
    return newRequest
  },

  async createMatch(donationId: string, requestId: string) {
    console.log(`Matching donation ${donationId} with request ${requestId}`)
    return { success: true }
  },

  async verifyOTP(ticketId: string, code: string) {
    console.log(`Verifying ticket ${ticketId} with code ${code}`)
    return { success: true }
  },
}
