import { Suspense } from 'react'
import OTPClient from './otp-client'
import OTPSkeleton from './otp-skeleton'

export const metadata = {
  title: 'Verification',
  description: 'Verify your account with a one-time code',
}

export default function OTPPage() {
  return (
    <Suspense fallback={<OTPSkeleton />}>
      <OTPClient />
    </Suspense>
  )
}
