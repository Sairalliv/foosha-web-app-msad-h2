import { createClient } from './supabase/server'
import { createSupabaseService } from './supabaseService'

// Server Components / Route Handlers only — pulls the session from
// next/headers cookies. Never import this from a 'use client' file.
export async function getSupabaseService() {
  const supabase = await createClient()
  return createSupabaseService(supabase)
}
