import { RecordsTableClient } from '@/components/admin/RecordsTableClient'
import type { Donation, HelpRequest } from '@/lib/supabaseService'

// TODO(backend): once search is wired up, swap this for the real service call, e.g.:
//   import { getSupabaseService } from '@/lib/supabaseService.server'
//   const supabaseService = await getSupabaseService()
//   const [donations, requests] = await Promise.all([
//     supabaseService.searchDonations(query),
//     supabaseService.searchRequests(query),
//   ])
// Both methods should do a live lookup against donor/requestor name, item/need, and ID.

export const metadata = {
  title: 'Search - Foosha Admin',
}

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const rawQuery = resolvedParams?.q
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : ''
  const hasQuery = query.length > 0

  // Placeholder until the backend search is connected.
  const donations: Donation[] = []
  const requests: HelpRequest[] = []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--paper-dim)',
          marginBottom: 6
        }}>
          Search results
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: 0, color: 'var(--paper)' }}>
          {hasQuery ? `\u201c${query}\u201d` : 'No search query'}
        </h1>
        <p style={{ color: 'var(--paper-dim)', fontSize: '14px', marginTop: 8 }}>
          {hasQuery
            ? `${donations.length} donation${donations.length === 1 ? '' : 's'} and ${requests.length} request${requests.length === 1 ? '' : 's'} matched.`
            : 'Type in the search bar above to look up a donor, requestor, or record ID.'}
        </p>
      </div>

      {hasQuery ? (
        <>
          <RecordsTableClient title="Matching Donations" type="donations" initialData={donations} />
          <RecordsTableClient title="Matching Requests" type="requests" initialData={requests} />
        </>
      ) : (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          color: 'var(--paper-dim)',
          border: '1px dashed var(--line)',
          borderRadius: '12px'
        }}>
          Enter a search term above to see matching donations and requests here.
        </div>
      )}
    </div>
  )
}
