import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

/**
 * Get the dashboard URL for the current authenticated user
 * Routes based on user's Clerk organizations
 */
export async function getUserDashboardUrl(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    return '/sign-in'
  }

  try {
    // Get user's organizations from Clerk
    const client = await clerkClient()
    const organizationMemberships =
      await client.users.getOrganizationMembershipList({
        userId,
      })

    // If user has organizations, redirect to their first organization
    if (organizationMemberships.data.length > 0) {
      const firstOrg = organizationMemberships.data[0].organization
      return `/${firstOrg.slug}`
    }

    // If user has no organizations, redirect to organization creation
    return '/setup-organization'
  } catch (error) {
    console.error('Error getting user organizations:', error)

    // If there's an API error but user is authenticated,
    // redirect to setup instead of sign-in to avoid loops
    return '/setup-organization'
  }
}

/**
 * Redirect authenticated users to their appropriate dashboard
 */
export async function redirectToDashboard(): Promise<never> {
  const dashboardUrl = await getUserDashboardUrl()
  redirect(dashboardUrl)
}

/**
 * Check if user has access to a specific tenant/gallery
 */
export async function canAccessTenant(tenantSlug: string): Promise<boolean> {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  try {
    // Get user's organizations from Clerk
    const client = await clerkClient()
    const organizationMemberships =
      await client.users.getOrganizationMembershipList({
        userId,
      })

    // Check if user is member of the organization with matching slug
    return organizationMemberships.data.some(
      (membership) => membership.organization.slug === tenantSlug
    )
  } catch (error) {
    console.error('Error checking tenant access:', error)
    // If there's an API error, deny access for security
    return false
  }
}
