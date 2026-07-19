'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPinned, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { DonationLocation } from '@/types/map'

// Dynamically import the map to avoid SSR issues with Leaflet, same as the
// full /map page does.
const DonationMap = dynamic(() => import('@/components/map/DonationMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

interface NearbyMapPanelProps {
  title?: string
  subtitle?: string
  /** Compact map height. Defaults to a card-friendly size. */
  height?: number
  /** Cap on how many mapped locations to pull in — the dashboards only need
   *  a preview; the full /map page has no limit. */
  limit?: number
  /** Set to false when the parent already spaces its children (e.g. a flex
   *  column with `gap`) so the panel doesn't get double margin. */
  withTopMargin?: boolean
}

export function NearbyMapPanel({
  title = 'Donation Map',
  subtitle = 'Centers, pantries, and NGOs currently accepting or distributing donations.',
  height = 320,
  limit = 60,
  withTopMargin = true,
}: NearbyMapPanelProps) {
  const [locations, setLocations] = useState<DonationLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const supabase = createClient()

    supabase
      .from('donation_locations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data, error: fetchError }) => {
        if (!active) return
        if (fetchError) {
          console.error('Failed to load donation locations:', fetchError)
          setError('Map data is unavailable right now.')
        }
        setLocations((data as DonationLocation[]) ?? [])
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [limit])

  return (
    <div style={withTopMargin ? { marginTop: '32px' } : undefined}>
      <div className="panel-head">
        <h3>{title}</h3>
        <Link href="/map" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          Open full map <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {subtitle && (
          <p className="sub" style={{ margin: 0, padding: '16px 20px 0' }}>
            {subtitle}
          </p>
        )}

        {isLoading ? (
          <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--paper-dim)' }}>
            Loading donation centers…
          </div>
        ) : error ? (
          <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff8a63' }}>
            {error}
          </div>
        ) : locations.length === 0 ? (
          <div
            style={{
              height,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--paper-dim)',
            }}
          >
            <MapPinned size={20} />
            No donation centers mapped yet.
          </div>
        ) : (
          <div style={{ marginTop: subtitle ? '12px' : 0 }}>
            <DonationMap
              locations={locations}
              selectedCategory={null}
              searchQuery=""
              height={`${height}px`}
              defaultZoom={12}
              scrollWheelZoom={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
