import { NextRequest, NextResponse } from 'next/server'

/**
 * Extract tenant from request URL
 * This handles tenant resolution from the URL path
 */
export function extractTenantFromRequest(request: NextRequest): string {
  const url = request.nextUrl
  const pathParts = url.pathname.split('/')

  // Expected format: /[tenant]/...
  // The tenant should be the first part of the path after the initial '/'
  if (pathParts.length > 1 && pathParts[1]) {
    // Ensure the path is not a system path like _next, api, etc.
    if (
      !pathParts[1].startsWith('_') &&
      pathParts[1] !== 'api' &&
      pathParts[1] !== 'favicon.ico'
    ) {
      return pathParts[1]
    }
  }

  // Default tenant for home page or other non-tenant routes
  return 'demo-gallery'
}

/**
 * Tenant middleware function
 * This middleware attaches the tenant ID to the request headers
 * allowing server components to access it.
 */
export function withTenant(request: NextRequest) {
  const tenant = extractTenantFromRequest(request)

  // Skip tenant resolution for non-tenant routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Add tenant to request headers for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant', tenant)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
