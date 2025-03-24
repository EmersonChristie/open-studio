import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import with dynamic loading to avoid server/client mismatch with form components
const SignUp = dynamic(() => import('@/features/auth/sign-up'), {
  ssr: false,
  loading: () => <SignUpSkeleton />,
})

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

// Simple loading skeleton for sign-up form
function SignUpSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUp />
    </Suspense>
  )
}
