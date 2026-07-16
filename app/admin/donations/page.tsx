import { supabaseService } from '@/lib/supabaseService'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'

export const metadata = {
  title: 'Donations Record - Foosha Admin',
}

export default async function DonationsPage() {
  const donations = await supabaseService.getDonations()

  return (
    <RecordsTableClient 
      title="Donations Record"
      type="donations"
      initialData={donations} 
    />
  )
}
