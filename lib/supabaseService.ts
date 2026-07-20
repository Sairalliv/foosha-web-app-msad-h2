/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SupabaseClient } from '@supabase/supabase-js'
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
  type: DonationType
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
  donorId: string
  name: string
  amount: string
  badges: string[]
}

export interface OverviewStats {
  activeRequests: number
  activeByTier: { elderly: number; pwd: number; infant: number; general: number }
  foodDonationsCount: number
  cashTotal: number
  // % of all matches ever created that have reached 'confirmed' (picked up).
  deliveredPercent: number
}

export interface AnalyticsSummary {
  // Distinct households with at least one confirmed (fulfilled) request.
  householdsHelped: number
  // Total cash from donations that were actually given (status = 'Given').
  valueDistributedPhp: number
  // Average time between a request being filed and it getting matched, in hours.
  // null when there isn't at least one match to measure yet.
  avgTimeToMatchHours: number | null
  // % of all matches that reached 'confirmed'.
  confirmedMatchRatePercent: number
  // Share of donations by type, as a percent of total donation count.
  donationSplit: { foodPercent: number; cashPercent: number }
  // Confirmed-match counts grouped by the recipient's barangay/address, top 5.
  matchesByBarangay: { name: string; value: number }[]
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
  const foodItem = row.category ? `${row.category} — ${row.description || 'Food donation'}` : row.description || 'Food donation'
  return {
    id: row.id,
    donor: donorName || 'Unknown donor',
    type: row.type,
    item: isCash ? `₱${row.amount ?? 0} Cash` : foodItem,
    amount: row.amount != null ? String(row.amount) : undefined,
    neighborhood: row.location || 'Unspecified',
    status: donationStatusToUi[row.status],
    date: row.created_at?.split('T')[0] ?? '',
  }
}

