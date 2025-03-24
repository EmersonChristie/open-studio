import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import with dynamic loading to avoid server/client mismatch with form components
const SignIn = dynamic(() => import('@/features/auth/sign-in'), {
  ssr: false,
  loading: () => <SignInSkeleton />,
})

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

// Simple loading skeleton for sign-in form
function SignInSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignIn />
    </Suspense>
  )
}
