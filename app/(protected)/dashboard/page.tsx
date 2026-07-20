import { requireUserProfile } from '@/lib/auth/guards'
import { DonorDashboard } from '@/components/dashboard/DonorDashboard'
import { RecipientDashboard } from '@/components/dashboard/RecipientDashboard'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - Foosha',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { user, profile } = await requireUserProfile()
  const resolvedParams = await searchParams

  const effectiveRole = resolvedParams?.demo_role || profile?.role || 'donor'

  const displayName = profile?.full_name || user.email || 'there'
  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="app">
      <DashboardSidebar
        displayName={displayName}
        initials={initials}
        role={effectiveRole as string}
        avatarUrl={profile?.avatar_url}
        showAdminLink={effectiveRole === 'admin'}
      />

      <main>
        {effectiveRole === 'donor' && <DonorDashboard />}
        {effectiveRole === 'recipient' && <RecipientDashboard />}
        {effectiveRole === 'admin' && (
          <div>
            <div className="welcome-card mb-8">
              <div className="welcome-text">
                <div className="eyebrow">Admin Dashboard</div>
                <h1>Welcome back, {displayName.split(' ')[0]}</h1>
                <p className="sub">You are viewing the basic dashboard. The full admin portal contains all operations.</p>
              </div>
              <div className="welcome-avatar">{initials || 'A'}</div>
            </div>
            <div className="panel flex-1 bg-[var(--bg-panel)] border border-[var(--line)]">
              <h3 className="text-xl font-display text-primary mb-2">Access Admin Portal</h3>
              <p className="sub mb-6 text-paper-dim">
                Manage verifications, view analytics, and oversee operations from the dedicated admin interface.
              </p>
              <Link href="/admin" className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '4px', display: 'inline-block', fontWeight: 'bold' }}>
                Open Admin Portal
              </Link>
            </div>
          </div>
        )}
        
        {!['donor', 'recipient', 'admin'].includes(effectiveRole as string) && (
          <div className="welcome-card">
            <div className="welcome-text">
              <div className="eyebrow">Dashboard</div>
              <h1>Welcome back, {displayName.split(' ')[0]}</h1>
              <p className="sub">Please update your profile to select a role.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

