import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import with dynamic loading to avoid server/client mismatch with form components
const OTP = dynamic(() => import('@/features/auth/otp'), {
  ssr: false,
  loading: () => <OTPSkeleton />,
})

export const metadata = {
  title: 'Verification',
  description: 'Verify your account with a one-time code',
}

// Simple loading skeleton for OTP form
function OTPSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-4 w-3/4 animate-pulse rounded-md bg-primary/10' />
      <div className='flex justify-between space-x-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-12 w-12 animate-pulse rounded-md bg-primary/10'
          />
        ))}
      </div>
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}

export default function OTPPage() {
  return (
    <Suspense fallback={<OTPSkeleton />}>
      <OTP />
    </Suspense>
  )
}
