import { Suspense } from 'react'
import { SettingsSkeleton } from '@/components/ui/skeletons/settings-skeleton'
import SettingsAppearance from '@/features/settings/appearance'

export const metadata = {
  title: 'Settings | Appearance',
  description: 'Customize the appearance of your dashboard',
}

export default function AppearanceSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsAppearance />
    </Suspense>
  )
}
