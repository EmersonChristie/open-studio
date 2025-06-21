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
import { userRoleEnum } from './_common'
import { tenants } from './tenants'

/**
 * Users table - Represents users across all tenants
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  name: varchar('name', { length: 255 }),
  password: varchar('password', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  profileImageUrl: varchar('profile_image_url', { length: 255 }),
  role: userRoleEnum('role').default('user'),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  ...timestamps,
})

/**
 * User-Tenant relationships - Links users to tenants with roles
 */
export const userTenants = pgTable('user_tenants', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  tenantId: varchar('tenant_id', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  isDefault: boolean('is_default').default(false),
  permissions: json('permissions').$type<string[]>(),
  ...timestamps,
})

/**
 * Sessions table for storing user sessions
 */
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: serial('user_id')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  tenantId: serial('tenant_id').references(() => tenants.id),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 50 }),
})

/**
 * Password reset tokens
 */
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .references(() => users.id)
    .notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestamps,
})
