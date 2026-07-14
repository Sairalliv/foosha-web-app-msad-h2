import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback if environment variables are missing (prevents crash)
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
            // Next.js Edge Runtime throws strictly if cookie operations fail. 
            // Wrapping this in try/catch is critical for Vercel stability.
            try {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value)
              })
              
              supabaseResponse = NextResponse.next()
              
              cookiesToSet.forEach(({ name, value, options }) => {
                supabaseResponse.cookies.set({
                  name,
                  value,
                  ...options,
                })
              })
            } catch (error) {
              // Ignore cookie parsing errors in edge (frequent in Next 14/15)
              console.warn('Middleware: Ignored edge cookie manipulation error', error)
            }
          },
        },
      }
    )

    // Refresh the session if expired
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
       console.warn('Middleware: Supabase Auth error:', error.message)
    }

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
    // Return a pristine NextResponse if absolutely anything crashes in Edge
    console.error('Middleware Critical Error:', error)
    return NextResponse.next()
  }
}
