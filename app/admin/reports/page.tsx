import { supabaseService } from '@/lib/supabaseService'
import { ReportsClient } from '@/components/admin/ReportsClient'

export const metadata = {
  title: 'Reports & Export - Foosha Admin',
}

export default async function ReportsPage() {
  const [donations, requests] = await Promise.all([
    supabaseService.getDonations(),
    supabaseService.getRequests(),
  ])

  return <ReportsClient initialDonations={donations} initialRequests={requests} />
}
