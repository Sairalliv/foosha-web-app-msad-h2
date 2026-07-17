import { getSupabaseService } from '@/lib/supabaseService.server'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'

export const metadata = {
  title: 'Donations Record - Foosha Admin',
}

export default async function DonationsPage() {
  const supabaseService = await getSupabaseService()
  const donations = await supabaseService.getDonations()

  return (
    <RecordsTableClient 
      title="Donations Record"
      type="donations"
      initialData={donations} 
    />
  )
}
