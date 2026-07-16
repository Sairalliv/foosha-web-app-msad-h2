import { requireAdmin } from '@/lib/auth/guards'
import Link from 'next/link'

export const metadata = {
  title: 'Admin Panel - Foosha',
}

export default async function AdminPage() {
  const { profile } = await requireAdmin()

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 shadow-sm px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <div className="font-bold text-xl text-emerald-400">Foosha Admin</div>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white font-medium">
            Back to Dashboard
          </Link>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-slate-400 mb-8">Welcome back, {profile.full_name}. You have full access to system settings.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-lg mb-2 text-slate-100">User Management</h3>
            <p className="text-slate-400 text-sm mb-4">View, ban, or assign roles to users.</p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Manage Users
            </button>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-lg mb-2 text-slate-100">System Logs</h3>
            <p className="text-slate-400 text-sm mb-4">Monitor authentication events and system errors.</p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              View Logs
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
