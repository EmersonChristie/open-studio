'use client'

import { ErrorPage } from './error-page'

interface ForbiddenErrorProps {
  className?: string
  message?: string
}

export function ForbiddenError({
  className,
  message = 'You do not have permission to access this resource.',
}: ForbiddenErrorProps) {
  return (
    <ErrorPage
      statusCode={403}
      title='Access Forbidden'
      message={message}
      className={className}
      actions={[{ type: 'back' as const }, { type: 'home' as const }]}
    />
  )
}
