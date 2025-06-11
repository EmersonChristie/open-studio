/**
 * Database error handling utilities
 * This file contains helper functions for handling database errors
 */

// Define custom error types for database operations
export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class TenantNotFoundError extends DatabaseError {
  constructor(public tenantId: string | number) {
    super(`Tenant with ID ${tenantId} not found`)
    this.name = 'TenantNotFoundError'
  }
}

export class DuplicateKeyError extends DatabaseError {
  constructor(
    public field: string,
    public value: string,
    originalError?: unknown
  ) {
    super(`Duplicate value '${value}' for ${field}`, originalError)
    this.name = 'DuplicateKeyError'
  }
}

export class ValidationError extends DatabaseError {
  constructor(
    message: string,
    public field?: string,
    originalError?: unknown
  ) {
    super(message, originalError)
    this.name = 'ValidationError'
  }
}

/**
 * Extract postgres error code from generic error object
 */
function getPostgresErrorCode(error: unknown): string | null {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return error.code
  }
  return null
}

/**
 * Handle database errors and convert to appropriate custom errors
 */
export function handleDatabaseError(error: unknown, operation: string): never {
  console.error(`Database error during ${operation}:`, error)

  const pgErrorCode = getPostgresErrorCode(error)

  // Handle specific Postgres error codes
  if (pgErrorCode) {
    switch (pgErrorCode) {
      case '23505': // unique_violation
        // Try to extract field and value from error message
        let field = 'unknown'
        let value = 'unknown'

        if (
          error &&
          typeof error === 'object' &&
          'detail' in error &&
          typeof error.detail === 'string'
        ) {
          const detailMatch = error.detail.match(/Key \(([^)]+)\)=\(([^)]+)\)/)
          if (detailMatch) {
            field = detailMatch[1]
            value = detailMatch[2]
          }
        }

        throw new DuplicateKeyError(field, value, error)

      case '23503': // foreign_key_violation
        throw new DatabaseError('Referenced record does not exist', error)

      case '23502': // not_null_violation
        // Extract null field
        let nullField = 'unknown'

        if (
          error &&
          typeof error === 'object' &&
          'column' in error &&
          typeof error.column === 'string'
        ) {
          nullField = error.column
        }

        throw new ValidationError(
          `Field ${nullField} cannot be null`,
          nullField,
          error
        )

      case '42P01': // undefined_table
        throw new DatabaseError(
          'Table not found. Database schema may be outdated',
          error
        )
    }
  }

  // Generic error handling
  throw new DatabaseError(
    `Error during database operation: ${operation}`,
    error
  )
}

/**
 * Safely execute a database operation with error handling
 */
export async function withErrorHandling<T>(
  operation: string,
  callback: () => Promise<T>
): Promise<T> {
  try {
    return await callback()
  } catch (error) {
    handleDatabaseError(error, operation)
  }
}
