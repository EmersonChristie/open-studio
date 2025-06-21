import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tenants } from '@/lib/db/schema'

/**
 * Generates a clean slug from an organization name
 * @param name The organization name
 * @returns A clean slug with minimal unique identifier if needed
 */
export async function generateSlug(name: string): Promise<string> {
  // Convert to lowercase and replace spaces/special chars with hyphens
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

  // Check if the base slug exists
  const existingTenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, baseSlug),
  })

  if (!existingTenant) {
    return baseSlug
  }

  // If base slug exists, append a number
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`

  // Keep incrementing until we find an unused slug
  while (true) {
    const exists = await db.query.tenants.findFirst({
      where: eq(tenants.slug, newSlug),
    })

    if (!exists) {
      return newSlug
    }

    counter++
    newSlug = `${baseSlug}-${counter}`
  }
}
