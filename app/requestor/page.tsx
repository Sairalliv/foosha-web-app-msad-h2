import { requireUser } from '@/lib/auth/guards'
import { RecipientDashboard } from '@/components/dashboard/RecipientDashboard'

export const metadata = {
  title: 'Requestor Dashboard - Foosha',
}

export default async function RequestorPage() {
  // Server-side guard: redirects to /login if there's no active session.
  // RecipientDashboard re-checks the session client-side before it queries,
  // inserts, or confirms a pickup, since RLS decisions are per-request anyway.
  await requireUser()

  return (
    <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 44px' }}>
      <RecipientDashboard />
    </main>
  )
}
