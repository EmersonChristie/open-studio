'use client'

import { useEffect } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GeneralErrorProps {
  error?: Error & { digest?: string }
  reset?: () => void
  className?: string
}

export function GeneralError({ error, reset, className }: GeneralErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service only if it exists
    if (error) {
      console.error(error)
    }
  }, [error])

  return (
    <div className={cn('h-svh', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
        <span className='font-medium'>Internal Server Error</span>
        <p className='text-center text-muted-foreground'>
          We encountered an error while processing your request.
          {error?.message && (
            <span className='mt-2 block rounded bg-muted p-2 font-mono text-sm'>
              {error.message}
            </span>
          )}
        </p>
        <div className='mt-6 flex gap-4'>
          {reset ? (
            <Button onClick={reset} variant='outline'>
              <IconRefresh className='mr-2 h-4 w-4' />
              Try again
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = '/')}
              className='bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
            >
              Return to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
