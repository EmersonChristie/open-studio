import { Suspense } from 'react'
import { SettingsSkeleton } from '@/components/ui/skeletons/settings-skeleton'
import SettingsDisplay from '@/features/settings/display'

export const metadata = {
  title: 'Settings | Display',
  description: 'Manage your display settings',
}

export default function DisplaySettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsDisplay />
    </Suspense>
  )
}
