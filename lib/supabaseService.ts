import { createClient } from './supabase/client'
import type {
  Donation as DbDonation,
  HelpRequest as DbHelpRequest,
  Match as DbMatch,
  Profile,
} from './supabase/types'

/* ─────────────────────────────────────────────────────────────────
   UI-facing types
   These are kept intentionally separate from the DB row shapes in
   ./supabase/types.ts — the components in components/admin/* were
   built against these friendlier field names (donor, item,
   neighborhood, requestor, need, ...), and translating at the edge
   here means none of them need to change as the schema evolves.
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
  verificationStatus?: 'pending' | 'approved' | 'needs_info' | null
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

export interface EligibilityReviewItem {
  id: string // request id
  name: string // requestor's display name
  type: string // e.g. "Elderly · Tier 1"
  uploaded: string // relative time string
  status: 'pending' | 'approved' | 'needs_info'
}

export interface LeaderboardEntry {
  rank: number
  name: string
  amount: string
  badges: string[]
}

/* ─────────────────────────────────────────────────────────────────
   Mapping helpers: DB row <-> UI-facing shape
   ───────────────────────────────────────────────────────────────── */

const donationStatusToUi: Record<DbDonation['status'], DonationStatus> = {
  Waiting: 'Available',
  matching: 'Matched',
  Given: 'Confirmed',
}

