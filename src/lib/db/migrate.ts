import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { Pool } from 'pg'

// Load environment variables
dotenv.config()

// Database connection string
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

// Main migration function
async function main() {
  console.log('Migration started...')

  // Create a PostgreSQL pool
  const pool = new Pool({
    connectionString,
  })

  // Create Drizzle instance
  const db = drizzle(pool)

  // Run migrations
  try {
    await migrate(db, { migrationsFolder: 'src/lib/db/migrations' })
    console.log('Migration completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    // Close database connection
    await pool.end()
  }
}

// Run the migration
main()
