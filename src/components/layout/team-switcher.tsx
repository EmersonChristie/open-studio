'use client'

import * as React from 'react'
import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs'
import type { OrganizationMembershipResource } from '@clerk/types'
import { ChevronsUpDown, Plus, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { organization, isLoaded: isOrgLoaded } = useOrganization()
  const {
    setActive,
    userMemberships,
    isLoaded: isMembershipsLoaded,
  } = useOrganizationList({
    userMemberships: true,
  })
  const [isSyncing, setIsSyncing] = React.useState(false)

  // Add revalidate function
  const revalidateMemberships = React.useCallback(() => {
    if (userMemberships?.revalidate) {
      userMemberships.revalidate()
    }
  }, [userMemberships])

  const memberships = userMemberships?.data || []

  // Auto-select organization if there's only one
  React.useEffect(() => {
    if (memberships.length === 1 && !organization && setActive) {
      console.log(
        'Auto-selecting single organization:',
        memberships[0].organization.id
      )
      setActive({ organization: memberships[0].organization.id })
    }
  }, [memberships, organization, setActive])

  const handleOrganizationSelect = async (orgId: string) => {
    if (!setActive) return
    try {
      console.log('Switching to organization:', orgId)
      await setActive({ organization: orgId })
      router.refresh()
    } catch (error) {
      console.error('Error switching organization:', error)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      console.log('Starting organization sync...')
      const response = await fetch('/api/sync-organization', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to sync organization')
      }
      const data = await response.json()
      console.log('Sync response:', data)

      // If we have organizations after sync, set the first one as active
      if (data.organizations?.length > 0 && setActive) {
        const firstOrg = data.organizations[0]
        console.log('Setting active organization:', firstOrg)
        await setActive({ organization: firstOrg.id })
        revalidateMemberships()
      }

      router.refresh()
    } catch (error) {
      console.error('Error syncing organization:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Show loading state while Clerk data is loading
  if (!isUserLoaded || !isOrgLoaded || !isMembershipsLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <RefreshCw className='size-4 animate-spin' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // If no user is loaded, show sign in button
  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            onClick={() => router.push('/sign-in')}
            className='gap-2'
          >
            <div className='flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Plus className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Sign In</span>
              <span className='truncate text-xs text-muted-foreground'>
                Sign in to access your organizations
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // If no organization is selected, show create/sync options
  if (!organization) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className='space-y-2'>
            <SidebarMenuButton
              size='lg'
              onClick={() => router.push('/setup-organization')}
              className='gap-2'
            >
              <div className='flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <Plus className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  Create Organization
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  Get started with your first organization
                </span>
              </div>
            </SidebarMenuButton>

            {memberships.length > 0 && (
              <SidebarMenuButton
                size='lg'
                onClick={handleSync}
                disabled={isSyncing}
                className='gap-2'
              >
                <div className='flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <RefreshCw
                    className={`size-4 ${isSyncing ? 'animate-spin' : ''}`}
                  />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {isSyncing ? 'Syncing...' : 'Sync Organization'}
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    Sync your existing organization
                  </span>
                </div>
              </SidebarMenuButton>
            )}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {organization.imageUrl ? (
                  <img
                    src={organization.imageUrl}
                    alt={organization.name}
                    className='size-4 rounded-sm'
                  />
                ) : (
                  <span className='text-xs font-medium'>
                    {organization.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {organization.name}
                </span>
                <span className='truncate text-xs'>
                  {(organization.publicMetadata?.plan as string) || 'Free'}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Organizations
            </DropdownMenuLabel>
            {memberships.map(
              (membership: OrganizationMembershipResource, index: number) => (
                <DropdownMenuItem
                  key={membership.organization.id}
                  onClick={() =>
                    handleOrganizationSelect(membership.organization.id)
                  }
                  className='gap-2 p-2'
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    {membership.organization.imageUrl ? (
                      <img
                        src={membership.organization.imageUrl}
                        alt={membership.organization.name}
                        className='size-4 rounded-sm'
                      />
                    ) : (
                      <span className='text-xs font-medium'>
                        {membership.organization.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {membership.organization.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push('/setup-organization')}
              className='gap-2 p-2'
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>
                Add organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
