import { TenantSettings } from '@/types/tenant'
import { sql } from 'drizzle-orm'
import { db } from '../index'
import { tenants } from '../schema/tenants'
import { TenantNotFoundError, withErrorHandling } from '../utils/error-handler'

/**
 * Get a tenant by slug
 */
export async function getTenantBySlug(slug: string) {
  return withErrorHandling(`getTenantBySlug(${slug})`, async () => {
    const results = await db
      .select()
      .from(tenants)
      .where(sql`${tenants.slug} = ${slug}`)
      .limit(1)

    return results[0] || null
  })
}

/**
 * Create a new tenant
 */
export async function createTenant({
  slug,
  name,
  description,
  contactEmail,
  logoUrl,
  settings = {},
}: {
  slug: string
  name: string
  description?: string
  contactEmail?: string
  logoUrl?: string
  settings?: TenantSettings
}) {
  return withErrorHandling(`createTenant(${slug})`, async () => {
    const result = await db
      .insert(tenants)
      .values({
        slug,
        name,
        description,
        contactEmail,
        logoUrl,
        settings,
      })
      .returning()

    return result[0]
  })
}

/**
 * Update tenant settings
 */
export async function updateTenantSettings(
  tenantId: number,
  settings: Partial<TenantSettings>
) {
  return withErrorHandling(`updateTenantSettings(${tenantId})`, async () => {
    // First get the current settings
    const tenant = await db
      .select({ settings: tenants.settings })
      .from(tenants)
      .where(sql`${tenants.id} = ${tenantId}`)
      .limit(1)

    if (!tenant[0]) {
      throw new TenantNotFoundError(tenantId)
    }

    // Merge the existing settings with the new settings
    const updatedSettings = {
      ...((tenant[0].settings as TenantSettings) || {}),
      ...settings,
    }

    // Update the tenant with the new settings
    const result = await db
      .update(tenants)
      .set({ settings: updatedSettings })
      .where(sql`${tenants.id} = ${tenantId}`)
      .returning()

    return result[0]
  })
}

/**
 * Update tenant information
 */
export async function updateTenant(
  tenantId: number,
  data: Partial<
    Omit<typeof tenants.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>
  >
) {
  return withErrorHandling(`updateTenant(${tenantId})`, async () => {
    const result = await db
      .update(tenants)
      .set(data)
      .where(sql`${tenants.id} = ${tenantId}`)
      .returning()

    if (!result[0]) {
      throw new TenantNotFoundError(tenantId)
    }

    return result[0]
  })
}

/**
 * Delete a tenant
 * Note: This should be used with caution and probably should be soft-delete in production
 */
export async function deleteTenant(tenantId: number) {
  return withErrorHandling(`deleteTenant(${tenantId})`, async () => {
    return db.delete(tenants).where(sql`${tenants.id} = ${tenantId}`)
  })
}
