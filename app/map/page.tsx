import { getDonationLocations } from '@/lib/services/locations'
import MapPageClient from '@/components/map/MapPageClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donation Map | Foosha',
  description: 'Interactive map of donation centers, pantries, and NGOs across Cebu.',
}

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function MapPage() {
  const locations = await getDonationLocations()

  return (
    <main className="w-full h-[calc(100vh-64px)] overflow-hidden">
      <MapPageClient initialLocations={locations} />
    </main>
  )
}
