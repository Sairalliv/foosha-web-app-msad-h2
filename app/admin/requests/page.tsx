import { supabaseService } from '@/lib/supabaseService'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'

export const metadata = {
  title: 'Requests Record - Foosha Admin',
}

export default async function RequestsPage() {
  const requests = await supabaseService.getRequests()

  return (
    <RecordsTableClient 
      title="Assistance Requests Record"
      type="requests"
      initialData={requests} 
    />
  )
}
