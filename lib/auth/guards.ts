import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'

/**
 * Ensures the user is authenticated.
 * Call this inside Server Components or Server Actions.
 * Redirects to /login if not authenticated.
 */
export async function requireUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}

/**
 * Ensures the user is authenticated and fetches their profile data from the public.users table.
 * Redirects to /login if not authenticated.
 */
export async function requireUserProfile() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    // Optionally redirect to an onboarding page if profile doesn't exist
    // redirect('/onboarding')
    console.error('Error fetching user profile:', error)
  }

  return { user, profile }
}

/**
 * Ensures the user has the 'admin' role.
 * Redirects to /dashboard if unauthorized.
 */
export async function requireAdmin() {
  const { user, profile } = await requireUserProfile()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return { user, profile }
}

/**
 * Refreshes session without redirecting (useful for pure API routes/actions).
 * Returns null if not authenticated.
 */
export async function getUserOrNull() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
