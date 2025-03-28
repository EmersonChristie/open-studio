'use client'

import { ErrorPage } from './error-page'

interface UnauthorizedErrorProps {
  className?: string
  message?: string
}

export function UnauthorizedError({
  className,
  message = 'Please log in with the appropriate credentials to access this resource.',
}: UnauthorizedErrorProps) {
  return (
    <ErrorPage
      statusCode={401}
      title='Unauthorized Access'
      message={message}
      className={className}
      actions={[{ type: 'back' as const }, { type: 'home' as const }]}
    />
  )
}
