import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware ensures that navigation events from client-side transitions
// are properly handled and don't bypass our animation
export function middleware(request: NextRequest) {
  // We don't need to modify the request, just ensure it passes through
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
}
