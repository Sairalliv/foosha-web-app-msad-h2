import { createClient } from '@/lib/supabase/server'
import { DonationLocation } from '@/types/map'

export async function getDonationLocations(): Promise<DonationLocation[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('donation_locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching donation locations:', error)
    return []
  }

  return data as DonationLocation[]
}
