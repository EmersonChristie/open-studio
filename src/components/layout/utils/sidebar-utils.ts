import {
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  SidebarData,
} from '../types'

/**
 * Replace [tenant] in URL with the actual tenant ID
 */
export function replaceTenantInUrl(url: string, tenantId: string): string {
  return url.replace(/\[tenant\]/g, tenantId)
}

/**
 * Process a navigation item to replace tenant placeholders
 */
export function processNavItem(item: NavItem, tenantId: string): NavItem {
  // Special case: check if this is a NavLink with an error page URL
  if ('url' in item && (item.url === '/error' || item.url === '/not-found')) {
    return item
  }

  // For collapsible items
  if ('items' in item) {
    const collapsible = item as NavCollapsible
    // We need to process each item individually
    const items = collapsible.items.map((subItem) => {
      const processed = processNavItem(subItem as NavItem, tenantId)
      // We only want NavLink items in the array
      if (!('url' in processed)) {
        throw new Error('Expected NavLink in collapsible items')
      }
      return processed as NavLink
    })

    return {
      ...collapsible,
      items,
    } as NavCollapsible
  }

  // For navigation links
  const navLink = item as NavLink
  return {
    ...navLink,
    url: replaceTenantInUrl(navLink.url, tenantId),
  }
}

/**
 * Create sidebar data with tenant placeholders replaced
 */
export function createSidebarDataWithTenant(
  sidebarData: SidebarData,
  tenantId: string
): SidebarData {
  const processedNavGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => processNavItem(item, tenantId)),
  }))

  return {
    ...sidebarData,
    navGroups: processedNavGroups,
  }
}
