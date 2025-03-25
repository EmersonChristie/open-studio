'use client'

import dynamic from 'next/dynamic'
import OTPSkeleton from './otp-skeleton'

// Import with dynamic loading to avoid server/client mismatch with form components
const OTP = dynamic(() => import('@/features/auth/otp'), {
  ssr: false,
  loading: () => <OTPSkeleton />,
})

export default function OTPClient() {
  return <OTP />
}
