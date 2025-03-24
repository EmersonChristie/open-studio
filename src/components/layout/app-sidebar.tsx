import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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

export function AppSidebar({ tenantId, ...props }: AppSidebarProps) {
  // Create sidebar data with tenant ID replaced in URLs
  const sidebarDataWithTenant = tenantId
    ? createSidebarDataWithTenant(sidebarData, tenantId)
    : sidebarData

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarDataWithTenant.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarDataWithTenant.navGroups.map((navGroupProps: NavGroupType) => (
          <NavGroup key={navGroupProps.title} {...navGroupProps} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarDataWithTenant.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
