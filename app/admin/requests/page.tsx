import { getSupabaseService } from '@/lib/supabaseService.server'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'

export const metadata = {
  title: 'Requests Record - Foosha Admin',
}

export default async function RequestsPage() {
  const supabaseService = await getSupabaseService()
  const requests = await supabaseService.getRequests()

  return (
    <RecordsTableClient 
      title="Assistance Requests Record"
      type="requests"
      initialData={requests} 
    />
  )
}
