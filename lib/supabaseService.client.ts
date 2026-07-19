import { createClient } from './supabase/client'
import { createSupabaseService } from './supabaseService'

// Client Components only — pulls the session from document.cookie.
export function getSupabaseService() {
  const supabase = createClient()
  return createSupabaseService(supabase)
}
