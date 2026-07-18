import { getSupabaseService } from '@/lib/supabaseService.server'
import { MatchingQueueClient } from '@/components/admin/MatchingQueueClient'

export const metadata = {
  title: 'Matching Queue - Foosha Admin',
}

export default async function MatchingQueuePage() {
  const supabaseService = await getSupabaseService()
  const [donations, requests] = await Promise.all([
    supabaseService.getDonations(),
    supabaseService.getRequests(),
  ])

  // Filter for pending ones only for the matching queue
  const pendingDonations = donations.filter(d => d.status === 'Available')
  const pendingRequests = requests.filter(r => r.status === 'Pending')

  return (
    <MatchingQueueClient 
      initialDonations={pendingDonations} 
      initialRequests={pendingRequests} 
    />
  )
}
