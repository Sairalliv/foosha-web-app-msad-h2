'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { DonationLocation } from '@/types/map'
import MapFilters from './MapFilters'

// Dynamically import the map to avoid SSR issues with Leaflet
const DonationMap = dynamic(() => import('./DonationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-700 font-bold animate-pulse">Loading Interactive Map...</p>
      </div>
    </div>
  )
})

interface MapPageClientProps {
  initialLocations: DonationLocation[]
  isFullScreen?: boolean
}

export default function MapPageClient({ initialLocations, isFullScreen = false }: MapPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Extract unique categories for the filter panel
  const categories = useMemo(() => {
    const cats = new Set(initialLocations.map(loc => loc.category).filter(Boolean) as string[])
    return Array.from(cats).sort()
  }, [initialLocations])

  return (
    <div className={`relative w-full overflow-hidden ${isFullScreen ? 'h-screen' : 'h-[calc(100vh-64px)]'}`}>
      <MapFilters 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DonationMap 
        locations={initialLocations} 
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        isFullScreen={isFullScreen}
      />
    </div>
  )
}

