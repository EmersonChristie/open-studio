'use client'

import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { TenantProvider } from '@/context/tenant-context'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

interface TenantLayoutClientProps {
  children: React.ReactNode
  tenant: string
}

/**
 * Content wrapper that adapts to sidebar state
 */
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { state, openMobile, isMobile } = useSidebar()

  // Close mobile sidebar when route changes
  useEffect(() => {
    // We can't use next/navigation usePathname() here because it would cause
    // a circular dependency with the SidebarProvider
    const handleRouteChange = () => {
      if (isMobile && openMobile) {
        document.body.click() // Simple way to trigger closing the sheet
      }
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [isMobile, openMobile])

  return (
    <div
      id='content'
      className={cn(
        // Base styling
        'transition-movement relative ml-auto flex h-svh flex-col',

        // Width calculations for expanded sidebar
        'w-full',
        // When NOT mobile: adjust width based on sidebar state
        'md:w-[calc(100%-var(--sidebar-width))]',

        // When sidebar is collapsed to icon only mode, adjust width
        'md:peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon))]',

        // Handle height in different scroll scenarios
        'group-data-[scroll-locked=1]/body:h-full',
        'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
      )}
    >
      {children}
    </div>
  )
}

export function TenantLayoutClient({
  children,
  tenant,
}: TenantLayoutClientProps) {
  // Get the sidebar state from cookies, defaulting to true (expanded)
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <TenantProvider tenantId={tenant}>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <div className='flex min-h-svh w-full overflow-hidden'>
            <AppSidebar tenantId={tenant} />
            <ContentWrapper>{children}</ContentWrapper>
          </div>
        </SidebarProvider>
      </SearchProvider>
    </TenantProvider>
  )
}
