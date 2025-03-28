'use client'

import { ReactNode, useEffect } from 'react'
import { IconArrowLeft, IconRefresh } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Define the props for different action button types
type ActionButton =
  | { type: 'back'; label?: string }
  | { type: 'home'; label?: string }
  | { type: 'refresh'; label?: string }
  | {
      type: 'custom'
      label: string
      href?: string
      onClick?: () => void
      icon?: ReactNode
    }

interface ErrorPageProps {
  statusCode: number | string
  title: string
  message: string | ReactNode
  className?: string
  errorDetails?: string
  actions?: ActionButton[]
  error?: Error & { digest?: string }
  reset?: () => void
  logError?: boolean
}

export function ErrorPage({
  statusCode,
  title,
  message,
  className,
  errorDetails,
  actions = [{ type: 'back' }, { type: 'home' }],
  error,
  reset,
  logError = true,
}: ErrorPageProps) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service if needed
    if (logError && error) {
      console.error(error)
    }
  }, [error, logError])

  // Handle back action
  const handleBack = () => {
    router.back()
  }

  // Handle refresh action
  const handleRefresh = () => {
    if (reset) {
      reset()
    } else {
      window.location.reload()
    }
  }

  // Render action button based on type
  const renderActionButton = (action: ActionButton, index: number) => {
    switch (action.type) {
      case 'back':
        return (
          <Button key={index} variant='outline' onClick={handleBack}>
            <IconArrowLeft className='mr-2 h-4 w-4' />
            {action.label || 'Go Back'}
          </Button>
        )
      case 'home':
        return (
          <Button
            key={index}
            asChild
            className='bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
          >
            <Link href='/'>{action.label || 'Back to Home'}</Link>
          </Button>
        )
      case 'refresh':
        return (
          <Button key={index} onClick={handleRefresh} variant='outline'>
            <IconRefresh className='mr-2 h-4 w-4' />
            {action.label || 'Try again'}
          </Button>
        )
      case 'custom':
        if (action.href) {
          return (
            <Button key={index} asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )
        }
        return (
          <Button key={index} onClick={action.onClick}>
            {action.icon && <span className='mr-2'>{action.icon}</span>}
            {action.label}
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn('h-svh', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>{statusCode}</h1>
        <span className='font-medium'>{title}</span>
        <div className='text-center text-muted-foreground'>
          {typeof message === 'string' ? <p>{message}</p> : message}
          {errorDetails && (
            <span className='mt-2 block rounded bg-muted p-2 font-mono text-sm'>
              {errorDetails}
            </span>
          )}
          {error?.message && !errorDetails && (
            <span className='mt-2 block rounded bg-muted p-2 font-mono text-sm'>
              {error.message}
            </span>
          )}
        </div>
        <div className='mt-6 flex gap-4'>{actions.map(renderActionButton)}</div>
      </div>
    </div>
  )
}
