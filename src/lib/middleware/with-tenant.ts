import { NextRequest, NextResponse } from 'next/server'

/**
 * Extract tenant from request URL
 * This handles tenant resolution from the URL path
 */
export function extractTenantFromRequest(request: NextRequest): string | null {
  const url = request.nextUrl
  const pathParts = url.pathname.split('/')

  // Expected format: /[tenant]/...
  // The tenant should be the first part of the path after the initial '/'
  if (pathParts.length > 1 && pathParts[1]) {
    // Ensure the path is not a system path like _next, api, etc.
    if (
      !pathParts[1].startsWith('_') &&
      pathParts[1] !== 'api' &&
      pathParts[1] !== 'favicon.ico' &&
      pathParts[1] !== 'setup-organization'
    ) {
      return pathParts[1]
    }
  }

  // Return null if no valid tenant found
  return null
}

/**
 * Tenant middleware function
 * This middleware attaches the tenant ID to the request headers
 * allowing server components to access it.
 */
export function withTenant(request: NextRequest) {
  // Skip tenant resolution for specific routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/favicon.ico' ||
    request.nextUrl.pathname === '/setup-organization' ||
    // Error pages
    request.nextUrl.pathname === '/error' ||
    request.nextUrl.pathname === '/not-found' ||
    request.nextUrl.pathname === '/unauthorized' ||
    request.nextUrl.pathname === '/forbidden' ||
    request.nextUrl.pathname === '/maintenance'
  ) {
    return NextResponse.next()
  }

  const tenant = extractTenantFromRequest(request)

  // Only add tenant header if we found a valid tenant
  if (tenant) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant', tenant)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}
