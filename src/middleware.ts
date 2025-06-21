import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/setup-organization',
  '/api/webhooks(.*)',
  '/error',
  '/not-found',
  '/unauthorized',
  '/forbidden',
  '/maintenance',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl

  // Skip tenant resolution for error pages and auth routes
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname === '/setup-organization' ||
    pathname === '/error' ||
    pathname === '/not-found' ||
    pathname === '/unauthorized' ||
    pathname === '/forbidden' ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next()
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Tenant resolution for tenant-specific routes
  const tenantMatch = pathname.match(/^\/([^\/]+)/)
  if (tenantMatch) {
    const tenantSlug = tenantMatch[1]

    // Add tenant information to request headers for server components
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-tenant', tenantSlug)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
