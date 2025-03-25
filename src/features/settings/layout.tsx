'use client'

import {
  UserIcon,
  BellIcon,
  UserCogIcon,
  PaletteIcon,
  LayoutIcon,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import SettingsSideNav from './components/sidebar-nav'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebarNavItems = [
    {
      title: 'Profile',
      href: '/settings/profile',
      icon: <UserIcon className='h-4 w-4' />,
    },
    {
      title: 'Account',
      href: '/settings/account',
      icon: <UserCogIcon className='h-4 w-4' />,
    },
    {
      title: 'Appearance',
      href: '/settings/appearance',
      icon: <PaletteIcon className='h-4 w-4' />,
    },
    {
      title: 'Notifications',
      href: '/settings/notifications',
      icon: <BellIcon className='h-4 w-4' />,
    },
    {
      title: 'Display',
      href: '/settings/display',
      icon: <LayoutIcon className='h-4 w-4' />,
    },
  ]

  return (
    <div className='space-y-6 pb-16 md:block'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className='my-6' />
      <div className='flex flex-col gap-8 md:flex-row md:gap-16'>
        <SettingsSideNav items={sidebarNavItems} />
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  )
}
