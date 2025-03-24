import { Suspense } from 'react'
import { SettingsSkeleton } from '@/components/ui/skeletons/settings-skeleton'
// Import settings profile component
import SettingsProfile from '@/features/settings/profile'

export const metadata = {
  title: 'Settings | Profile',
  description: 'Manage your profile settings and preferences',
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsProfile />
    </Suspense>
  )
}
