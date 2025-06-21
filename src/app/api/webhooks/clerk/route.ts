import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'
import { users, tenants, userTenants } from '@/lib/db/schema'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error(
    'Please add CLERK_WEBHOOK_SECRET to your environment variables'
  )
}

export async function POST(req: NextRequest) {
  console.log('🔔 Webhook received')

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  console.log('📋 Headers:', { svix_id, svix_timestamp, svix_signature })

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers')
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  console.log('📦 Payload type:', payload.type)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret!)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
    console.log('✅ Webhook verified successfully')
  } catch (err) {
    console.error('❌ Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log('🎯 Processing event:', eventType)

  try {
    switch (eventType) {
      case 'user.created':
        console.log('👤 Creating user:', evt.data.id)
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        console.log('👤 Updating user:', evt.data.id)
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        console.log('👤 Deleting user:', evt.data.id)
        await handleUserDeleted(evt.data)
        break
      case 'organization.created':
        console.log('🏢 Creating organization:', evt.data.id)
        await handleOrganizationCreated(evt.data)
        break
      case 'organization.updated':
        console.log('🏢 Updating organization:', evt.data.id)
        await handleOrganizationUpdated(evt.data)
        break
      case 'organization.deleted':
        console.log('🏢 Deleting organization:', evt.data.id)
        await handleOrganizationDeleted(evt.data)
        break
      case 'organizationMembership.created':
        console.log('👥 Creating membership:', evt.data.organization.id)
        await handleOrganizationMembershipCreated(evt.data)
        break
      case 'organizationMembership.updated':
        console.log('👥 Updating membership:', evt.data.organization.id)
        await handleOrganizationMembershipUpdated(evt.data)
        break
      case 'organizationMembership.deleted':
        console.log('👥 Deleting membership:', evt.data.organization.id)
        await handleOrganizationMembershipDeleted(evt.data)
        break
      default:
        console.log(`❓ Unhandled webhook event type: ${eventType}`)
    }

    console.log('✅ Webhook processed successfully')
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`❌ Error handling webhook ${eventType}:`, error)
    return new Response('Error processing webhook', { status: 500 })
  }
}

async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url } = data

  const primaryEmail = email_addresses.find(
    (email: any) => email.id === data.primary_email_address_id
  )

  await db.insert(users).values({
    clerkId: id,
    email: primaryEmail?.email_address || '',
    firstName: first_name || '',
    lastName: last_name || '',
    profileImageUrl: image_url || null,
    role: 'user',
  })
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url } = data

  const primaryEmail = email_addresses.find(
    (email: any) => email.id === data.primary_email_address_id
  )

  await db
    .update(users)
    .set({
      email: primaryEmail?.email_address || '',
      firstName: first_name || '',
      lastName: last_name || '',
      profileImageUrl: image_url || null,
      updatedAt: new Date(),
    })
    .where(eq(users.clerkId, id))
}

async function handleUserDeleted(data: any) {
  const { id } = data

  // Delete user tenant relationships first
  await db.delete(userTenants).where(eq(userTenants.userId, id))

  // Delete user
  await db.delete(users).where(eq(users.clerkId, id))
}

async function handleOrganizationCreated(data: any) {
  const { id, name, slug, image_url } = data

  // Upsert: insert or update if slug already exists
  await db
    .insert(tenants)
    .values({
      clerkOrgId: id,
      slug: slug,
      name: name,
      logoUrl: image_url || null,
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
    .onConflictDoUpdate({
      target: tenants.slug,
      set: {
        clerkOrgId: id,
        name: name,
        logoUrl: image_url || null,
        isActive: true,
        updatedAt: new Date(),
        settings: {
          theme: 'light',
          primaryColor: '#3b82f6',
          features: {
            basicInventory: true,
            basicReporting: true,
            emailSupport: true,
          },
        },
      },
    })
}

async function handleOrganizationUpdated(data: any) {
  const { id, name, slug, image_url } = data

  await db
    .update(tenants)
    .set({
      name: name,
      slug: slug,
      logoUrl: image_url || null,
      updatedAt: new Date(),
    })
    .where(eq(tenants.clerkOrgId, id))
}

async function handleOrganizationDeleted(data: any) {
  const { id } = data

  // Delete organization memberships first
  await db.delete(userTenants).where(eq(userTenants.tenantId, id))

  // Delete organization
  await db.delete(tenants).where(eq(tenants.clerkOrgId, id))
}

async function handleOrganizationMembershipCreated(data: any) {
  const { organization, public_user_data, role } = data

  await db.insert(userTenants).values({
    userId: public_user_data.user_id,
    tenantId: organization.id,
    role: role === 'admin' ? 'admin' : 'staff',
  })
}

async function handleOrganizationMembershipUpdated(data: any) {
  const { organization, public_user_data, role } = data

  await db
    .update(userTenants)
    .set({
      role: role === 'admin' ? 'admin' : 'staff',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userTenants.userId, public_user_data.user_id),
        eq(userTenants.tenantId, organization.id)
      )
    )
}

async function handleOrganizationMembershipDeleted(data: any) {
  const { organization, public_user_data } = data

  await db
    .delete(userTenants)
    .where(
      and(
        eq(userTenants.userId, public_user_data.user_id),
        eq(userTenants.tenantId, organization.id)
      )
    )
}
