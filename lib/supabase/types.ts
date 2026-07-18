// ──────────────────────────────────────────────────────────────────
// Database types for the Donor role (profiles + donations)
//
// NOTE: the rest of this codebase (see lib/auth/guards.ts) currently
// reads the signed-in user's profile from a `users` table. The Donor
// spec below was written against a `profiles` table instead. Pick one
// name and make sure your Supabase schema + guards.ts + this file
// agree — they're kept separate here only so this feature can be
// dropped in and reconciled later.
// ──────────────────────────────────────────────────────────────────

export type DonationType = 'food' | 'cash'
export type DonationStatus = 'Waiting' | 'matching' | 'Given'
export type UserRole = 'donor' | 'recipient' | 'admin'
// Tier-eligibility document review, set by an admin in the Verification Queue.
// 'pending' = newly flagged elderly/pwd/infant request awaiting document review.
export type VerificationStatus = 'pending' | 'approved' | 'needs_info'

export interface Profile {
  id: string // matches auth.users.id
  full_name: string | null
  barangay: string | null
  avatar_url: string | null
  role: UserRole | null
}

export interface Donation {
  id: string
  donor_id: string // FK -> profiles.id / auth.users.id
  type: DonationType
  description: string | null // used when type === 'food'
  amount: number | null // used when type === 'cash', in PHP
  location: string | null // barangay / drop-off location
  status: DonationStatus
  created_at: string
}

export type DonationInsert = Pick<Donation, 'donor_id' | 'type' | 'description' | 'amount' | 'location'> & {
  status?: DonationStatus
}

// ──────────────────────────────────────────────────────────────────
// Recipient / Requestor role (requests + matches)
// ──────────────────────────────────────────────────────────────────

export type RequestType = 'food' | 'cash'
export type RequestStatus = 'unmatched' | 'matching' | 'confirmed'
// Highest-priority flag wins when several vulnerability checkboxes are
// ticked. Order (most -> least vulnerable): elderly > pwd > infant > general.
export type PriorityTier = 'elderly' | 'pwd' | 'infant' | 'general'
export type MatchStatus = 'pending' | 'confirmed'

export interface HelpRequest {
  id: string
  recipient_id: string // FK -> profiles.id / auth.users.id
  type: RequestType
  description: string | null // used when type === 'food'
  amount: number | null // used when type === 'cash', in PHP (optional)
  priority_tier: PriorityTier
  address: string
  status: RequestStatus
  // Only meaningful when priority_tier is elderly/pwd/infant — 'general' requests
  // don't need document review and can be left null.
  verification_status: VerificationStatus | null
  created_at: string
}

export type HelpRequestInsert = Pick<
  HelpRequest,
  'recipient_id' | 'type' | 'description' | 'amount' | 'priority_tier' | 'address'
> & {
  status?: RequestStatus
  verification_status?: VerificationStatus | null
}

export interface Match {
  id: string
  donation_id: string
  request_id: string
  verification_code: string
  status: MatchStatus
  created_at?: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Omit<Profile, 'id'>> & { id: string }
        Update: Partial<Profile>
      }
      donations: {
        Row: Donation
        Insert: DonationInsert
        Update: Partial<Donation>
      }
      requests: {
        Row: HelpRequest
        Insert: HelpRequestInsert
        Update: Partial<HelpRequest>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id'>
        Update: Partial<Match>
      }
    }
  }
}
