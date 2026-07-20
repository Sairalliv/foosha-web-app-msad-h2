'use client'

import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Loader2, X } from 'lucide-react'

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), {
  ssr: false,
  loading: () => <div className="location-picker-map-loading">Loading map…</div>,
})

// Cebu City — matches the default center used across the app's other maps.
const DEFAULT_CENTER: [number, number] = [10.3157, 123.8854]

interface LocationPickerProps {
  /** Called with a human-readable address whenever a point is resolved. */
  onSelect: (address: string) => void
  /** Optional map center override, e.g. to center on a user's approximate area. */
  initialCenter?: [number, number]
}

export function LocationPicker({ onSelect, initialCenter }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  const [pickError, setPickError] = useState('')

  const handlePick = useCallback(async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    setIsResolving(true)
    setPickError('')

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { Accept: 'application/json' } }
      )
      if (!res.ok) throw new Error(`Reverse geocoding failed with status ${res.status}`)

      const data = await res.json()
      const label: string | undefined = data?.display_name

      if (label) {
        onSelect(label)
      } else {
        setPickError("Couldn't find an address for that spot — try a nearby point, or type it in manually.")
      }
    } catch (err) {
      console.error(err)
      setPickError("Couldn't look up that address right now. Try again, or type it in manually.")
    } finally {
      setIsResolving(false)
    }
  }, [onSelect])

  return (
    <div className="location-picker">
      <button
        type="button"
        className="location-picker-toggle"
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <X size={13} /> : <MapPin size={13} />}
        {isOpen ? 'Hide map' : 'Pick on map instead'}
      </button>

      {isOpen && (
        <div className="location-picker-panel">
          <div className="location-picker-map">
            <LocationPickerMap
              onPick={handlePick}
              initialCenter={initialCenter ?? DEFAULT_CENTER}
              markerPosition={markerPosition}
            />
          </div>
          <div className="location-picker-status">
            {isResolving && (
              <span className="location-picker-resolving">
                <Loader2 size={13} className="location-picker-spin" /> Looking up address…
              </span>
            )}
            {!isResolving && pickError && <span className="location-picker-error">{pickError}</span>}
            {!isResolving && !pickError && !markerPosition && (
              <span>Tap a spot on the map to fill in the address below.</span>
            )}
            {!isResolving && !pickError && markerPosition && (
              <span>Address filled in below — feel free to edit it for accuracy.</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
