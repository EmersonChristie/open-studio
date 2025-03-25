'use client'

import dynamic from 'next/dynamic'
import SignUpSkeleton from './sign-up-skeleton'

// Import with dynamic loading to avoid server/client mismatch with form components
const SignUp = dynamic(() => import('@/features/auth/sign-up'), {
  ssr: false,
  loading: () => <SignUpSkeleton />,
})

export default function SignUpClient() {
  return <SignUp />
}
