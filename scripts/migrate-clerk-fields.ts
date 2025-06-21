import { db } from '../src/lib/db'
import { sql } from 'drizzle-orm'

async function migrateClerkFields() {
  console.log('Adding Clerk fields to existing database...')

  try {
    // First, add 'user' to user_role enum if not exists
    await db.execute(sql`
      ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'user'
    `)

    // Add new columns to users table
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(255),
      ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'
    `)

    // Add new column to tenants table
    await db.execute(sql`
      ALTER TABLE tenants 
      ADD COLUMN IF NOT EXISTS clerk_org_id VARCHAR(255) UNIQUE
    `)

    // Update user_tenants table to use varchar for foreign keys
    // First drop the foreign key constraints
    await db.execute(sql`
      ALTER TABLE user_tenants 
      DROP CONSTRAINT IF EXISTS user_tenants_user_id_fkey,
      DROP CONSTRAINT IF EXISTS user_tenants_tenant_id_fkey
    `)

    // Then change the column types
    await db.execute(sql`
      ALTER TABLE user_tenants 
      ALTER COLUMN user_id TYPE VARCHAR(255),
      ALTER COLUMN tenant_id TYPE VARCHAR(255)
    `)

    console.log('✅ Successfully added Clerk fields to database')
  } catch (error) {
    console.error('❌ Error migrating Clerk fields:', error)
    throw error
  }
}

// Run the migration
migrateClerkFields()
  .then(() => {
    console.log('Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  }) 