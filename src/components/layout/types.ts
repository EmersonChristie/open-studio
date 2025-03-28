import { ReactNode } from 'react'

// Icons are React components
export type IconComponent = React.ComponentType<{
  size?: number | string
  className?: string
}>

// Base navigation item (shared properties)
export interface NavItem {
  title: string
  url?: string
  icon?: IconComponent
  badge?: string | number
}

// Navigation link (no children)
export interface NavLink extends NavItem {
  url: string
}

// Collapsible navigation item with children
export interface NavCollapsible extends NavItem {
  items: NavLink[]
}

// Navigation group
export interface NavGroup {
  title: string
  items: Array<NavLink | NavCollapsible>
}

// Team type for team-switcher
export interface Team {
  name: string
  logo: React.ElementType
  plan: string
}

// User type for user information
export interface User {
  name: string
  email: string
  avatar: string
}

// Complete sidebar data structure
export interface SidebarData {
  navGroups: NavGroup[]
  teams: Team[]
  user: User
}
