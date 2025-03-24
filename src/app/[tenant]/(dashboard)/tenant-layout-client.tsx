'use client'

import React from 'react'
import Cookies from 'js-cookie'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { TenantProvider } from '@/context/tenant-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

interface TenantLayoutClientProps {
  children: React.ReactNode
  tenant: string
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
          <AppSidebar tenantId={tenant} />
          <div
            id='content'
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'transition-[width] duration-200 ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
            )}
          >
            {children}
          </div>
        </SidebarProvider>
      </SearchProvider>
    </TenantProvider>
  )
}
