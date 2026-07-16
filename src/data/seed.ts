import type {
  Donation,
  HelpRequest,
  MatchTicket,
  DonorProfile,
  RecipientProfile,
  Badge,
  VerificationCase,
} from "./types";

// ── Seed data ─────────────────────────────────────────────────────
// Mirrors the sample content from the original static mockups so the
// app feels populated on first run. Replace with real fetches once a
// database is connected — this file then becomes unused (or a dev
// seeding script for the DB instead).

export const CURRENT_DONOR: DonorProfile = {
  id: "donor-1",
  name: "Basak Sari-Sari Store",
  barangay: "Basak",
  avatarInitials: "BS",
  totalGivenPhp: 18400,
  matchesCount: 32,
  cityRank: 1,
  badges: ["first-harvest", "bayani-barangay"],
};

export const CURRENT_RECIPIENT: RecipientProfile = {
  id: "recipient-1",
  name: "P. Ramos household",
  barangay: "Basak",
  avatarInitials: "PR",
  priorityTier: "elderly",
  confirmedAllTime: 6,
};

export const BADGES: Badge[] = [
  { id: "first-harvest", name: "First Harvest", description: "Your first donation", thresholdMatches: 1 },
  { id: "bayani-barangay", name: "Bayani ng Barangay", description: "25 matches in one barangay", thresholdMatches: 25 },
  { id: "kalamansi-giver", name: "Kalamansi Giver", description: "Give for 3 months straight", thresholdMatches: 0 },
  { id: "bayani-bayan", name: "Bayani ng Bayan", description: "75 lifetime matches", thresholdMatches: 75 },
];

export const DONATIONS: Donation[] = [
  { id: "d-1", donorId: "donor-1", donorName: "Basak Sari-Sari Store", kind: "food", description: "Rice, canned goods, milk", barangay: "Basak", createdAt: "2026-07-02", status: "awaiting_pickup", matchedRequestId: "r-1", ticketId: "MC-0417" },
  { id: "d-2", donorId: "donor-1", donorName: "Basak Sari-Sari Store", kind: "cash", description: "₱500 cash gift", amountPhp: 500, barangay: "Basak", createdAt: "2026-06-28", status: "confirmed", matchedRequestId: "r-2", ticketId: "MC-0298" },
  { id: "d-3", donorId: "donor-1", donorName: "Basak Sari-Sari Store", kind: "food", description: "Bread, 2 dozen eggs", barangay: "Basak", createdAt: "2026-07-05", status: "matching" },
  { id: "d-4", donorId: "donor-1", donorName: "Basak Sari-Sari Store", kind: "cash", description: "₱1,200 cash gift", amountPhp: 1200, barangay: "Basak", createdAt: "2026-07-04", status: "awaiting_pickup", matchedRequestId: "r-4", ticketId: "MC-0512" },
  { id: "d-5", donorId: "donor-2", donorName: "Tipolo Bakeshop", kind: "food", description: "Bread, eggs, coffee", barangay: "Tipolo", distanceKm: 0.6, createdAt: "2026-06-20", status: "confirmed", ticketId: "MC-0201" },
  { id: "d-6", donorId: "donor-3", donorName: "Dela Peña Family", kind: "food", description: "Vegetables, dried fish", barangay: "Basak", distanceKm: 1.2, createdAt: "2026-06-22", status: "confirmed", ticketId: "MC-0301" },
  { id: "d-7", donorId: "donor-4", donorName: "Subangdaku Rotary Club", kind: "cash", description: "₱300 cash fund — elderly priority", amountPhp: 300, barangay: "Subangdaku", distanceKm: 1.8, createdAt: "2026-06-14", status: "confirmed", ticketId: "MC-0255" },
  { id: "d-8", donorId: "donor-5", donorName: "M. Fernandez", kind: "cash", description: "₱1,000 cash fund", amountPhp: 1000, barangay: "Ibabao", createdAt: "2026-07-05", status: "matching" },
];

export const REQUESTS: HelpRequest[] = [
  { id: "r-1", recipientId: "recipient-1", recipientName: "P. Ramos household", kind: "food", description: "Rice, canned goods, milk", barangay: "Basak", priorityTier: "elderly", createdAt: "2026-07-02", status: "awaiting_pickup", matchedDonationId: "d-1", ticketId: "MC-0417" },
  { id: "r-2", recipientId: "recipient-2", recipientName: "Lolo Vicente", kind: "cash", description: "₱500 cash", amountPhp: 500, barangay: "Basak", priorityTier: "elderly", createdAt: "2026-06-28", status: "confirmed", matchedDonationId: "d-2", ticketId: "MC-0298" },
  { id: "r-3", recipientId: "recipient-3", recipientName: "R. Amistad household", kind: "cash", description: "₱600 cash assistance — medicine", amountPhp: 600, barangay: "Tipolo", priorityTier: "pwd", createdAt: "2026-07-06", status: "unmatched" },
  { id: "r-4", recipientId: "recipient-1", recipientName: "P. Ramos household", kind: "cash", description: "₱800 cash assistance", amountPhp: 800, barangay: "Basak", priorityTier: "elderly", createdAt: "2026-06-30", status: "awaiting_pickup", matchedDonationId: "d-4", ticketId: "MC-0512" },
  { id: "r-5", recipientId: "recipient-4", recipientName: "Santos family, newborn twins", kind: "food", description: "Milk, diapers", barangay: "Subangdaku", priorityTier: "infant", createdAt: "2026-07-07", status: "unmatched" },
  { id: "r-6", recipientId: "recipient-5", recipientName: "Dela Cruz household", kind: "food", description: "General food assistance", barangay: "Basak", priorityTier: "elderly", createdAt: "2026-07-01", status: "unmatched" },
];

export const TICKETS: MatchTicket[] = [
  { id: "MC-0417", donationId: "d-1", requestId: "r-1", donorName: "Basak Sari-Sari Store", recipientName: "P. Ramos household", contents: "Rice, canned goods, milk", code: "7Q3K9X", status: "awaiting_pickup" },
  { id: "MC-0298", donationId: "d-2", requestId: "r-2", donorName: "Basak Sari-Sari Store", recipientName: "Lolo Vicente", contents: "₱500 cash gift", code: "4M2P7L", status: "confirmed", confirmedAt: "2026-06-28T14:14:00" },
  { id: "MC-0512", donationId: "d-4", requestId: "r-4", donorName: "Basak Sari-Sari Store", recipientName: "P. Ramos household", contents: "₱1,200 cash gift", code: "9X4T2Q", status: "awaiting_pickup" },
];

export const VERIFICATION_QUEUE: VerificationCase[] = [
  { id: "v-1", recipientName: "Santos family", barangay: "Subangdaku", claim: "Infant priority — newborn twins", documentSubmitted: true, status: "pending" },
  { id: "v-2", recipientName: "R. Amistad household", barangay: "Tipolo", claim: "PWD priority", documentSubmitted: true, status: "pending" },
  { id: "v-3", recipientName: "J. Villanueva", barangay: "Basak", claim: "Elderly priority", documentSubmitted: false, status: "pending" },
];
