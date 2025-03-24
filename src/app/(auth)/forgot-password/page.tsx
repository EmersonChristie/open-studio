import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import with dynamic loading to avoid server/client mismatch with form components
const ForgotPassword = dynamic(
  () => import('@/features/auth/forgot-password'),
  {
    ssr: false,
    loading: () => <ForgotPasswordSkeleton />,
  }
)

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
}

// Simple loading skeleton for forgot password form
function ForgotPasswordSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-4 w-3/4 animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPassword />
    </Suspense>
  )
}
