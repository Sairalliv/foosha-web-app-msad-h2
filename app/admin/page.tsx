import { getSupabaseService } from '@/lib/supabaseService.server'
import { OverviewDashboard } from '@/components/admin/OverviewDashboard'
import type { MatchingQueueItem, VerificationItem, LeaderboardEntry, OverviewStats } from '@/lib/supabaseService'

export const metadata = {
  title: 'Admin Overview - Foosha',
}

const EMPTY_STATS: OverviewStats = {
  activeRequests: 0,
  activeByTier: { elderly: 0, pwd: 0, infant: 0, general: 0 },
  foodDonationsCount: 0,
  cashTotal: 0,
  deliveredPercent: 0,
}

export default async function AdminOverviewPage() {
  const supabaseService = await getSupabaseService()

  // Fetched independently (not Promise.all) so one failing query doesn't
  // block the others, and any failure falls back to an empty list instead
  // of crashing the whole page — useful while the backend/migrations are
  // still being finished.
  const [matchingQueue, verificationFeed, leaderboard, stats] = await Promise.all([
    supabaseService.getMatchingQueue().catch((err) => {
      console.error('Failed to load matching queue:', err)
      return [] as MatchingQueueItem[]
    }),
    supabaseService.getVerificationFeed().catch((err) => {
      console.error('Failed to load verification feed:', err)
      return [] as VerificationItem[]
    }),
    supabaseService.getLeaderboard().catch((err) => {
      console.error('Failed to load leaderboard:', err)
      return [] as LeaderboardEntry[]
    }),
    supabaseService.getOverviewStats().catch((err) => {
      console.error('Failed to load overview stats:', err)
      return EMPTY_STATS
    }),
  ])

  return (
    <OverviewDashboard
      initialMatchingQueue={matchingQueue}
      initialVerificationFeed={verificationFeed}
      initialLeaderboard={leaderboard}
      stats={stats}
    />
  )
}
