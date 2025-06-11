import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

// Load environment variables
dotenv.config();

// Get the database URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default {
  schema: './src/lib/db/schema/*.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  // @ts-ignore - Ignoring type issues with Drizzle config
  // Using postgres driver which may not be properly typed in the current version
  driver: 'postgres',
  dbCredentials: {
    connectionString,
  },
  // Print all statements
  verbose: true,
  // Shows detailed logs
  strict: true,
} satisfies Config; 