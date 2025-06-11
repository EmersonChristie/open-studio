/**
 * Database initialization script
 * This script creates the necessary tables in the database.
 * 
 * Run with: pnpm tsx scripts/init-db.ts
 */

import * as dotenv from 'dotenv'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import * as schema from '../src/lib/db/schema'

// Load environment variables
dotenv.config()

// Database connection string
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

async function createEnums() {
  const pool = new Pool({ connectionString })
  
  try {
    // Create the enums first
    console.log('Creating enum types...')
    await pool.query(`
      DO $$ 
      BEGIN
        -- Create user role enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('owner', 'admin', 'staff', 'artist', 'client', 'guest');
        END IF;
        
        -- Create artwork status enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'artwork_status') THEN
          CREATE TYPE artwork_status AS ENUM ('available', 'sold', 'reserved', 'on_loan', 'not_for_sale');
        END IF;
        
        -- Create client status enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_status') THEN
          CREATE TYPE client_status AS ENUM ('active', 'prospect', 'inactive', 'vip');
        END IF;
        
        -- Create sale status enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sale_status') THEN
          CREATE TYPE sale_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
        END IF;
      END $$;
    `)
    console.log('Enum types created successfully')
  } catch (error) {
    console.error('Error creating enum types:', error)
    throw error
  } finally {
    await pool.end()
  }
}

async function createTables() {
  console.log('Creating tables...')
  
  const pool = new Pool({ connectionString })
  const db = drizzle(pool, { schema })
  
  try {
    // Create tenants table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        logo_url VARCHAR(255),
        website_url VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        country VARCHAR(100),
        settings JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        email_verified BOOLEAN DEFAULT FALSE,
        name VARCHAR(255),
        password VARCHAR(255),
        avatar_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    // Create user_tenants table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_tenants (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        tenant_id INTEGER NOT NULL REFERENCES tenants(id),
        role user_role NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        permissions JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    // Create sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        tenant_id INTEGER REFERENCES tenants(id),
        user_agent TEXT,
        ip_address VARCHAR(50)
      )
    `)
    
    // Create password_reset_tokens table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    // Create tenant_invitations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tenant_invitations (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id),
        email VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  } finally {
    await pool.end()
  }
}

async function main() {
  try {
    console.log('Initializing database...')
    
    // First create the enum types
    await createEnums()
    
    // Then create the tables
    await createTables()
    
    console.log('Database initialization completed successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    process.exit(1)
  }
}

// Run the initialization
main() 