function mapRequest(row: DbHelpRequest, requestorName?: string | null): HelpRequest {
  const isCash = row.type === 'cash'
  const foodNeed = row.category ? `${row.category} — ${row.description || 'Food assistance'}` : row.description || 'Food assistance'
  return {
    id: row.id,
    requestor: requestorName || 'Unknown household',
    need: isCash ? 'Cash Assistance' : foodNeed,
    type: row.type,
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

export function createSupabaseService(supabase: SupabaseClient) {
  return {

  /* ── READ operations ──────────────────────────────────────────── */

  async getDonations(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row: any) =>
      mapDonation(row as DbDonation, row.donor_name)
    )
  },

  async getRequests(): Promise<HelpRequest[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row: any) =>
      mapRequest(row as DbHelpRequest, row.requestor_name)
    )
  },

  async getMatchingQueue(): Promise<MatchingQueueItem[]> {
    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (matchesError) throw matchesError
    if (!matchesData || matchesData.length === 0) return []

    const donationIds = matchesData.map(m => m.donation_id)
    const requestIds = matchesData.map(m => m.request_id)

    const { data: donationsData } = await supabase.from('donations').select('*').in('id', donationIds)
    const { data: requestsData } = await supabase.from('requests').select('*').in('id', requestIds)

    const donationsMap = new Map((donationsData || []).map((d: any) => [d.id, d]))
    const requestsMap = new Map((requestsData || []).map((r: any) => [r.id, r]))

    return matchesData.map(row => {
      const donation = donationsMap.get(row.donation_id)
      const request = requestsMap.get(row.request_id)
      const isCash = donation?.type === 'cash'
      const foodItem = donation?.category ? `${donation.category} — ${donation?.description || 'Food donation'}` : donation?.description || 'Food donation'
      return {
        id: row.id,
        requestor: request?.requestor_name || 'Unknown household',
        priority: request?.priority_tier || 'general',
        donor: donation?.donor_name || 'Unknown donor',
        item: isCash ? `₱${donation?.amount ?? 0} Cash Assistance` : foodItem,
        kind: isCash ? 'cash' : 'food',
        status: row.status === 'confirmed' ? 'dispatched' : 'pending',
      }
    })
  },

  async getVerificationFeed(): Promise<VerificationItem[]> {
    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10)

    if (matchesError) throw matchesError
    if (!matchesData || matchesData.length === 0) return []

    const donationIds = matchesData.map(m => m.donation_id)
    const requestIds = matchesData.map(m => m.request_id)

    const { data: donationsData } = await supabase.from('donations').select('*').in('id', donationIds)
    const { data: requestsData } = await supabase.from('requests').select('*').in('id', requestIds)

    const donationsMap = new Map((donationsData || []).map((d: any) => [d.id, d]))
    const requestsMap = new Map((requestsData || []).map((r: any) => [r.id, r]))

    return matchesData.map(row => {
      const donation = donationsMap.get(row.donation_id)
      const request = requestsMap.get(row.request_id)
      const isCash = donation?.type === 'cash'
      const foodItem = donation?.category ? `${donation.category} — ${donation?.description || 'Food donation'}` : donation?.description || 'Food donation'
      return {
        id: row.id,
        donor: donation?.donor_name || 'Unknown donor',
        recipient: request?.requestor_name || 'Unknown household',
        item: isCash ? `₱${donation?.amount ?? 0} Cash` : foodItem,
        code: row.verification_code,
        time: relativeTime(row.created_at),
      }
    })
  },

  // Requests flagged as a vulnerable tier (elderly/pwd/infant) awaiting
  // document review before their claimed priority is trusted.
  async getEligibilityReview(): Promise<EligibilityReviewItem[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .in('priority_tier', ['elderly', 'pwd', 'infant'])
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.requestor_name || 'Unknown household',
      type: TIER_LABELS[row.priority_tier as Priority] || row.priority_tier,
      uploaded: relativeTime(row.created_at),
      status: row.verification_status,
    }))
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    // Aggregate confirmed cash donations per donor. (For a large dataset this
    // is better as a materialized view / RPC — kept as a client-side
    // aggregation here since donation volume is modest.)
    const { data, error } = await supabase
      .from('donations')
      .select('donor_id, amount, type, status, donor_name')
      .eq('status', 'Given')

    if (error) throw error

    const totals = new Map<string, { name: string; total: number }>()
    for (const row of (data ?? []) as any[]) {
      const amount = row.type === 'cash' ? Number(row.amount ?? 0) : 0
      const key = row.donor_id
      const name = row.donor_name || 'Anonymous donor'
      const existing = totals.get(key)
      totals.set(key, { name, total: (existing?.total ?? 0) + amount })
    }

    return Array.from(totals.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
      .map(([donorId, entry], i) => ({
        rank: i + 1,
        donorId,
        name: entry.name,
        amount: `₱${entry.total.toLocaleString()}`,
        badges: i === 0 ? ['bayani'] : [],
      }))
  },

  // Aggregate figures for the admin Overview page's stat cards. Computed
  // directly from `donations` / `requests` / `matches` rather than kept as
  // separate counters, so they can never drift from the underlying rows.
  async getOverviewStats(): Promise<OverviewStats> {
    const [requestsRes, donationsRes, matchesRes] = await Promise.all([
      supabase.from('requests').select('status, priority_tier'),
      supabase.from('donations').select('type, amount'),
      supabase.from('matches').select('status'),
    ])

    if (requestsRes.error) throw requestsRes.error
    if (donationsRes.error) throw donationsRes.error
    if (matchesRes.error) throw matchesRes.error

    const activeByTier = { elderly: 0, pwd: 0, infant: 0, general: 0 }
    let activeRequests = 0
    for (const row of (requestsRes.data ?? []) as any[]) {
      if (row.status === 'confirmed') continue
      activeRequests += 1
      const tier = row.priority_tier as keyof typeof activeByTier
      if (tier in activeByTier) activeByTier[tier] += 1
    }

    let foodDonationsCount = 0
    let cashTotal = 0
    for (const row of (donationsRes.data ?? []) as any[]) {
      if (row.type === 'food') foodDonationsCount += 1
      else cashTotal += Number(row.amount ?? 0)
    }

    const matches = (matchesRes.data ?? []) as any[]
    const confirmedMatches = matches.filter((m) => m.status === 'confirmed').length
    const deliveredPercent = matches.length === 0 ? 0 : Math.round((confirmedMatches / matches.length) * 100)

    return { activeRequests, activeByTier, foodDonationsCount, cashTotal, deliveredPercent }
  },

  // Platform-wide figures for the admin Analytics page.
  // rangeDays limits results to records created in the last N days;
  // pass null (or omit) for all-time figures.
  async getAnalytics(rangeDays: number | null = null): Promise<AnalyticsSummary> {
    const cutoffIso = rangeDays == null ? null : new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString()

    let requestsQuery = supabase.from('requests').select('recipient_id, status, created_at')
    let donationsQuery = supabase.from('donations').select('type, amount, status, created_at')
    let matchesQuery = supabase
      .from('matches')
      .select('status, created_at, requests:request_id ( created_at, address )')

    if (cutoffIso) {
      requestsQuery = requestsQuery.gte('created_at', cutoffIso)
      donationsQuery = donationsQuery.gte('created_at', cutoffIso)
      matchesQuery = matchesQuery.gte('created_at', cutoffIso)
    }

    const [requestsRes, donationsRes, matchesRes] = await Promise.all([
      requestsQuery,
      donationsQuery,
      matchesQuery,
    ])

    if (requestsRes.error) throw requestsRes.error
    if (donationsRes.error) throw donationsRes.error
    if (matchesRes.error) throw matchesRes.error

    const householdsHelped = new Set(
      (requestsRes.data ?? [])
        .filter((r: any) => r.status === 'confirmed')
        .map((r: any) => r.recipient_id)
    ).size

    let valueDistributedPhp = 0
    let foodCount = 0
    let cashCount = 0
    for (const row of (donationsRes.data ?? []) as any[]) {
      if (row.type === 'food') foodCount += 1
      else cashCount += 1
      if (row.status === 'Given' && row.type === 'cash') {
        valueDistributedPhp += Number(row.amount ?? 0)
      }
    }
    const totalDonations = foodCount + cashCount
    const donationSplit =
      totalDonations === 0
        ? { foodPercent: 0, cashPercent: 0 }
        : {
            foodPercent: Math.round((foodCount / totalDonations) * 100),
            cashPercent: Math.round((cashCount / totalDonations) * 100),
          }

    const matches = (matchesRes.data ?? []) as any[]
    const confirmedMatchRatePercent =
      matches.length === 0 ? 0 : Math.round((matches.filter((m) => m.status === 'confirmed').length / matches.length) * 100)

    const matchDurationsHours: number[] = []
    const barangayCounts = new Map<string, number>()
    for (const m of matches) {
      const requestRow = m.requests
      if (requestRow?.created_at && m.created_at) {
        const hours = (new Date(m.created_at).getTime() - new Date(requestRow.created_at).getTime()) / 3_600_000
        if (Number.isFinite(hours) && hours >= 0) matchDurationsHours.push(hours)
      }
      if (m.status === 'confirmed' && requestRow?.address) {
        barangayCounts.set(requestRow.address, (barangayCounts.get(requestRow.address) ?? 0) + 1)
      }
    }
    const avgTimeToMatchHours =
      matchDurationsHours.length === 0
        ? null
        : Math.round((matchDurationsHours.reduce((sum, h) => sum + h, 0) / matchDurationsHours.length) * 10) / 10

    const matchesByBarangay = Array.from(barangayCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))

    return {
      householdsHelped,
      valueDistributedPhp,
      avgTimeToMatchHours,
      confirmedMatchRatePercent,
      donationSplit,
      matchesByBarangay,
    }
  },

  /* ── WRITE operations ─────────────────────────────────────────── */

  // Transactional: inserts the match row with a freshly generated OTP and
  // flips both the donation and request to 'matching' — or rolls back
  // entirely if any step fails. See supabase/migrations/0002_admin_matching.sql.
  async createMatch(donationId: string, requestId: string): Promise<DbMatch> {
    const { data, error } = await supabase.rpc('create_match', {
      p_donation_id: donationId,
      p_request_id: requestId,
    })
    if (error) throw error
    return data as DbMatch
  },

  // Redeems the OTP at pickup, confirming the match and closing both sides.
  async confirmMatchPickup(matchId: string, code: string): Promise<DbMatch> {
    const { data, error } = await supabase.rpc('confirm_match_pickup', {
      p_match_id: matchId,
      p_code: code,
    })
    if (error) throw error
    return data as DbMatch
  },

  async approveEligibility(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('requests')
      .update({ verification_status: 'approved' })
      .eq('id', requestId)
    if (error) throw error
  },

  async requestMoreInfo(requestId: string): Promise<void> {
    const { error } = await supabase
      .from('requests')
      .update({ verification_status: 'needs_info' })
      .eq('id', requestId)
    if (error) throw error
  },
  }
}
