import { SignUp } from '@clerk/nextjs'

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignUpPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignUp />
    </div>
  )
}
