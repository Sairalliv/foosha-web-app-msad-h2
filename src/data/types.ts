// ── Shared domain types ──────────────────────────────────────────
// These describe the shape of Foosha's data regardless of where it
// eventually lives (mock local store today, Supabase/Postgres later).
// Keep this file as the single source of truth for data shapes.

export type PriorityTier = "elderly" | "pwd" | "infant" | "general";

export type DonationKind = "food" | "cash";

export type MatchStatus =
  | "unmatched"      // donation/request not yet paired
  | "matching"       // system is actively trying to pair it
  | "awaiting_pickup" // paired, ticket issued, not yet confirmed
  | "confirmed";     // recipient entered the code, ticket closed

export interface DonorProfile {
  id: string;
  name: string;
  barangay: string;
  avatarInitials: string;
  totalGivenPhp: number;
  matchesCount: number;
  cityRank: number;
  badges: string[]; // badge ids earned
}

export interface RecipientProfile {
  id: string;
  name: string;
  barangay: string;
  avatarInitials: string;
  priorityTier: PriorityTier;
  confirmedAllTime: number;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  kind: DonationKind;
  description: string; // e.g. "Rice, canned goods, milk" or "₱500 cash gift"
  amountPhp?: number; // for cash donations
  barangay: string;
  distanceKm?: number;
  createdAt: string; // ISO date
  status: MatchStatus;
  matchedRequestId?: string;
  ticketId?: string;
}

export interface HelpRequest {
  id: string;
  recipientId: string;
  recipientName: string;
  kind: DonationKind;
  description: string;
  amountPhp?: number;
  barangay: string;
  priorityTier: PriorityTier;
  createdAt: string;
  status: MatchStatus;
  matchedDonationId?: string;
  ticketId?: string;
}

export interface MatchTicket {
  id: string; // e.g. "MC-0417"
  donationId: string;
  requestId: string;
  donorName: string;
  recipientName: string;
  contents: string;
  code: string; // one-time pickup code
  status: "awaiting_pickup" | "confirmed";
  confirmedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  thresholdMatches: number;
}

export interface LeaderboardEntry {
  donorId: string;
  name: string;
  totalGivenPhp: number;
  matchesCount: number;
  badgeIds: string[];
}

export interface VerificationCase {
  id: string;
  recipientName: string;
  barangay: string;
  claim: string; // e.g. "Elderly priority"
  documentSubmitted: boolean;
  status: "pending" | "approved" | "info_requested";
}

export interface AdminOverviewStats {
  pendingMatches: number;
  deliveredThisMonth: number;
  totalValueDonatedPhp: number;
  confirmedWithin24hPct: number;
  
  // New granular stats for the dashboard
  activeRequestsTotal: number;
  activeRequestsElderly: number;
  activeRequestsPWD: number;
  activeRequestsInfant: number;
  
  foodDonationsCount: number;
  cashDonationsTotal: number;
}

export interface AnalyticsSnapshot {
  householdsHelped: number;
  totalValuePhp: number;
  avgMatchTimeHours: number;
  confirmedWithin24hPct: number;
  foodVsCash: { food: number; cash: number };
  priorityMix: Record<PriorityTier, number>;
  matchesByBarangay: { barangay: string; matches: number }[];
  topDonors: { name: string; givenPhp: number; trendPct: number }[];
}

// ── Auth ──────────────────────────────────────────────────────────
// Represents the currently logged-in user. When Supabase is connected,
// this maps to a combination of `auth.users` (id, email) and a custom
// `profiles` table (name, role, avatarInitials).

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "donor" | "recipient" | "admin";
  avatarInitials: string;
  createdAt: string;
}
