'use client'

import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'

interface SettingsProps {
  tenantId?: string
  children?: React.ReactNode
}

export default function Settings({ tenantId, children }: SettingsProps) {
  // If we're using the component directly in Next.js App Router pages, we won't need to render children
  // since they will be rendered in the layout component instead
  const showContent = Boolean(children)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} tenantId={tenantId} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            {/* This allows the component to work both with Next.js children and standalone */}
            {showContent ? children : null}
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '',
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: 'account',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: 'appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: 'notifications',
  },
  {
    title: 'Display',
    icon: <IconBrowserCheck size={18} />,
    href: 'display',
  },
]
