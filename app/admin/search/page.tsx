import { getSupabaseService } from '@/lib/supabaseService.server'
import { RecordsTableClient } from '@/components/admin/RecordsTableClient'
import Link from 'next/link'

const ADMIN_PAGES = [
  { name: 'Overview', href: '/admin', keywords: ['overview', 'dashboard', 'home', 'main'] },
  { name: 'Matching Queue', href: '/admin/matching', keywords: ['matching', 'queue', 'auto match', 'pending'] },
  { name: 'All Donations', href: '/admin/donations', keywords: ['donations', 'all donations', 'donors', 'give'] },
  { name: 'All Requests', href: '/admin/requests', keywords: ['requests', 'all requests', 'families', 'help', 'need'] },
  { name: 'Analytics', href: '/admin/analytics', keywords: ['analytics', 'stats', 'statistics', 'metrics', 'insights', 'data', 'charts'] },
  { name: 'Reports & Export', href: '/admin/reports', keywords: ['reports', 'export', 'csv', 'download', 'print'] },
  { name: 'Verification Center', href: '/admin/verification', keywords: ['verification', 'verify', 'otp', 'security', 'code', 'pickup'] },
]

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
  
  const queryLower = query.toLowerCase()
  const matchedPages = query.trim() ? ADMIN_PAGES.filter(page => 
    page.name.toLowerCase().includes(queryLower) || 
    page.keywords.some(k => k.includes(queryLower))
  ) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '48px' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', margin: '0 0 8px 0', color: 'var(--paper)' }}>
          Search Results for "{query}"
        </h1>
        <p style={{ margin: 0, color: 'var(--paper-dim)', fontSize: '15px' }}>
          Found {matchedPages.length} pages, {requests.length} families, and {donations.length} donors.
        </p>
      </div>

      {matchedPages.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: '0 0 16px 0', color: 'var(--paper)' }}>Quick Links</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {matchedPages.map(page => (
              <Link key={page.href} href={page.href} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: 'var(--bg-panel)', 
                  border: '1px solid var(--teal)', 
                  borderRadius: '8px', 
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '15px' }}>{page.name}</span>
                  <span style={{ color: 'var(--paper-dim)', fontSize: '18px' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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

      {requests.length === 0 && donations.length === 0 && matchedPages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--line)' }}>
          <p style={{ color: 'var(--paper-dim)', fontSize: '16px' }}>No matching records or pages found for "{query}".</p>
        </div>
      )}
    </div>
  )
}
