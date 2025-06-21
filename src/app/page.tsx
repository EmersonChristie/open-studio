import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirectToDashboard } from '@/lib/auth/user-dashboard'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const { userId } = await auth()

  // If user is authenticated, redirect to their dashboard
  if (userId) {
    await redirectToDashboard()
  }

  // Landing page for unauthenticated users
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-bold'>Open Studio</h1>
        <p className='max-w-2xl text-xl text-muted-foreground'>
          The complete gallery management platform for art galleries, artists,
          and collectors. Manage your inventory, sales, clients, and exhibitions
          all in one place.
        </p>
      </div>

      <div className='w-full max-w-md space-y-4'>
        <div className='space-y-3'>
          <SignInButton mode='modal'>
            <Button size='lg' className='w-full'>
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton mode='modal'>
            <Button variant='outline' size='lg' className='w-full'>
              Create Account
            </Button>
          </SignUpButton>
        </div>

        <div className='text-sm text-muted-foreground'>
          Or{' '}
          <Link href='/sign-in' className='underline hover:text-foreground'>
            sign in with email
          </Link>
        </div>
      </div>

      <div className='mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-lg border p-6 text-left'>
          <h3 className='mb-2 text-lg font-semibold'>Inventory Management</h3>
          <p className='text-sm text-muted-foreground'>
            Track artworks, manage artist relationships, and organize your
            collection with powerful search and filtering.
          </p>
        </div>

        <div className='rounded-lg border p-6 text-left'>
          <h3 className='mb-2 text-lg font-semibold'>Sales Pipeline</h3>
          <p className='text-sm text-muted-foreground'>
            Manage client relationships, track sales opportunities, and handle
            invoicing and payments seamlessly.
          </p>
        </div>

        <div className='rounded-lg border p-6 text-left'>
          <h3 className='mb-2 text-lg font-semibold'>Multi-Gallery Support</h3>
          <p className='text-sm text-muted-foreground'>
            Perfect for gallery networks, art dealers, and institutions managing
            multiple locations or brands.
          </p>
        </div>
      </div>
    </div>
  )
}
