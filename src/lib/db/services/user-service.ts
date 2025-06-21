import { and, eq } from 'drizzle-orm'
import { db } from '../index'
import { users, userTenants } from '../schema/users'
import { withErrorHandling } from '../utils/error-handler'

/**
 * Get all users for a specific tenant
 */
export async function getTenantUsers(tenantId: string) {
  return withErrorHandling(`getTenantUsers(${tenantId})`, async () => {
    const results = await db
      .select({
        id: users.id,
        clerkId: users.clerkId,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        name: users.name,
        avatarUrl: users.avatarUrl,
        profileImageUrl: users.profileImageUrl,
        role: userTenants.role,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .innerJoin(userTenants, eq(users.clerkId, userTenants.userId))
      .where(eq(userTenants.tenantId, tenantId))

    return results
  })
}

/**
 * Get a user by their Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  return withErrorHandling(`getUserByClerkId(${clerkId})`, async () => {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1)

    return results[0] || null
  })
}

/**
 * Get a user's role in a specific tenant
 */
export async function getUserTenantRole(userId: string, tenantId: string) {
  return withErrorHandling(
    `getUserTenantRole(${userId}, ${tenantId})`,
    async () => {
      const results = await db
        .select()
        .from(userTenants)
        .where(
          and(
            eq(userTenants.userId, userId),
            eq(userTenants.tenantId, tenantId)
          )
        )
        .limit(1)

      return results[0]?.role || null
    }
  )
}

/**
 * Update a user's role in a tenant
 */
export async function updateUserTenantRole(
  userId: string,
  tenantId: string,
  role: string
) {
  return withErrorHandling(
    `updateUserTenantRole(${userId}, ${tenantId}, ${role})`,
    async () => {
      const result = await db
        .update(userTenants)
        .set({ role, updatedAt: new Date() })
        .where(
          and(
            eq(userTenants.userId, userId),
            eq(userTenants.tenantId, tenantId)
          )
        )
        .returning()

      return result[0]
    }
  )
}

/**
 * Remove a user from a tenant
 */
export async function removeUserFromTenant(userId: string, tenantId: string) {
  return withErrorHandling(
    `removeUserFromTenant(${userId}, ${tenantId})`,
    async () => {
      const result = await db
        .delete(userTenants)
        .where(
          and(
            eq(userTenants.userId, userId),
            eq(userTenants.tenantId, tenantId)
          )
        )
        .returning()

      return result[0]
    }
  )
}
