import Settings from '@/features/settings'

export default async function SettingsLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ tenant: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return <Settings tenantId={params.tenant}>{children}</Settings>
}
