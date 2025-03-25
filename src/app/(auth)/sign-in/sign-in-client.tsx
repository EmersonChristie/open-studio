'use client'

import dynamic from 'next/dynamic'
import SignInSkeleton from './sign-in-skeleton'

// Import with dynamic loading to avoid server/client mismatch with form components
const SignIn = dynamic(() => import('@/features/auth/sign-in'), {
  ssr: false,
  loading: () => <SignInSkeleton />,
})

export default function SignInClient() {
  return <SignIn />
}
