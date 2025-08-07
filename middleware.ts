import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to admin API routes, not the dashboard page
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Allow access to login route without authentication
    if (request.nextUrl.pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    // Check for admin token in cookies or headers
    const token = request.cookies.get('adminToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // Return 401 for API routes without token
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/admin/:path*',
}
