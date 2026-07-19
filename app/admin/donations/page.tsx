import { getSupabaseService } from '@/lib/supabaseService.server'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'
import type { Donation } from '@/lib/supabaseService'

export const metadata = {
  title: 'Donations Record - Foosha Admin',
}

export default async function DonationsPage() {
  const supabaseService = await getSupabaseService()
  const donations = await supabaseService.getDonations().catch((err) => {
    console.error('Failed to load donations:', err)
    return [] as Donation[]
  })

  return (
    <RecordsTableClient
      title="Donations Record"
      type="donations"
      initialData={donations}
    />
  )
}
