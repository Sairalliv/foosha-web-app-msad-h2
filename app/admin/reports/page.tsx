import { getSupabaseService } from '@/lib/supabaseService.server'
import { ReportsClient } from '@/components/admin/ReportsClient'
import type { Donation, HelpRequest } from '@/lib/supabaseService'

export const metadata = {
  title: 'Reports & Export - Foosha Admin',
}

export default async function ReportsPage() {
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

  return <ReportsClient initialDonations={donations} initialRequests={requests} />
}
