import { Suspense } from 'react'
import ForgotPasswordClient from './forgot-password-client'
import ForgotPasswordSkeleton from './forgot-password-skeleton'

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordSkeleton />}>
      <ForgotPasswordClient />
    </Suspense>
  )
}
