import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * GET /auth/callback
 *
 * Supabase OAuth (e.g. Google Sign-In) redirects back here with a
 * one-time `code` query parameter. This route exchanges that code
 * for a Supabase session cookie, then forwards the user to their
 * destination.
 *
 * Required: Register this URL in Google Cloud Console →
 * Authorised redirect URIs:
 *   - http://localhost:3000/auth/callback   (local dev)
 *   - https://<your-production-domain>/auth/callback  (production)
 *
 * Supabase also requires the same URL in:
 *   Dashboard → Authentication → URL Configuration → Redirect URLs
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Where to send the user after login (defaults to /dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the intended destination
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
  }

  // Something went wrong — send to login with an error hint
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
