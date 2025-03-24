import React from 'react'
import { TenantLayoutClient } from './tenant-layout-client'

export default async function TenantDashboardLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ tenant: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  // Making dynamic parameters serializable for client components
  const tenant = params.tenant

  return <TenantLayoutClient tenant={tenant}>{children}</TenantLayoutClient>
}
