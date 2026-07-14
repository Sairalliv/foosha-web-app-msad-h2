// ── Foosha data API ───────────────────────────────────────────────
//
// Every page in the app reads and writes data through the functions
// in this file — nothing else. That's the whole point of this file:
// when it's time to connect a real database (Supabase, per Riian's
// usual stack), you only need to rewrite the *insides* of these
// functions to call `supabase.from(...)` instead of `localStore`.
// The function names, parameters, and return types below should stay
// the same so every page keeps working without changes.
//
// Example of what that swap looks like later:
//
//   export async function listDonations() {
//     const { data, error } = await supabase.from("donations").select("*");
//     if (error) throw error;
//     return data as Donation[];
//   }
//
// Until then, everything here reads/writes to localStorage via
// localStore.ts, seeded from seed.ts.

import { localStore } from "./localStore";
import {
  DONATIONS,
  REQUESTS,
  TICKETS,
  BADGES,
  VERIFICATION_QUEUE,
  CURRENT_DONOR,
  CURRENT_RECIPIENT,
} from "./seed";
import type {
  Donation,
  HelpRequest,
  MatchTicket,
  DonorProfile,
  RecipientProfile,
  LeaderboardEntry,
  VerificationCase,
  AdminOverviewStats,
  AnalyticsSnapshot,
  DonationKind,
  PriorityTier,
} from "./types";

// ── Profiles ──────────────────────────────────────────────────────
// NOTE: there's no real auth yet (see context/AuthContext.tsx), so
// these just return the single seeded "current user" for each role.
// Once auth is wired up, swap these to look up by the logged-in user id.

export async function getCurrentDonor(): Promise<DonorProfile> {
  return CURRENT_DONOR;
}

export async function getCurrentRecipient(): Promise<RecipientProfile> {
  return CURRENT_RECIPIENT;
}

// ── Donations (donor side + admin records) ───────────────────────

export async function listDonations(filter?: { donorId?: string }): Promise<Donation[]> {
  const all = await localStore.get<Donation>("donations", DONATIONS);
  if (filter?.donorId) return all.filter((d) => d.donorId === filter.donorId);
  return all;
}

export async function listAvailableListings(): Promise<Donation[]> {
  const all = await localStore.get<Donation>("donations", DONATIONS);
  return all.filter((d) => d.status === "unmatched" || d.status === "matching");
}

export interface CreateDonationInput {
  donorId: string;
  donorName: string;
  kind: DonationKind;
  description: string;
  amountPhp?: number;
  barangay: string;
}

