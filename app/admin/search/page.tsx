import { getSupabaseService } from '@/lib/supabaseService.server'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'

export const metadata = {
  title: 'Search Results - Foosha Admin',
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams
  const query = resolvedParams.q || ''
  const supabaseService = await getSupabaseService()
  
  const { donations, requests } = await supabaseService.getSearchResults(query).catch((err) => {
    console.error('Failed to load search results:', err)
    return { donations: [], requests: [] }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '48px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', margin: '0 0 8px 0', color: 'var(--paper)' }}>
          Search Results for "{query}"
        </h1>
        <p style={{ margin: 0, color: 'var(--paper-dim)', fontSize: '15px' }}>
          Found {requests.length} families and {donations.length} donors.
        </p>
      </div>

      {requests.length > 0 && (
        <RecordsTableClient
          title="Assistance Requests Found"
          type="requests"
          initialData={requests}
        />
      )}

      {donations.length > 0 && (
        <RecordsTableClient
          title="Donations Found"
          type="donations"
          initialData={donations}
        />
      )}

      {requests.length === 0 && donations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--line)' }}>
          <p style={{ color: 'var(--paper-dim)', fontSize: '16px' }}>No matching records found for "{query}".</p>
        </div>
      )}
    </div>
  )
}
