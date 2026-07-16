import { requireAdmin } from '@/lib/auth/guards'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Admin Panel - Foosha',
}

export default async function AdminPage() {
  const { profile } = await requireAdmin()

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
        <div className="logo-sub">City government</div>

        <div className="nav-group">
          <div className="nav-label">Menu</div>
          <Link href="/dashboard" className="nav-item">
            <span>◆ Dashboard</span>
          </Link>
          <Link href="/admin" className="nav-item active">
            <span>◆ Admin Panel</span>
          </Link>
        </div>
      </aside>

      <main>
        <div className="page-head">
          <div>
            <div className="eyebrow">Admin</div>
            <h1>Admin Dashboard</h1>
            <p className="sub">Welcome back, {profile.full_name}. You have full access to system settings.</p>
          </div>
        </div>

        <div className="grid-2">
          <div className="panel">
            <div className="panel-head">
              <h3>User Management</h3>
            </div>
            <p className="sub" style={{ margin: '0 0 16px' }}>View, ban, or assign roles to users.</p>
            <button className="btn btn-primary btn-sm">Manage Users</button>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>System Logs</h3>
            </div>
            <p className="sub" style={{ margin: '0 0 16px' }}>Monitor authentication events and system errors.</p>
            <button className="btn btn-primary btn-sm">View Logs</button>
          </div>
        </div>
      </main>
    </div>
  )
}
