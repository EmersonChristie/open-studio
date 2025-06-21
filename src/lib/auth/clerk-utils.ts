import { auth, currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'

/**
 * Get the current authenticated user from Clerk
 */
export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

/**
 * Get the current user's authentication status
 */
export async function getAuth() {
  const authData = await auth()
  return authData
}

/**
 * Get the current tenant from request headers (set by middleware)
 */
export async function getCurrentTenant() {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant')
  return tenant
}

/**
 * Check if the current user has access to the specified tenant
 * This will be expanded when we integrate with organizations
 */
export async function canAccessTenant(tenantSlug: string) {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  // TODO: Implement organization-based tenant access control
  // For now, return true if user is authenticated
  // Later: Check if user is member of the organization (tenant)
  return true
}

/**
 * Get user's role in the current tenant/organization
 * This will be implemented when we set up Clerk organizations
 */
export async function getUserTenantRole(tenantSlug: string) {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // TODO: Implement organization role checking
  // Return user's role in the specified tenant/organization
  return 'member' // Placeholder
}

/**
 * Require authentication - throws if user is not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Authentication required')
  }

  return userId
}

/**
 * Require tenant access - throws if user cannot access tenant
 */
export async function requireTenantAccess(tenantSlug: string) {
  const userId = await requireAuth()
  const hasAccess = await canAccessTenant(tenantSlug)

  if (!hasAccess) {
    throw new Error(`Access denied to tenant: ${tenantSlug}`)
  }

  return { userId, tenantSlug }
}
