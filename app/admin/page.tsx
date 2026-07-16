import { supabaseService } from '@/lib/supabaseService'
import { OverviewDashboard } from '@/components/admin/OverviewDashboard'

export const metadata = {
  title: 'Admin Overview - Foosha',
}

export default async function AdminOverviewPage() {
  const [matchingQueue, verificationFeed, leaderboard] = await Promise.all([
    supabaseService.getMatchingQueue(),
    supabaseService.getVerificationFeed(),
    supabaseService.getLeaderboard(),
  ])

  return (
    <OverviewDashboard 
      initialMatchingQueue={matchingQueue} 
      initialVerificationFeed={verificationFeed}
      initialLeaderboard={leaderboard}
    />
  )
}
