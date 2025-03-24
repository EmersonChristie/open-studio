import { NextRequest } from 'next/server'
import { withTenant } from './lib/middleware/with-tenant'

export function middleware(request: NextRequest) {
  return withTenant(request)
}

export const config = {
  // Matcher for all routes except static files, api routes, etc.
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|fonts|[\\w-]+\\.\\w+).*)',
  ],
}
