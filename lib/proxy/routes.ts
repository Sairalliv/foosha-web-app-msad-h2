/**
 * Centralized Route Definitions and Matcher Configuration for Proxy
 */

export const AUTH_ROUTES = ['/login', '/register']
export const PROTECTED_ROUTES = ['/dashboard', '/admin']
export const ADMIN_ROUTES = ['/admin']

// Routes that must never be blocked or redirected by the proxy.
// /auth/callback handles the OAuth code exchange — intercepting it breaks Google Sign-In.
export const PASSTHROUGH_ROUTES = ['/auth/callback', '/auth/']

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route))
}

export const proxyMatcherConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
