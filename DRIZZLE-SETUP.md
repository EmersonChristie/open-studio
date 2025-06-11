# Drizzle ORM Setup Guide

## Introduction

This document provides guidance on how the Drizzle ORM is configured in Open Studio.

## Installation

The project uses Drizzle ORM with PostgreSQL. The following packages are installed:

```bash
pnpm add drizzle-orm pg postgres
pnpm add -D drizzle-kit @types/pg
```

## Version Management

To prevent type conflicts between different versions of Drizzle ORM, we use PNPM overrides to enforce a consistent version:

```json
"pnpm": {
  "overrides": {
    "drizzle-orm": "0.42.0"
  }
}
```

We also use a custom `.npmrc` configuration to improve package resolution:

```
node-linker=hoisted
strict-peer-dependencies=false
auto-install-peers=true
resolution-mode=highest
```

## Database Connection

The database connection is set up in `src/lib/db/index.ts` with a fallback mechanism that supports both the `node-postgres` and `postgres.js` drivers:

```typescript
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { Pool } from 'pg';
import postgres from 'postgres';
import * as schema from './schema';

// Initialize database connection
let db: ReturnType<typeof drizzlePg> | ReturnType<typeof drizzlePostgres>;

// First, try to use node-postgres (pg)
try {
  const pool = new Pool({
    connectionString,
  });
  
  db = drizzlePg(pool, { schema });
  console.log('Successfully connected to database using node-postgres');
} catch (error) {
  // If that fails, fallback to postgres.js
  console.log('Falling back to postgres.js driver:', error);
  const client = postgres(connectionString);
  db = drizzlePostgres(client, { schema });
  console.log('Successfully connected to database using postgres.js');
}

// Export the database instance
export { db };
```

This approach provides resilience by allowing the application to fall back to an alternative driver if the primary one fails.

## Schema Definition

Database schemas are defined in `src/lib/db/schema/` directory. Each entity has its own file, and common types are defined in `_common.ts`.

Example from `tenants.ts`:

```typescript
import { pgTable, varchar, serial, text, boolean, json } from 'drizzle-orm/pg-core';
import { timestamps } from './_common';

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  // ... other fields
  settings: json('settings').$type<TenantSettings>(),
  ...timestamps,
});
```

## Error Handling

We use a custom error handling system to manage database errors. The error handling utilities are defined in `src/lib/db/utils/error-handler.ts`.

Example usage:

```typescript
import { withErrorHandling, TenantNotFoundError } from '../utils/error-handler';

export async function getTenantBySlug(slug: string) {
  return withErrorHandling(`getTenantBySlug(${slug})`, async () => {
    // Database operation here
  });
}
```

Our error handling system includes specialized error types:

- `DatabaseError`: Base class for all database errors
- `TenantNotFoundError`: Thrown when a tenant is not found
- `DuplicateKeyError`: Thrown when a unique constraint is violated
- `ValidationError`: Thrown when a validation rule is violated

## Testing Database Operations

You can test database operations using the `db:test` script:

```bash
pnpm db:test
```

This script runs the tests defined in `src/lib/db/test-db.ts`.

## Common Issues and Solutions

### Type Conflicts

If you encounter type conflicts, it's typically due to mismatched versions of Drizzle ORM. Use the `clean-install.sh` script to perform a clean installation:

```bash
./clean-install.sh
```

### Schema Changes

After modifying the schema, generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### Database Driver Issues

If you encounter issues with one database driver, the application will automatically try to use an alternative driver. This fallback mechanism provides resilience against driver-specific issues.

### Table Not Found Errors

If you encounter "table not found" errors, you may need to run migrations:

```bash
pnpm db:migrate
```

Or push the schema directly (for development):

```bash
pnpm db:push
``` 