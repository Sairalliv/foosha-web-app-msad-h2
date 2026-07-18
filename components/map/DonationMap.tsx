'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { DonationLocation } from '@/types/map'
import { MapPin, Phone, Clock, PackageOpen, Info, Navigation2 } from 'lucide-react'

// Fix for default Leaflet icon issue in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Active icon for urgent/high need
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface DonationMapProps {
  locations: DonationLocation[]
  selectedCategory: string | null
  searchQuery: string
}

// Component to dynamically update map center
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

export default function DonationMap({ locations, selectedCategory, searchQuery }: DonationMapProps) {
  const [mounted, setMounted] = useState(false)
  const defaultCenter: [number, number] = [10.3157, 123.8854] // Cebu City

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center animate-pulse">
        <p className="text-gray-500 font-medium">Loading Map...</p>
      </div>
    )
  }

  // Filter locations based on category and search
  const filteredLocations = locations.filter((loc) => {
    const matchesCategory = selectedCategory ? loc.category === selectedCategory : true
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery 
      ? loc.organization_name.toLowerCase().includes(searchLower) || 
        loc.address.toLowerCase().includes(searchLower) || 
        (loc.city && loc.city.toLowerCase().includes(searchLower))
      : true
    return matchesCategory && matchesSearch
  })

  // Determine map center based on first filtered result or default
  const mapCenter: [number, number] = filteredLocations.length > 0 
    ? [filteredLocations[0].latitude, filteredLocations[0].longitude] 
    : defaultCenter

  return (
    <div className="w-full h-[calc(100vh-64px)] relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <ChangeView center={mapCenter} zoom={filteredLocations.length === 1 ? 14 : 11} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredLocations.map((location) => {
          const isUrgent = location.status?.toLowerCase().includes('urgent') || location.status?.toLowerCase().includes('high need')
          
          return (
            <Marker 
              key={location.id} 
              position={[location.latitude, location.longitude]}
              icon={isUrgent ? activeIcon : customIcon}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2 border-b pb-2">
                    <div className={`p-1.5 rounded-md ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 m-0 leading-tight text-base">{location.organization_name}</h3>
                      <p className="text-xs text-gray-500 font-medium m-0">{location.category}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    {location.description && (
                      <p className="text-sm text-gray-600 italic leading-snug m-0">"{location.description}"</p>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <Navigation2 size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-700 m-0 leading-tight">{location.address}</p>
                    </div>

                    {location.contact_number && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-700 m-0 font-medium">{location.contact_number}</p>
                      </div>
                    )}

                    {location.operating_hours && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-700 m-0">{location.operating_hours}</p>
                      </div>
                    )}

                    {location.donation_type && location.donation_type.length > 0 && (
                      <div className="flex items-start gap-2 pt-1 border-t mt-2">
                        <PackageOpen size={14} className="text-gray-400 mt-1 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {location.donation_type.map((type, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Info size={14} className={isUrgent ? 'text-red-500' : 'text-emerald-500'} />
                      <span className={`text-xs font-bold ${isUrgent ? 'text-red-600' : 'text-emerald-600'}`}>
                        {location.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
