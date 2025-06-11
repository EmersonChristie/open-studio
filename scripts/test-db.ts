/**
 * Database testing script
 * This script runs tests against the database to verify configuration and service operations
 * 
 * Run with: pnpm tsx scripts/test-db.ts
 */

import { runDatabaseTests } from '../src/lib/db/test-db'

async function main() {
  try {
    await runDatabaseTests()
    process.exit(0)
  } catch (error) {
    console.error('Fatal error running database tests:', error)
    process.exit(1)
  }
}

main() 