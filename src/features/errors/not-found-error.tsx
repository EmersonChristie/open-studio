'use client'

import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NotFoundErrorProps {
  className?: string
  returnUrl?: string
  message?: string
}

export function NotFoundError({
  className,
  returnUrl = '/',
  message = "The page you're looking for doesn't exist or was moved.",
}: NotFoundErrorProps) {
  return (
    <div className={cn('h-svh', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Page Not Found</span>
        <p className='text-center text-muted-foreground'>{message}</p>
        <div className='mt-6 flex gap-4'>
          <Button asChild variant='outline'>
            <Link href={returnUrl}>
              <IconArrowLeft className='mr-2 h-4 w-4' />
              Go Back
            </Link>
          </Button>
          <Button
            asChild
            className='bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
          >
            <Link href='/'>Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
