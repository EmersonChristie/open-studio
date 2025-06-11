/**
 * Tenant settings interface
 */
export interface TenantSettings {
  theme?: string
  primaryColor?: string
  accentColor?: string
  logo?: string
  favicon?: string
  features?: Record<string, boolean>
}

/**
 * Tenant interface for use in the application
 */
export interface Tenant {
  id: number
  slug: string
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  isActive: boolean
  settings?: TenantSettings
  createdAt: Date
  updatedAt: Date
}
