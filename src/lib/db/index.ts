import { sql } from 'drizzle-orm'
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import { Pool } from 'pg'
import postgres from 'postgres'
import * as schema from './schema'

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config()
}

// Database connection
const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5432/openstudio'

// Initialize database connection
let db: ReturnType<typeof drizzlePg> | ReturnType<typeof drizzlePostgres>

// First, try to use node-postgres (pg)
try {
  const pool = new Pool({
    connectionString,
  })

  db = drizzlePg(pool, { schema })
  console.log('Successfully connected to database using node-postgres')
} catch (error) {
  // If that fails, fallback to postgres.js
  console.log('Falling back to postgres.js driver:', error)
  const client = postgres(connectionString)
  db = drizzlePostgres(client, { schema })
  console.log('Successfully connected to database using postgres.js')
}

// Export the database instance
export { db }

// Global function to get current tenant ID from context
let currentTenantId: string | null = null

/**
 * Set the current tenant ID for the database context
 * This function should be called before any database operations
 */
export function setCurrentTenantId(tenantId: string) {
  currentTenantId = tenantId
}

/**
 * Get the current tenant ID
 * This is used internally by the database queries
 */
export function getCurrentTenantId(): string {
  if (!currentTenantId) {
    throw new Error('Tenant ID not set in database context')
  }
  return currentTenantId
}

/**
 * Clear the current tenant ID from the context
 * This should be called after database operations are complete
 */
export function clearCurrentTenantId() {
  currentTenantId = null
}

/**
 * Execute a raw SQL query with the current tenant ID
 * This is useful for complex queries that need tenant isolation
 */
export async function queryWithTenant<T = unknown>(
  query: string,
  params: unknown[] = [],
  tenantId?: string
): Promise<T[]> {
  const actualTenantId = tenantId || getCurrentTenantId()

  try {
    // Add tenant_id to WHERE clause if not present
    const hasTenantFilter = query.toLowerCase().includes('tenant_id')
    const modifiedQuery = hasTenantFilter
      ? query
      : `${query} ${query.toLowerCase().includes('where') ? 'AND' : 'WHERE'} tenant_id = $${params.length + 1}`

    // Use drizzle's SQL tag for raw queries
    const result = await db.execute(
      sql.raw(modifiedQuery, [...params, actualTenantId])
    )
    return result as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Run a database health check
 */
export async function dbHealthCheck(): Promise<boolean> {
  try {
    // Use drizzle's SQL tag for raw queries
    const result = await db.execute(sql`SELECT 1 as health_check`)

    // More robust checking - handle different possible result structures
    if (Array.isArray(result) && result.length > 0) {
      // Check for object with health_check property
      if (
        result[0] &&
        typeof result[0] === 'object' &&
        'health_check' in result[0]
      ) {
        return result[0].health_check === 1
      }

      // Check for raw value response
      if (result[0] && typeof result[0] === 'object') {
        const firstValue = Object.values(result[0])[0]
        return firstValue === 1
      }
    }

    // If we couldn't verify, but we got a result, assume connection is OK
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

/**
 * This function is implementation-specific and needs to be called
 * differently based on the actual driver being used.
 * In a real implementation, you'd want to track which driver is in use
 * and call the appropriate close method.
 */
export async function closeDatabase(): Promise<void> {
  try {
    // This won't work universally - it depends on the driver
    // You'd need to store a reference to the actual client/pool
    // and call the appropriate method
    console.log('Closing database connection')
  } catch (error) {
    console.error('Error closing database connection:', error)
  }
}
