/**
 * Database testing utilities
 * This file contains helper functions for testing database operations
 */
import { TenantSettings } from '@/types/tenant'
import { db, dbHealthCheck } from './index'
import * as tenantService from './services/tenant-service'

/**
 * Test the database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing database connection...')
    const isHealthy = await dbHealthCheck()
    console.log(`Database connection ${isHealthy ? 'successful' : 'failed'}`)
    return isHealthy
  } catch (error) {
    console.error('Error testing database connection:', error)
    return false
  }
}

/**
 * Test tenant service operations
 */
export async function testTenantService(): Promise<boolean> {
  try {
    console.log('Testing tenant service operations...')

    // Test data for tenant
    const testTenant = {
      slug: `test-tenant-${Date.now()}`, // Use timestamp to ensure uniqueness
      name: 'Test Tenant',
      description: 'A test tenant for verifying service operations',
      contactEmail: 'test@example.com',
      settings: {
        theme: 'light',
        primaryColor: '#3b82f6',
        features: {
          analytics: true,
          tasks: true,
        },
      } as TenantSettings,
    }

    // Create tenant
    console.log('Creating test tenant...')
    const createdTenant = await tenantService.createTenant(testTenant)
    console.log('Created tenant:', createdTenant)

    if (!createdTenant || !createdTenant.id) {
      throw new Error('Failed to create test tenant')
    }

    // Get tenant by slug
    console.log('Getting tenant by slug...')
    const retrievedTenant = await tenantService.getTenantBySlug(testTenant.slug)
    console.log('Retrieved tenant:', retrievedTenant)

    if (!retrievedTenant || retrievedTenant.slug !== testTenant.slug) {
      throw new Error('Failed to retrieve tenant by slug')
    }

    // Update tenant settings
    console.log('Updating tenant settings...')
    const updatedSettings = {
      theme: 'dark',
      accentColor: '#f43f5e',
    }

    const tenantWithUpdatedSettings = await tenantService.updateTenantSettings(
      createdTenant.id,
      updatedSettings
    )

    console.log('Updated tenant settings:', tenantWithUpdatedSettings?.settings)

    // Verify settings were merged correctly
    const hasUpdatedTheme =
      tenantWithUpdatedSettings?.settings?.theme === 'dark'
    const hasNewAccentColor =
      tenantWithUpdatedSettings?.settings?.accentColor === '#f43f5e'
    const retainedFeatures =
      !!tenantWithUpdatedSettings?.settings?.features?.analytics

    if (!hasUpdatedTheme || !hasNewAccentColor || !retainedFeatures) {
      throw new Error('Settings update did not work correctly')
    }

    // Update tenant data
    console.log('Updating tenant data...')
    const updatedData = {
      name: 'Updated Test Tenant',
      description: 'This tenant has been updated',
    }

    const updatedTenant = await tenantService.updateTenant(
      createdTenant.id,
      updatedData
    )

    console.log('Updated tenant:', updatedTenant)

    if (updatedTenant?.name !== 'Updated Test Tenant') {
      throw new Error('Tenant update did not work correctly')
    }

    // Clean up - delete the test tenant
    console.log('Cleaning up - deleting test tenant...')
    await tenantService.deleteTenant(createdTenant.id)

    // Verify deletion
    const shouldBeNull = await tenantService.getTenantBySlug(testTenant.slug)
    if (shouldBeNull) {
      throw new Error('Failed to delete tenant')
    }

    console.log('All tenant service operations completed successfully!')
    return true
  } catch (error) {
    console.error('Error testing tenant service:', error)
    return false
  }
}

/**
 * Run all database tests
 */
export async function runDatabaseTests(): Promise<void> {
  console.log('Running database tests...')
  const connectionOk = await testDatabaseConnection()

  if (!connectionOk) {
    console.error('Database connection test failed. Skipping service tests.')
    return
  }

  const tenantServiceOk = await testTenantService()

  if (tenantServiceOk) {
    console.log('All database tests passed successfully!')
  } else {
    console.error('Some database tests failed. See logs for details.')
  }
}
