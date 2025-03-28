'use client'

// Fixed React imports
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface Tenant {
  id: string
  name: string
  slug: string
  settings?: {
    theme?: string
    logo?: string
    colors?: Record<string, string>
  }
}

interface TenantContextType {
  tenant: Tenant | null
  isLoading: boolean
  error: Error | null
}

// Properly typed context with default values
const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: false,
  error: null,
})

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: ReactNode
  tenantId: string
}

export function TenantProvider({ children, tenantId }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTenant() {
      if (!tenantId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // In a real application, this would be an API call
        // For now, we'll mock the tenant data
        const mockTenant = {
          id: tenantId,
          name: tenantId
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          slug: tenantId,
          settings: {
            theme: 'light',
            logo: '/logo.svg',
          },
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300))

        setTenant(mockTenant)
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load tenant')
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadTenant()
  }, [tenantId])

  const value = {
    tenant,
    isLoading,
    error,
  }

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  )
}
