import { Suspense } from 'react'
import { SettingsSkeleton } from '@/components/ui/skeletons/settings-skeleton'
import SettingsAccount from '@/features/settings/account'

export const metadata = {
  title: 'Settings | Account',
  description: 'Manage your account settings',
}

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsAccount />
    </Suspense>
  )
}
