import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tenants } from '@/lib/db/schema'
import { generateSlug } from '@/lib/utils/generate-slug'

export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Create organization in Clerk
    const organization = await clerkClient.organizations.createOrganization({
      name: 'New Organization',
      createdBy: userId,
    })

    // Generate a clean slug
    const slug = await generateSlug(organization.name)

    // Create tenant in database
    const [tenant] = await db
      .insert(tenants)
      .values({
        clerkOrgId: organization.id,
        slug: slug,
        name: organization.name,
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

    // Add user as admin of the organization
    await clerkClient.organizations.createOrganizationMembership({
      organizationId: organization.id,
      userId: userId,
      role: 'admin',
    })

    return NextResponse.json({ organization, tenant })
  } catch (error) {
    console.error('Error creating organization:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
