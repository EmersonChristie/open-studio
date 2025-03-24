'use client'

import React from 'react'
import { useTenant } from '@/context/tenant-context'
import Dashboard from '@/features/dashboard'

export default function DashboardPage() {
  const { tenant, isLoading } = useTenant()

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-xl font-medium'>Loading tenant information...</div>
      </div>
    )
  }

  return <Dashboard />
}
