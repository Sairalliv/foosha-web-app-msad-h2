import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabasePublicConfig } from '@/lib/supabase/config'

/**
 * Handles Supabase auth session token synchronization and cookie refreshing inside Edge proxy.
 */
export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  let config: ReturnType<typeof getSupabasePublicConfig>
  try {
    config = getSupabasePublicConfig()
  } catch (error) {
    console.error('Proxy: Supabase public configuration is missing.', error)
    return { response, user: null, error: null }
  }

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        } catch (error) {
          console.warn('Proxy: Ignored edge cookie manipulation error', error)
        }
      },
    },
  })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error && !error.message.includes('Auth session missing!') && error.name !== 'AuthSessionMissingError') {
    console.warn('Proxy: Supabase Auth error:', error.message)
  }

  return { response, user, error }
}
