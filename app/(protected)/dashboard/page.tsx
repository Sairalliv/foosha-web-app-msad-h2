import { requireUserProfile } from '@/lib/auth/guards'
import { logoutAction } from '@/actions/auth-actions'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Dashboard - Foosha',
}

export default async function DashboardPage() {
  const { user, profile } = await requireUserProfile()

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
          {profile?.role === 'admin' && (
            <Link href="/admin" className="nav-item">
              <span>◆ Admin Panel</span>
            </Link>
          )}
        </div>

        <div className="sidebar-foot">
          <form action={logoutAction}>
            <button type="submit" className="mini-profile" style={{ width: '100%' }}>
              <div className="avatar">{initials || 'U'}</div>
              <div>
                <div className="who">{displayName}</div>
                <div className="role">{profile?.role || 'user'} · Log out</div>
              </div>
            </button>
          </form>
        </div>
      </aside>

      <main>
        <div className="welcome-card">
          <div className="welcome-text">
            <div className="eyebrow">Dashboard</div>
            <h1>Welcome back, {displayName.split(' ')[0]}</h1>
            <p className="sub">Here&apos;s what&apos;s happening with your account.</p>
          </div>
          <div className="welcome-avatar">{initials || 'U'}</div>
        </div>

        <div className="grid-3">
          <div className="panel">
            <h3>User Profile</h3>
            <p className="sub" style={{ margin: '10px 0 16px' }}>
              View and edit your personal information and preferences.
            </p>
            <button className="btn btn-ghost btn-sm">Manage Profile</button>
          </div>

          <div className="panel">
            <h3>Billing &amp; Subscriptions</h3>
            <p className="sub" style={{ margin: '10px 0 16px' }}>
              Manage your payment methods and current plans.
            </p>
            <button className="btn btn-ghost btn-sm">Manage Billing</button>
          </div>

          <div className="panel">
            <h3>Security</h3>
            <p className="sub" style={{ margin: '10px 0 16px' }}>
              Update your password and configure two-factor authentication.
            </p>
            <button className="btn btn-ghost btn-sm">Security Settings</button>
          </div>
        </div>
      </main>
    </div>
  )
}
