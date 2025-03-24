import {
  NavCollapsible,
  NavGroup,
  NavItem,
  NavLink,
  SidebarData,
} from '../types'

/**
 * Replaces [tenant] placeholders in URLs with the actual tenant ID
 */
export function replaceTenantInUrl(url: string, tenantId: string): string {
  return url.replace(/\[tenant\]/g, tenantId)
}

/**
 * Processes a NavItem to replace tenant placeholders in URLs
 */
function processNavItem(item: NavItem, tenantId: string): NavItem {
  // For NavLink items (no sub-items)
  if (!('items' in item)) {
    const navLink = item as NavLink
    return {
      ...navLink,
      url: replaceTenantInUrl(navLink.url, tenantId),
    }
  }

  // For NavCollapsible items (with sub-items)
  const collapsible = item as NavCollapsible
  return {
    ...collapsible,
    items: collapsible.items.map((subItem) => ({
      ...subItem,
      url: replaceTenantInUrl(subItem.url, tenantId),
    })),
  }
}

/**
 * Creates a new SidebarData object with tenant placeholders replaced in all URLs
 */
export function createSidebarDataWithTenant(
  sidebarData: SidebarData,
  tenantId: string
): SidebarData {
  return {
    ...sidebarData,
    navGroups: sidebarData.navGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => processNavItem(item, tenantId)),
    })),
  }
}
