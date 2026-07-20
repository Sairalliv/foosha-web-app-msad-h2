import { NextResponse, type NextRequest } from 'next/server'
import { updateSupabaseSession } from './session'
import { isAuthRoute, isProtectedRoute, PASSTHROUGH_ROUTES } from './routes'

/**
 * Main Proxy execution handler responsible for route protection, auth redirects, and session management.
 */
export async function proxyHandler(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Let OAuth callback routes pass straight through — never block them.
    if (PASSTHROUGH_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.next()
    }

    const { response, user } = await updateSupabaseSession(request)

    // 1. Redirect authenticated users away from auth pages (e.g. /login -> /dashboard)
    if (user && isAuthRoute(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // 2. Redirect unauthenticated users away from protected pages (e.g. /dashboard -> /login)
    if (!user && isProtectedRoute(pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    return response
  } catch (error) {
    console.error('Proxy Critical Error:', error)
    return NextResponse.next()
  }
}
