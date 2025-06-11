import { pgEnum, pgTable } from 'drizzle-orm/pg-core'
import {
  timestamp,
  varchar,
  serial,
  text,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'

/**
 * Common columns for all tables that need tenant isolation
 */
export const tenantColumns = {
  id: serial('id').primaryKey(),
  tenantId: varchar('tenant_id', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}

/**
 * User roles enum
 */
export const userRoleEnum = pgEnum('user_role', [
  'owner',
  'admin',
  'staff',
  'artist',
  'client',
  'guest',
])

/**
 * Artwork status enum
 */
export const artworkStatusEnum = pgEnum('artwork_status', [
  'available',
  'sold',
  'reserved',
  'on_loan',
  'not_for_sale',
])

/**
 * Client status enum
 */
export const clientStatusEnum = pgEnum('client_status', [
  'active',
  'prospect',
  'inactive',
  'vip',
])

/**
 * Sale status enum
 */
export const saleStatusEnum = pgEnum('sale_status', [
  'pending',
  'completed',
  'cancelled',
  'refunded',
])

/**
 * Base timestamp columns for all tables
 */
export const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}
