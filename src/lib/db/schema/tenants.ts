import {
  pgTable,
  timestamp,
  varchar,
  serial,
  text,
  boolean,
  json,
  integer,
} from 'drizzle-orm/pg-core'
import {
  timestamps,
  subscriptionPlanEnum,
  subscriptionStatusEnum,
} from './_common'

/**
 * Tenants table - Represents art galleries using the platform
 */
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  clerkOrgId: varchar('clerk_org_id', { length: 255 }).unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),

  // Subscription Management
  subscriptionPlan: subscriptionPlanEnum('subscription_plan')
    .default('free')
    .notNull(),
  subscriptionStatus: subscriptionStatusEnum('subscription_status')
    .default('active')
    .notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  trialEndsAt: timestamp('trial_ends_at'),

  // Usage Limits & Tracking
  artworkLimit: integer('artwork_limit').default(5).notNull(), // Free tier: 5 artworks
  artworkCount: integer('artwork_count').default(0).notNull(),
  userLimit: integer('user_limit').default(1).notNull(), // Free tier: 1 user
  userCount: integer('user_count').default(1).notNull(),

  // Gallery Information
  logoUrl: varchar('logo_url', { length: 255 }),
  websiteUrl: varchar('website_url', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 100 }),

  // Settings with plan-based features
  settings: json('settings').$type<{
    theme?: string
    primaryColor?: string
    accentColor?: string
    logo?: string
    favicon?: string
    features?: {
      // Free tier features
      basicInventory?: boolean
      basicReporting?: boolean
      emailSupport?: boolean

      // Paid tier features
      advancedReporting?: boolean
      clientManagement?: boolean
      salesTracking?: boolean
      multipleLocations?: boolean
      apiAccess?: boolean
      prioritySupport?: boolean
      customBranding?: boolean
      exportData?: boolean
    }
  }>(),
  ...timestamps,
})

/**
 * User subscriptions table - Track individual user subscription limits
 */
export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
  subscriptionPlan: subscriptionPlanEnum('subscription_plan')
    .default('free')
    .notNull(),
  subscriptionStatus: subscriptionStatusEnum('subscription_status')
    .default('active')
    .notNull(),

  // Stripe Integration
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),

  // Limits for user (across all their organizations)
  organizationLimit: integer('organization_limit').default(1).notNull(), // Free: 1 gallery, Paid: unlimited
  organizationCount: integer('organization_count').default(0).notNull(),

  // Subscription timing
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  trialEndsAt: timestamp('trial_ends_at'),

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
