'use client'

import { IconRefresh } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MaintenanceErrorProps {
  className?: string
  message?: string
  estimatedTime?: string
}

export function MaintenanceError({
  className,
  message = 'Our system is currently undergoing scheduled maintenance.',
  estimatedTime,
}: MaintenanceErrorProps) {
  const router = useRouter()

  return (
    <div className={cn('h-svh', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>Service Temporarily Unavailable</span>
        <p className='text-center text-muted-foreground'>
          {message}
          {estimatedTime && (
            <span className='mt-2 block'>
              Estimated time to completion: {estimatedTime}
            </span>
          )}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => router.back()}>
            Go Back
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className='bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
          >
            <IconRefresh className='mr-2 h-4 w-4' />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}
