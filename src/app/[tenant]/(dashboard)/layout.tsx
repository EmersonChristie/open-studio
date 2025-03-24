import React from 'react'
import { TenantLayoutClient } from './tenant-layout-client'

export default async function TenantDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  // Making dynamic parameters serializable for client components
  const tenant = params.tenant

  return <TenantLayoutClient tenant={tenant}>{children}</TenantLayoutClient>
}
