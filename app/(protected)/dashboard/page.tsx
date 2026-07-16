import { requireUserProfile } from '@/lib/auth/guards'
import { logoutAction } from '@/actions/auth-actions'
import Link from 'next/link'
import Image from 'next/image'
import { DonorDashboard } from '@/components/dashboard/DonorDashboard'
import { RecipientDashboard } from '@/components/dashboard/RecipientDashboard'
import { DemoRoleSwitcher } from '@/components/dashboard/DemoRoleSwitcher'

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
      <DemoRoleSwitcher />
      <aside className="sidebar">
        <Image
          className="logo-mark"
          src="/assets/foosha-logo.png"
          alt="Foosha"
          width={712}
          height={201}
        />

        <div className="nav-group">
          <div className="nav-label">Menu</div>
          <Link href="/dashboard" className="nav-item active">
            <span>◆ Dashboard</span>
          </Link>
          {effectiveRole === 'admin' && (
            <Link href="/admin" className="nav-item">
              <span>◆ Admin Portal</span>
            </Link>
          )}
        </div>

        <div className="sidebar-foot">
          <form action={logoutAction}>
            <button type="submit" className="mini-profile" style={{ width: '100%' }}>
              <div className="avatar">{initials || 'U'}</div>
              <div>
                <div className="who">{displayName}</div>
                <div className="role">{effectiveRole} · Log out</div>
              </div>
            </button>
          </form>
        </div>
      </aside>

      <main>
        {effectiveRole === 'donor' && <DonorDashboard displayName={displayName} initials={initials} />}
        {effectiveRole === 'recipient' && <RecipientDashboard displayName={displayName} initials={initials} />}
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
