import { requireUserProfile } from '@/lib/auth/guards'
import { DonorDashboard } from '@/components/dashboard/DonorDashboard'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { getDisplayName } from '@/lib/utils/name'

export const metadata = {
  title: 'Donor Dashboard - Foosha',
}

export default async function DonorPage() {
  // Server-side guard: redirects to /login if there's no active session.
  // DonorDashboard re-checks the session client-side before it queries or
  // inserts, since RLS decisions have to be made per-request anyway.
  const { user, profile } = await requireUserProfile()

  const displayName = getDisplayName(profile?.full_name, user.email, 'Donor')
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="app">
      <DashboardSidebar
        displayName={displayName}
        initials={initials}
        role="donor"
        avatarUrl={profile?.avatar_url}
        showAdminLink={profile?.role === 'admin'}
      />

      <main style={{ padding: '36px 44px' }}>
        <DonorDashboard />
      </main>
    </div>
  )
}
