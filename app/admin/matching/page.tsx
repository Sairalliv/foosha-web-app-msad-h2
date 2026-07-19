import { getSupabaseService } from '@/lib/supabaseService.server'
import { MatchingQueueClient } from '@/components/admin/MatchingQueueClient'
import type { Donation, HelpRequest } from '@/lib/supabaseService'

export const metadata = {
  title: 'Matching Queue - Foosha Admin',
}

export default async function MatchingQueuePage() {
  const supabaseService = await getSupabaseService()
  const [donations, requests] = await Promise.all([
    supabaseService.getDonations().catch((err) => {
      console.error('Failed to load donations:', err)
      return [] as Donation[]
    }),
    supabaseService.getRequests().catch((err) => {
      console.error('Failed to load requests:', err)
      return [] as HelpRequest[]
    }),
  ])

  // Filter for pending ones only for the matching queue
  const pendingDonations = donations.filter((d) => d.status === 'Available')
  const pendingRequests = requests.filter((r) => r.status === 'Pending')

  return (
    <MatchingQueueClient
      initialDonations={pendingDonations}
      initialRequests={pendingRequests}
    />
  )
}
