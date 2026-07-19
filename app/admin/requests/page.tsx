import { getSupabaseService } from '@/lib/supabaseService.server'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'
import type { HelpRequest } from '@/lib/supabaseService'

export const metadata = {
  title: 'Requests Record - Foosha Admin',
}

export default async function RequestsPage() {
  const supabaseService = await getSupabaseService()
  const requests = await supabaseService.getRequests().catch((err) => {
    console.error('Failed to load requests:', err)
    return [] as HelpRequest[]
  })

  return (
    <RecordsTableClient
      title="Assistance Requests Record"
      type="requests"
      initialData={requests}
    />
  )
}
