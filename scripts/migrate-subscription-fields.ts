import { db } from '../src/lib/db'
import { sql } from 'drizzle-orm'

async function migrateSubscriptionFields() {
  console.log('Adding subscription management fields to database...')

  try {
    // Create subscription plan enum
    await db.execute(sql`
      CREATE TYPE subscription_plan AS ENUM (
        'free',
        'artist', 
        'gallery'
      )
    `)

    // Create subscription status enum
    await db.execute(sql`
      CREATE TYPE subscription_status AS ENUM (
        'active',
        'canceled',
        'past_due',
        'unpaid',
        'trialing',
        'incomplete',
        'incomplete_expired'
      )
    `)

    // Add subscription fields to tenants table
    await db.execute(sql`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS subscription_plan subscription_plan DEFAULT 'free' NOT NULL,
      ADD COLUMN IF NOT EXISTS subscription_status subscription_status DEFAULT 'active' NOT NULL,
      ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS artwork_limit INTEGER DEFAULT 5 NOT NULL,
      ADD COLUMN IF NOT EXISTS artwork_count INTEGER DEFAULT 0 NOT NULL,
      ADD COLUMN IF NOT EXISTS user_limit INTEGER DEFAULT 1 NOT NULL,
      ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 1 NOT NULL
    `)

    // Create user_subscriptions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
        subscription_plan subscription_plan DEFAULT 'free' NOT NULL,
        subscription_status subscription_status DEFAULT 'active' NOT NULL,
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        organization_limit INTEGER DEFAULT 1 NOT NULL,
        organization_count INTEGER DEFAULT 0 NOT NULL,
        subscription_ends_at TIMESTAMP,
        trial_ends_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `)

    console.log('✅ Successfully added subscription management fields to database')
  } catch (error) {
    console.error('❌ Error migrating subscription fields:', error)
    throw error
  }
}

// Run the migration
migrateSubscriptionFields()
  .then(() => {
    console.log('Subscription migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Subscription migration failed:', error)
    process.exit(1)
  }) 