'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ForbiddenErrorProps {
  className?: string
  message?: string
}

export function ForbiddenError({
  className,
  message = 'You do not have permission to access this resource.',
}: ForbiddenErrorProps) {
  const router = useRouter()

  return (
    <div className={cn('h-svh', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>403</h1>
        <span className='font-medium'>Access Forbidden</span>
        <p className='text-center text-muted-foreground'>{message}</p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/')}
            className='bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