export async function createDonation(input: CreateDonationInput): Promise<Donation> {
  const all = await localStore.get<Donation>("donations", DONATIONS);
  const donation: Donation = {
    id: `d-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "matching",
    ...input,
  };
  await localStore.set("donations", [donation, ...all]);
  return donation;
}

// ── Requests (recipient side + admin records) ────────────────────

export async function listRequests(filter?: { recipientId?: string }): Promise<HelpRequest[]> {
  const all = await localStore.get<HelpRequest>("requests", REQUESTS);
  if (filter?.recipientId) return all.filter((r) => r.recipientId === filter.recipientId);
  return all;
}

export interface CreateRequestInput {
  recipientId: string;
  recipientName: string;
  kind: DonationKind;
  description: string;
  amountPhp?: number;
  barangay: string;
  priorityTier: PriorityTier;
}

export async function createRequest(input: CreateRequestInput): Promise<HelpRequest> {
  const all = await localStore.get<HelpRequest>("requests", REQUESTS);
  const request: HelpRequest = {
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "unmatched",
    ...input,
  };
  await localStore.set("requests", [request, ...all]);
  return request;
}

// ── Match tickets & pickup confirmation ───────────────────────────

export async function listTickets(): Promise<MatchTicket[]> {
  return localStore.get<MatchTicket>("tickets", TICKETS);
}

export async function getTicket(ticketId: string): Promise<MatchTicket | undefined> {
  const all = await listTickets();
  return all.find((t) => t.id === ticketId);
}

export interface ConfirmPickupResult {
  success: boolean;
  message: string;
  ticket?: MatchTicket;
}

/** Recipient enters the one-time code shown on their match ticket. */
export async function confirmPickup(ticketId: string, enteredCode: string): Promise<ConfirmPickupResult> {
  const tickets = await listTickets();
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return { success: false, message: "Ticket not found." };
  if (ticket.status === "confirmed") return { success: false, message: "This ticket is already confirmed." };
  if (ticket.code.toUpperCase() !== enteredCode.toUpperCase()) {
    return { success: false, message: "That code doesn't match. Double-check with the donor." };
  }

  const updatedTicket: MatchTicket = { ...ticket, status: "confirmed", confirmedAt: new Date().toISOString() };
  await localStore.set("tickets", tickets.map((t) => (t.id === ticketId ? updatedTicket : t)));

  // Cascade the confirmation to the linked donation and request records.
  const donations = await localStore.get<Donation>("donations", DONATIONS);
  await localStore.set(
    "donations",
    donations.map((d) => (d.ticketId === ticketId ? { ...d, status: "confirmed" as const } : d))
  );
  const requests = await localStore.get<HelpRequest>("requests", REQUESTS);
  await localStore.set(
    "requests",
    requests.map((r) => (r.ticketId === ticketId ? { ...r, status: "confirmed" as const } : r))
  );

  return { success: true, message: "Pickup confirmed.", ticket: updatedTicket };
}

// ── Leaderboard & badges ──────────────────────────────────────────

export async function listBadges() {
  return BADGES;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  // Seeded leaderboard — in a real backend this would be a query
  // aggregating confirmed donations by donor, sorted descending.
  return [
    { donorId: "donor-1", name: "Basak Sari-Sari Store", totalGivenPhp: 18400, matchesCount: 32, badgeIds: ["first-harvest", "bayani-barangay"] },
    { donorId: "donor-3", name: "Dela Peña Family", totalGivenPhp: 11050, matchesCount: 21, badgeIds: ["first-harvest"] },
    { donorId: "donor-2", name: "Tipolo Bakeshop", totalGivenPhp: 7900, matchesCount: 14, badgeIds: ["first-harvest"] },
    { donorId: "donor-4", name: "Subangdaku Rotary Club", totalGivenPhp: 6200, matchesCount: 11, badgeIds: [] },
    { donorId: "donor-5", name: "M. Fernandez", totalGivenPhp: 4850, matchesCount: 9, badgeIds: [] },
  ];
}

// ── Admin: matching queue ─────────────────────────────────────────

export async function listUnmatchedDonations(): Promise<Donation[]> {
  const all = await listDonations();
  return all.filter((d) => d.status === "matching" || d.status === "unmatched");
}

export async function listUnmatchedRequests(): Promise<HelpRequest[]> {
  const all = await listRequests();
  return all.filter((r) => r.status === "unmatched");
}

/** Admin confirms a suggested donation↔request pair, generating a new ticket. */
export async function confirmMatch(donationId: string, requestId: string): Promise<MatchTicket> {
  const donations = await listDonations();
  const requests = await listRequests();
  const donation = donations.find((d) => d.id === donationId);
  const request = requests.find((r) => r.id === requestId);
  if (!donation || !request) throw new Error("Donation or request not found.");

  const ticketId = `MC-${Math.floor(Math.random() * 900 + 100)}`;
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ticket: MatchTicket = {
    id: ticketId,
    donationId,
    requestId,
    donorName: donation.donorName,
    recipientName: request.recipientName,
    contents: donation.description,
    code,
    status: "awaiting_pickup",
  };

  const tickets = await listTickets();
  await localStore.set("tickets", [ticket, ...tickets]);
  await localStore.set(
    "donations",
    donations.map((d) => (d.id === donationId ? { ...d, status: "awaiting_pickup" as const, matchedRequestId: requestId, ticketId } : d))
  );
  await localStore.set(
    "requests",
    requests.map((r) => (r.id === requestId ? { ...r, status: "awaiting_pickup" as const, matchedDonationId: donationId, ticketId } : r))
  );

  return ticket;
}

// ── Admin: overview & verification ────────────────────────────────

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const donations = await listDonations();
  const requests = await listRequests();
  
  const pendingMatches = donations.filter((d) => d.status === "awaiting_pickup" || d.status === "matching").length;
  const deliveredThisMonth = donations.filter((d) => d.status === "confirmed").length;
  
  // Base sum + seeded baseline
  const baseValueDonated = donations.reduce((sum, d) => sum + (d.amountPhp ?? 0), 0);
  const totalValueDonatedPhp = baseValueDonated + 312000; 

  const activeRequests = requests.filter((r) => r.status === "unmatched" || r.status === "matching");
  const activeRequestsElderly = activeRequests.filter((r) => r.priorityTier === "elderly").length;
  const activeRequestsPWD = activeRequests.filter((r) => r.priorityTier === "pwd").length;
  const activeRequestsInfant = activeRequests.filter((r) => r.priorityTier === "infant").length;

  const foodDonationsCount = donations.filter(d => d.kind === "food" && d.createdAt.startsWith("2026-07")).length + 145; // seeded baseline
  const cashDonationsTotal = baseValueDonated + 85000; // seeded baseline

  return {
    pendingMatches: pendingMatches || 14,
    deliveredThisMonth: deliveredThisMonth || 208,
    totalValueDonatedPhp,
    confirmedWithin24hPct: 96,
    
    activeRequestsTotal: activeRequests.length || 42, // seeded baseline
    activeRequestsElderly: activeRequestsElderly || 18,
    activeRequestsPWD: activeRequestsPWD || 12,
    activeRequestsInfant: activeRequestsInfant || 8,
    
    foodDonationsCount,
    cashDonationsTotal,
  };
}

export async function listVerificationQueue(): Promise<VerificationCase[]> {
  return localStore.get<VerificationCase>("verification", VERIFICATION_QUEUE);
}

export async function approveVerification(caseId: string): Promise<void> {
  const all = await listVerificationQueue();
  await localStore.set(
    "verification",
    all.map((v) => (v.id === caseId ? { ...v, status: "approved" as const } : v))
  );
}

// ── Analytics ──────────────────────────────────────────────────────

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  // Seeded analytics snapshot — in a real backend this would be a set
  // of aggregate queries (grouped counts/sums) rather than static data.
  return {
    householdsHelped: 208,
    totalValuePhp: 312000,
    avgMatchTimeHours: 4.6,
    confirmedWithin24hPct: 96,
    foodVsCash: { food: 60, cash: 40 },
    priorityMix: { elderly: 96, pwd: 54, infant: 41, general: 17 },
    matchesByBarangay: [
      { barangay: "Basak", matches: 64 },
      { barangay: "Tipolo", matches: 47 },
      { barangay: "Subangdaku", matches: 38 },
      { barangay: "Ibabao", matches: 29 },
    ],
    topDonors: [
      { name: "Basak Sari-Sari Store", givenPhp: 18400, trendPct: 12 },
      { name: "Dela Peña Family", givenPhp: 11050, trendPct: 4 },
      { name: "Tipolo Bakeshop", givenPhp: 7900, trendPct: -3 },
      { name: "Subangdaku Rotary Club", givenPhp: 6200, trendPct: 21 },
      { name: "M. Fernandez", givenPhp: 4850, trendPct: 8 },
    ],
  };
}
