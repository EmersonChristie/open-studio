'use client'

import dynamic from 'next/dynamic'
import ForgotPasswordSkeleton from './forgot-password-skeleton'

// Import with dynamic loading to avoid server/client mismatch with form components
const ForgotPassword = dynamic(
  () => import('@/features/auth/forgot-password'),
  {
    ssr: false,
    loading: () => <ForgotPasswordSkeleton />,
  }
)

export default function ForgotPasswordClient() {
  return <ForgotPassword />
}
