import { requireUserProfile } from '@/lib/auth/guards'
import { logoutAction } from '@/actions/auth-actions'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - Foosha',
}

export default async function DashboardPage() {
  const { user, profile } = await requireUserProfile()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-indigo-600">Foosha App</div>
        <div className="flex gap-4 items-center">
          <div className="text-sm">
            Signed in as <strong>{profile?.full_name || user.email}</strong>
            <span className="ml-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {profile?.role || 'user'}
            </span>
          </div>
          {profile?.role === 'admin' && (
            <Link href="/admin" className="text-sm text-indigo-600 hover:underline font-medium">
              Admin Panel
            </Link>
          )}
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              Log out
            </button>
          </form>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Example cards */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-2">User Profile</h3>
            <p className="text-gray-600 text-sm mb-4">View and edit your personal information and preferences.</p>
            <button className="text-indigo-600 text-sm font-medium hover:underline">Manage Profile</button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-2">Billing & Subscriptions</h3>
            <p className="text-gray-600 text-sm mb-4">Manage your payment methods and current plans.</p>
            <button className="text-indigo-600 text-sm font-medium hover:underline">Manage Billing</button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg mb-2">Security</h3>
            <p className="text-gray-600 text-sm mb-4">Update your password and configure two-factor authentication.</p>
            <button className="text-indigo-600 text-sm font-medium hover:underline">Security Settings</button>
          </div>
        </div>
      </main>
    </div>
  )
}
