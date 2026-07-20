import { requireUser } from '@/lib/auth/guards'
import { DonorDashboard } from '@/components/dashboard/DonorDashboard'

export const metadata = {
  title: 'Donor Dashboard - Foosha',
}

export default async function DonorPage() {
  // Server-side guard: redirects to /login if there's no active session.
  // DonorDashboard re-checks the session client-side before it queries or
  // inserts, since RLS decisions have to be made per-request anyway.
  await requireUser()

  return (
    <main style={{ padding: '36px 44px' }}>
      <DonorDashboard />
    </main>
  )
}
