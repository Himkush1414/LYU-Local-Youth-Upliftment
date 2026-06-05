import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/features') ||
    pathname.startsWith('/companies') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')

  if (isPublic) return NextResponse.next()

  const isAuthPage =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/forgot-password') ||
    pathname.startsWith('/auth/verify-email') ||
    pathname.startsWith('/auth/role-select') ||
    pathname.startsWith('/auth/onboarding') ||
    pathname.startsWith('/auth/callback')

  if (isAuthPage) return NextResponse.next()

  const allCookies = [...request.cookies.getAll()]
  const hasSession = allCookies.some(c =>
    c.name.includes('auth-token') ||
    c.name.includes('sb-') ||
    c.name === 'supabase-auth-token'
  )

  if (!hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
