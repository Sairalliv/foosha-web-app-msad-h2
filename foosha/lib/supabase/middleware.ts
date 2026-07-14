import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback if environment variables are missing (prevents 500 crash on Vercel)
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Middleware: Supabase environment variables are missing.')
      return supabaseResponse
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // This will refresh the session if expired
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')

    // 1. If user is authenticated and tries to access an auth route, redirect to dashboard
    if (user && isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // 2. If user is unauthenticated and tries to access a protected route, redirect to login
    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // If any unexpected error occurs, gracefully continue rather than crashing the whole site
    console.error('Middleware execution error:', error)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}
