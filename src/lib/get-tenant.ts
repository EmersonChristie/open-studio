import { headers } from 'next/headers'

/**
 * Get the current tenant ID from request headers
 * This can be used in Server Components to access the tenant information
 * that was set by the middleware
 */
export function getTenant(): string {
  const headersList = headers()
  const tenant = headersList.get('x-tenant')

  if (!tenant) {
    // Default tenant if not found in headers
    return 'demo-gallery'
  }

  return tenant
}
