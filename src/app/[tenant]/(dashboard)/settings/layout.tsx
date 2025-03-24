import Settings from '@/features/settings'

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  return <Settings tenantId={params.tenant}>{children}</Settings>
}
