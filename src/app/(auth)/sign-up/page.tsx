import { Suspense } from 'react'
import SignUpClient from './sign-up-client'
import SignUpSkeleton from './sign-up-skeleton'

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUpClient />
    </Suspense>
  )
}
