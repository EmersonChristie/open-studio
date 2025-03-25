import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/[tenant]/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/[tenant]/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Apps',
          url: '/[tenant]/apps',
          icon: IconPackages,
        },
        {
          title: 'Chats',
          url: '/[tenant]/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Users',
          url: '/[tenant]/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Not Found',
              url: '/not-found',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/error',
              icon: IconServerOff,
            },
            {
              title: 'Unauthorized',
              url: '/unauthorized',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/forbidden',
              icon: IconBarrierBlock,
            },
            {
              title: 'Maintenance',
              url: '/maintenance',
              icon: IconUserOff,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/[tenant]/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/[tenant]/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/[tenant]/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/[tenant]/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/[tenant]/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/[tenant]/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
