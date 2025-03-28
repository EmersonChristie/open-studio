import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'
import { NavGroup as NavGroupType } from './types'
import { createSidebarDataWithTenant } from './utils/sidebar-utils'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  tenantId?: string
}

export function AppSidebar({ tenantId, className, ...props }: AppSidebarProps) {
  const { state } = useSidebar()

  // Create sidebar data with tenant ID replaced in URLs
  const sidebarDataWithTenant = tenantId
    ? createSidebarDataWithTenant(sidebarData, tenantId)
    : sidebarData

  return (
    <Sidebar
      collapsible='icon'
      variant='floating'
      className={cn(className)}
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={sidebarDataWithTenant.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarDataWithTenant.navGroups.map((group: NavGroupType) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarDataWithTenant.user} />
      </SidebarFooter>
      <SidebarRail className='transition-movement' />
    </Sidebar>
  )
}
