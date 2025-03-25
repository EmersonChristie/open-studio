import { Suspense } from 'react'
import SignInClient from './sign-in-client'
import SignInSkeleton from './sign-in-skeleton'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInClient />
    </Suspense>
  )
}
