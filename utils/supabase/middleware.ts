import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('votre-projet.supabase.co') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'votre-cle-anon'

  const demoSession = request.cookies.get('gestia_session')?.value

  if (!isSupabaseConfigured) {
    // In demo / development mode without live Supabase credentials, allow access to dashboard
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            supabaseResponse.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            supabaseResponse.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isAuthenticated = !!user || !!demoSession

    // Protect /dashboard routes
    if (
      !isAuthenticated &&
      request.nextUrl.pathname.startsWith('/dashboard')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect logged in users away from auth pages
    if (
      isAuthenticated &&
      (request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/signup')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (err) {
    // Fail gracefully on middleware auth check
  }

  return supabaseResponse
}
