import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='space-y-4 text-center'>
        <h1 className='text-4xl font-bold tracking-tight'>404</h1>
        <h2 className='text-2xl font-semibold'>Page Not Found</h2>
        <p className='text-muted-foreground'>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href='/'>
            <IconArrowLeft className='mr-2 h-4 w-4' />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
