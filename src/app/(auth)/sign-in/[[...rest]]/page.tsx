import { SignIn } from '@clerk/nextjs'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}

export default function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignIn />
    </div>
  )
}
