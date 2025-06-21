import { auth, clerkClient } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tenants, userTenants } from '@/lib/db/schema'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user's organizations from Clerk
    const client = await clerkClient()
    const organizations = await client.users.getOrganizationMembershipList({
      userId,
    })

    if (!organizations.data.length) {
      return new NextResponse('No organizations found', { status: 404 })
    }

    const results = []

    // Sync each organization
    for (const membership of organizations.data) {
      const org = membership.organization

      // Check if tenant already exists
      const existingTenant = await db
        .select()
        .from(tenants)
        .where(eq(tenants.clerkOrgId, org.id))
        .limit(1)

      if (!existingTenant.length) {
        // Create tenant
        const tenant = await db
          .insert(tenants)
          .values({
            clerkOrgId: org.id,
            slug: org.slug,
            name: org.name,
            logoUrl: org.imageUrl || null,
            isActive: true,
            settings: {
              theme: 'light',
              primaryColor: '#3b82f6',
              features: {
                basicInventory: true,
                basicReporting: true,
                emailSupport: true,
              },
            },
          })
          .returning()

        // Create user-tenant relationship
        await db.insert(userTenants).values({
          userId: userId,
          tenantId: org.id,
          role: membership.role === 'admin' ? 'admin' : 'staff',
        })

        results.push({
          id: org.id,
          name: org.name,
          slug: org.slug,
          action: 'created',
        })
      } else {
        results.push({
          id: org.id,
          name: org.name,
          slug: org.slug,
          action: 'already exists',
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error syncing organizations:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
