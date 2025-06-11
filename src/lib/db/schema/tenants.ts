import {
  pgTable,
  timestamp,
  varchar,
  serial,
  text,
  boolean,
  json,
} from 'drizzle-orm/pg-core'
import { timestamps } from './_common'

/**
 * Tenants table - Represents art galleries using the platform
 */
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  logoUrl: varchar('logo_url', { length: 255 }),
  websiteUrl: varchar('website_url', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }),
  settings: json('settings').$type<{
    theme?: string
    primaryColor?: string
    accentColor?: string
    logo?: string
    favicon?: string
    features?: Record<string, boolean>
  }>(),
  ...timestamps,
})

/**
 * Tenant invitations table - For inviting users to join a tenant
 */
export const tenantInvitations = pgTable('tenant_invitations', {
  id: serial('id').primaryKey(),
  tenantId: serial('tenant_id')
    .references(() => tenants.id)
    .notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestamps,
})
