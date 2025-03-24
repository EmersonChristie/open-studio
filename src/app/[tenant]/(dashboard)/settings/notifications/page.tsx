import { Suspense } from 'react'
import { SettingsSkeleton } from '@/components/ui/skeletons/settings-skeleton'
import SettingsNotifications from '@/features/settings/notifications'

export const metadata = {
  title: 'Settings | Notifications',
  description: 'Manage your notification preferences',
}

export default function NotificationsSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsNotifications />
    </Suspense>
  )
}
