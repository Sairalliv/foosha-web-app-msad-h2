import { requireAdmin } from '@/lib/auth/guards'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireAdmin()

  const displayName = profile?.full_name || 'Admin User'
  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', height: '100vh', overflow: 'hidden', background: 'var(--bg)', color: 'var(--paper)' }}>
      <AdminSidebar adminName={displayName} adminInitials={initials} />
      
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader title="Admin Dashboard" adminName={displayName} adminInitials={initials} />
        
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
