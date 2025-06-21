import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getTenantBySlug } from '@/lib/db/services/tenant-service'
import {
  getTenantUsers,
  updateUserTenantRole,
  removeUserFromTenant,
} from '@/lib/db/services/user-service'

export async function GET(
  request: Request,
  { params }: { params: { tenant: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const tenant = await getTenantBySlug(params.tenant)
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 })
    }

    const users = await getTenantUsers(tenant.clerkOrgId)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { tenant: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const tenant = await getTenantBySlug(params.tenant)
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 })
    }

    const body = await request.json()
    const { userId: targetUserId, role } = body

    if (!targetUserId || !role) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const updatedUser = await updateUserTenantRole(
      targetUserId,
      tenant.clerkOrgId,
      role
    )

    // Update role in Clerk
    await clerkClient.organizations.updateOrganizationMembership({
      organizationId: tenant.clerkOrgId,
      userId: targetUserId,
      role: role === 'admin' ? 'admin' : 'basic_member',
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { tenant: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const tenant = await getTenantBySlug(params.tenant)
    if (!tenant) {
      return new NextResponse('Tenant not found', { status: 404 })
    }

    const body = await request.json()
    const { userId: targetUserId } = body

    if (!targetUserId) {
      return new NextResponse('Missing user ID', { status: 400 })
    }

    const removedUser = await removeUserFromTenant(
      targetUserId,
      tenant.clerkOrgId
    )

    // Remove from Clerk organization
    await clerkClient.organizations.removeOrganizationMember({
      organizationId: tenant.clerkOrgId,
      userId: targetUserId,
    })

    return NextResponse.json(removedUser)
  } catch (error) {
    console.error('Error removing user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
