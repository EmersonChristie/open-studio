import { headers, type UnsafeUnwrappedHeaders } from 'next/headers'

/**
 * Get the current tenant ID from request headers
 * This can be used in Server Components to access the tenant information
 * that was set by the middleware
 */
export function getTenant(): string | null {
  const headersList = headers() as unknown as UnsafeUnwrappedHeaders
  const tenant = headersList.get('x-tenant')

  return tenant
}

/**
 * Get the current tenant ID from request headers with a fallback
 * Use this when you need a guaranteed string value
 */
export function getTenantOrThrow(): string {
  const tenant = getTenant()

  if (!tenant) {
    throw new Error('No tenant found in request headers')
  }

  return tenant
}
