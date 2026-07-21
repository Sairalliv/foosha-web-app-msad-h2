import { createClient } from '@supabase/supabase-js'
import { getSupabasePublicConfig } from './config'

export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secretKey) {
    throw new Error('Missing SUPABASE_SECRET_KEY')
  }

  const { url } = getSupabasePublicConfig()

  return createClient(
    url,
    secretKey
  )
}
