import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the user's current organizations
    const client = await clerkClient()
    const currentOrgs = await client.users.getOrganizationMembershipList({
      userId,
    })

    console.log('Current organizations:', currentOrgs)

    // Create a new organization
    const newOrg = await client.organizations.createOrganization({
      name: 'Test Organization',
      createdBy: userId,
    })

    console.log('Created organization:', newOrg)

    // Get the updated organization list
    const updatedOrgs = await client.users.getOrganizationMembershipList({
      userId,
    })

    console.log('Updated organizations:', updatedOrgs)

    return NextResponse.json({
      message: 'Organization created',
      organization: newOrg,
      currentOrganizations: currentOrgs,
      updatedOrganizations: updatedOrgs,
    })
  } catch (error) {
    console.error('Error creating organization:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