const requestStatusToUi: Record<DbHelpRequest['status'], RequestStatus> = {
  unmatched: 'Pending',
  matching: 'Matched',
  confirmed: 'Confirmed',
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function mapDonation(row: DbDonation, donorName?: string | null): Donation {
  const isCash = row.type === 'cash'
  return {
    id: row.id,
    donor: donorName || 'Unknown donor',
    type: row.type,
    item: isCash ? `₱${row.amount ?? 0} Cash` : row.description || 'Food donation',
    amount: row.amount != null ? String(row.amount) : undefined,
    neighborhood: row.location || 'Unspecified',
    status: donationStatusToUi[row.status],
    date: row.created_at?.split('T')[0] ?? '',
  }
}

function mapRequest(row: DbHelpRequest, requestorName?: string | null): HelpRequest {
  const isCash = row.type === 'cash'
  return {
    id: row.id,
    requestor: requestorName || 'Unknown household',
    need: isCash ? 'Cash Assistance' : row.description || 'Food assistance',
    priority: row.priority_tier,
    barangay: row.address,
    neighborhood: row.address,
    items: row.description || undefined,
    status: requestStatusToUi[row.status],
    date: row.created_at?.split('T')[0] ?? '',
    verificationStatus: row.verification_status,
  }
}

const TIER_LABELS: Record<Priority, string> = {
  elderly: 'Elderly · Tier 1',
  pwd: 'PWD · Tier 1',
  infant: 'Infant / Young Child · Tier 1',
  general: 'General Household · Tier 2',
}

/* ─────────────────────────────────────────────────────────────────
   Service layer — admin reads ignore per-user session scope and
   pull global tables directly. This relies on the caller having the
   'admin' role, enforced both by RLS policies on these tables and by
   the create_match/confirm_match_pickup RPCs re-checking role server-side.
   ───────────────────────────────────────────────────────────────── */

export const supabaseService = {

  /* ── READ operations ──────────────────────────────────────────── */

  async getDonations(): Promise<Donation[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('donations')
      .select('*, profiles:donor_id ( full_name )')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row: any) =>
      mapDonation(row as DbDonation, (row.profiles as Profile | null)?.full_name)
    )
  },

  async getRequests(): Promise<HelpRequest[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('requests')
      .select('*, profiles:recipient_id ( full_name )')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row: any) =>
      mapRequest(row as DbHelpRequest, (row.profiles as Profile | null)?.full_name)
    )
  },

  async getMatchingQueue(): Promise<MatchingQueueItem[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        status,
        donations:donation_id ( type, description, amount, profiles:donor_id ( full_name ) ),
        requests:request_id ( priority_tier, profiles:recipient_id ( full_name ) )
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return (data ?? []).map((row: any) => {
      const donation = row.donations
      const request = row.requests
      const isCash = donation?.type === 'cash'
      return {
        id: row.id,
        requestor: request?.profiles?.full_name || 'Unknown household',
        priority: request?.priority_tier || 'general',
        donor: donation?.profiles?.full_name || 'Unknown donor',
        item: isCash ? `₱${donation?.amount ?? 0} Cash Assistance` : donation?.description || 'Food donation',
        kind: isCash ? 'cash' : 'food',
        status: row.status === 'confirmed' ? 'dispatched' : 'pending',
      }
    })
  },

  async getVerificationFeed(): Promise<VerificationItem[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        verification_code,
        created_at,
        donations:donation_id ( type, description, amount, profiles:donor_id ( full_name ) ),
        requests:request_id ( profiles:recipient_id ( full_name ) )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return (data ?? []).map((row: any) => {
      const donation = row.donations
      const isCash = donation?.type === 'cash'
      return {
        id: row.id,
        donor: donation?.profiles?.full_name || 'Unknown donor',
        recipient: row.requests?.profiles?.full_name || 'Unknown household',
        item: isCash ? `₱${donation?.amount ?? 0} Cash` : donation?.description || 'Food donation',
        code: row.verification_code,
        time: relativeTime(row.created_at),
      }
    })
  },

  // Requests flagged as a vulnerable tier (elderly/pwd/infant) awaiting
  // document review before their claimed priority is trusted.
  async getEligibilityReview(): Promise<EligibilityReviewItem[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('requests')
      .select('id, priority_tier, verification_status, created_at, profiles:recipient_id ( full_name )')
      .in('priority_tier', ['elderly', 'pwd', 'infant'])
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.profiles?.full_name || 'Unknown household',
      type: TIER_LABELS[row.priority_tier as Priority] || row.priority_tier,
      uploaded: relativeTime(row.created_at),
      status: row.verification_status,
    }))
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const supabase = createClient()
    // Aggregate confirmed cash donations per donor. (For a large dataset this
    // is better as a materialized view / RPC — kept as a client-side
    // aggregation here since donation volume is modest.)
    const { data, error } = await supabase
      .from('donations')
      .select('donor_id, amount, type, status, profiles:donor_id ( full_name )')
      .eq('status', 'Given')

    if (error) throw error

    const totals = new Map<string, { name: string; total: number }>()
    for (const row of (data ?? []) as any[]) {
      const amount = row.type === 'cash' ? Number(row.amount ?? 0) : 0
      const key = row.donor_id
      const name = row.profiles?.full_name || 'Anonymous donor'
      const existing = totals.get(key)
      totals.set(key, { name, total: (existing?.total ?? 0) + amount })
    }

    return Array.from(totals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((entry, i) => ({
        rank: i + 1,
        name: entry.name,
        amount: `₱${entry.total.toLocaleString()}`,
        badges: i === 0 ? ['bayani'] : [],
      }))
  },

  /* ── WRITE operations ─────────────────────────────────────────── */

  // Transactional: inserts the match row with a freshly generated OTP and
  // flips both the donation and request to 'matching' — or rolls back
  // entirely if any step fails. See supabase/migrations/0002_admin_matching.sql.
  async createMatch(donationId: string, requestId: string): Promise<DbMatch> {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('create_match', {
      p_donation_id: donationId,
      p_request_id: requestId,
    })
    if (error) throw error
    return data as DbMatch
  },

  // Redeems the OTP at pickup, confirming the match and closing both sides.
  async confirmMatchPickup(matchId: string, code: string): Promise<DbMatch> {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('confirm_match_pickup', {
      p_match_id: matchId,
      p_code: code,
    })
    if (error) throw error
    return data as DbMatch
  },

  async approveEligibility(requestId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('requests')
      .update({ verification_status: 'approved' })
      .eq('id', requestId)
    if (error) throw error
  },

  async requestMoreInfo(requestId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('requests')
      .update({ verification_status: 'needs_info' })
      .eq('id', requestId)
    if (error) throw error
  },
}
