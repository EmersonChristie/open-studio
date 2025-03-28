'use client'

import { ReactNode } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import { ErrorPage } from './error-page'

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
  // Create a message that includes the estimated time if provided
  const fullMessage: ReactNode = (
    <>
      {message}
      {estimatedTime && (
        <span className='mt-2 block'>
          Estimated time to completion: {estimatedTime}
        </span>
      )}
    </>
  )

  return (
    <ErrorPage
      statusCode={503}
      title='Service Temporarily Unavailable'
      message={fullMessage}
      className={className}
      actions={[
        { type: 'back' as const },
        {
          type: 'custom' as const,
          label: 'Refresh',
          onClick: () => window.location.reload(),
          icon: <IconRefresh className='h-4 w-4' />,
        },
      ]}
    />
  )
}
