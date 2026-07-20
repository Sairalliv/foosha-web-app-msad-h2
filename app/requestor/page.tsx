import { requireUserProfile } from '@/lib/auth/guards'
import { RecipientDashboard } from '@/components/dashboard/RecipientDashboard'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { getDisplayName } from '@/lib/utils/name'

export const metadata = {
  title: 'Requestor Dashboard - Foosha',
}

export default async function RequestorPage() {
  // Server-side guard: redirects to /login if there's no active session.
  // RecipientDashboard re-checks the session client-side before it queries,
  // inserts, or confirms a pickup, since RLS decisions are per-request anyway.
  const { user, profile } = await requireUserProfile()

  const displayName = getDisplayName(profile?.full_name, user.email, 'Household')
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
        role="recipient"
        avatarUrl={profile?.avatar_url}
        showAdminLink={profile?.role === 'admin'}
      />

      <main style={{ padding: '36px 44px' }}>
        <RecipientDashboard />
      </main>
    </div>
  )
}
