import { ReactNode } from 'react'
import React from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel as UISidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { NavCollapsible, NavItem, NavLink, type NavGroup } from './types'

// Type guards to check NavLink vs NavCollapsible
function isNavCollapsible(
  item: NavLink | NavCollapsible
): item is NavCollapsible {
  return 'items' in item
}

function isNavLink(item: NavLink | NavCollapsible): item is NavLink {
  return !('items' in item)
}

export function NavGroup({ title, items }: NavGroup) {
  const { state } = useSidebar()
  const pathname = usePathname()
  // Start with sidebar groups expanded by default
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <SidebarGroup className=''>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {title && (
          <UISidebarGroupLabel
            className='cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
          >
            {title}
          </UISidebarGroupLabel>
        )}
        <CollapsibleContent className='transition-movement'>
          <SidebarMenu className='transition-theme'>
            {items.map((item) => {
              const key = `${item.title}-${item.url || ''}`

              if (isNavLink(item)) {
                return (
                  <SidebarMenuLink key={key} item={item} pathname={pathname} />
                )
              }

              if (state === 'collapsed' && isNavCollapsible(item)) {
                return (
                  <SidebarMenuCollapsedDropdown
                    key={key}
                    item={item}
                    pathname={pathname}
                  />
                )
              }

              if (isNavCollapsible(item)) {
                return (
                  <SidebarMenuCollapsible
                    key={key}
                    item={item}
                    pathname={pathname}
                  />
                )
              }

              return null
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuLink = ({
  item,
  pathname,
}: {
  item: NavLink
  pathname: string
}) => {
  const { setOpenMobile } = useSidebar()
  const router = useRouter()

  // For error pages, use programmatic navigation with router.push
  // to ensure we navigate to the root-level pages
  const handleClick = () => {
    setOpenMobile(false)

    if (item.url === '/error' || item.url === '/not-found') {
      router.push(item.url)
    }
  }

  const isActive = checkIsActive(pathname, item)

  return (
    <SidebarMenuItem className=''>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className=''
      >
        <Link href={item.url} onClick={handleClick} className=''>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

const SidebarMenuCollapsible = ({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) => {
  const { setOpenMobile } = useSidebar()
  const isActive = checkIsActive(pathname, item, true)

  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className='group/collapsible transition-movement'
    >
      <SidebarMenuItem className=''>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} className=''>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='custom-transform-transition ml-auto duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent transition-movement'>
          <SidebarMenuSub className=''>
            {item.items.map((subItem) => {
              const subItemActive = checkIsActive(pathname, subItem)
              return (
                <SidebarMenuSubItem key={subItem.title} className=''>
                  <SidebarMenuSubButton
                    asChild
                    isActive={subItemActive}
                    className=''
                  >
                    <Link
                      href={subItem.url}
                      onClick={() => setOpenMobile(false)}
                      className=''
                    >
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({
  item,
  pathname,
}: {
  item: NavCollapsible
  pathname: string
}) => {
  const isActive = checkIsActive(pathname, item)

  return (
    <SidebarMenuItem className=''>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className=''
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='custom-transform-transition ml-auto duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side='right'
          align='start'
          sideOffset={4}
          className='transition-movement'
        >
          <DropdownMenuLabel className=''>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const subActive = checkIsActive(pathname, sub)
            return (
              <DropdownMenuItem
                key={`${sub.title}-${sub.url}`}
                asChild
                className=''
              >
                <Link
                  href={sub.url}
                  className={cn('', subActive ? 'bg-secondary' : '')}
                >
                  {sub.icon && <sub.icon />}
                  <span className='max-w-52 text-wrap'>{sub.title}</span>
                  {sub.badge && (
                    <span className='ml-auto text-xs'>{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(
  pathname: string,
  item: NavItem,
  mainNav = false
): boolean {
  const hasItems = 'items' in item && Array.isArray(item.items)

  return !!(
    pathname === item.url || // /endpoint
    (hasItems &&
      (item as NavCollapsible).items.some((i) => i.url === pathname)) || // if child nav is active
    (mainNav &&
      pathname.split('/')[1] !== '' &&
      item.url &&
      pathname.split('/')[1] === item.url.split('/')[1])
  )
}

interface SidebarGroupLabelProps {
  title: string
  chevron?: boolean
  isCollapsed?: boolean
  onClick?: () => void
  className?: string
}

export const SidebarGroupLabel = ({
  title,
  chevron,
  isCollapsed,
  onClick,
  className,
}: SidebarGroupLabelProps) => {
  return (
    <CollapsibleTrigger asChild disabled={!chevron}>
      <div
        data-sidebar-group-label
        className={cn(
          'flex items-center gap-2 truncate px-3 py-2 text-xs text-muted-foreground',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <span className='truncate'>{title}</span>
        {chevron && (
          <div className='custom-transform-transition ml-auto group-data-[collapsible=icon]:hidden'>
            <ChevronRight
              className={cn(
                'custom-transform-transition size-3.5',
                !isCollapsed && 'rotate-90'
              )}
            />
          </div>
        )}
      </div>
    </CollapsibleTrigger>
  )
}

interface MenuItemProps {
  icon?: React.ComponentType | React.ReactNode
  iconOnly?: boolean
  active?: boolean
  current?: boolean
  title?: string
  children?: React.ReactNode
  className?: string
  [key: string]: any
}

function MenuItem({
  icon,
  iconOnly,
  active,
  current,
  title,
  children,
  className,
  ...props
}: MenuItemProps) {
  const Icon = React.useMemo(() => {
    if (!icon) return null
    if (typeof icon === 'function') return icon
    return () => <>{icon}</>
  }, [icon])

  return (
    <div
      data-sidebar-menu-item
      className={cn(
        'group flex w-full items-center rounded-md text-sm',
        'gap-2.5 px-3 py-2',
        'group-data-[collapsible=icon]:min-h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
        className
      )}
      data-active={active ? true : undefined}
      data-current={current ? true : undefined}
      {...props}
    >
      {Icon && (
        <span className='text-lg'>
          <Icon />
        </span>
      )}
      {!iconOnly && (
        <span className='truncate group-data-[collapsible=icon]:hidden'>
          {title}
        </span>
      )}
      {children}
    </div>
  )
}
