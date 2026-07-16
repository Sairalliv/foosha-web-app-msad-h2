import { requireAdmin } from '@/lib/auth/guards'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata = {
  title: 'Admin Portal - Project Foosha · Mandaue City',
  description:
    'City government admin dashboard for managing food/cash donations, assistance requests, and delivery verification.',
}

export default async function AdminPage() {
  const { profile } = await requireAdmin()

  const displayName = profile.full_name || 'Admin'
  const initials = displayName
    .split(' ')
    .map((part: string) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return <AdminDashboard adminName={displayName} adminInitials={initials || 'A'} />
}

