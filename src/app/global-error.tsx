'use client'

import { IconRefresh } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang='en'>
      <body>
        <div className='flex h-screen flex-col items-center justify-center'>
          <div className='space-y-4 text-center'>
            <h1 className='text-4xl font-bold tracking-tight'>
              Something went wrong
            </h1>
            <p className='text-muted-foreground'>
              A global error occurred in the application.
            </p>
            {error.message && (
              <p className='text-sm text-destructive'>{error.message}</p>
            )}
            <Button onClick={reset}>
              <IconRefresh className='mr-2 h-4 w-4' />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
