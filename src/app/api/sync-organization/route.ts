import { auth, clerkClient } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
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

    console.log('Found organizations:', organizations)

    if (!organizations.data.length) {
      return NextResponse.json({
        message: 'No organizations found',
        organizations: [],
      })
    }

    const results = []

    // Sync each organization
    for (const membership of organizations.data) {
      const org = membership.organization

      try {
        // Check if tenant already exists
        const existingTenant = await db
          .select()
          .from(tenants)
          .where(eq(tenants.clerkOrgId, org.id))
          .limit(1)

        if (!existingTenant.length) {
          // Create tenant with all required fields
          const [tenant] = await db
            .insert(tenants)
            .values({
              clerkOrgId: org.id,
              slug: org.slug || org.id,
              name: org.name,
              isActive: true,
              logoUrl: org.imageUrl || null,
              // Subscription defaults
              subscriptionPlan: 'free',
              subscriptionStatus: 'active',
              // Usage limits
              artworkLimit: 5,
              artworkCount: 0,
              userLimit: 1,
              userCount: 1,
              // Settings
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
            slug: org.slug || org.id,
            action: 'created',
          })
        } else {
          // Update user-tenant relationship if it doesn't exist
          const existingUserTenant = await db
            .select()
            .from(userTenants)
            .where(
              and(
                eq(userTenants.userId, userId),
                eq(userTenants.tenantId, org.id)
              )
            )
            .limit(1)

          if (!existingUserTenant.length) {
            await db.insert(userTenants).values({
              userId: userId,
              tenantId: org.id,
              role: membership.role === 'admin' ? 'admin' : 'staff',
            })
          }

          results.push({
            id: org.id,
            name: org.name,
            slug: org.slug || org.id,
            action: 'already exists',
          })
        }
      } catch (error) {
        console.error('Error processing organization:', org.id, error)
        results.push({
          id: org.id,
          name: org.name,
          slug: org.slug || org.id,
          action: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    // Get the final organization list after sync
    const finalOrganizations = await client.users.getOrganizationMembershipList(
      {
        userId,
      }
    )

    return NextResponse.json({
      message: 'Sync completed',
      results,
      organizations: finalOrganizations.data.map((org) => ({
        id: org.organization.id,
        name: org.organization.name,
        slug: org.organization.slug,
        role: org.role,
      })),
    })
  } catch (error) {
    console.error('Error syncing organizations:', error)
    return NextResponse.json(
      {
        message: 'Error syncing organizations',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
