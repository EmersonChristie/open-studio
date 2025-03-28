'use client'

import { ErrorPage } from './error-page'

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
  const actions =
    returnUrl !== '/'
      ? [{ type: 'back' as const, label: 'Go Back' }, { type: 'home' as const }]
      : [{ type: 'home' as const }]

  return (
    <ErrorPage
      statusCode={404}
      title='Page Not Found'
      message={message}
      className={className}
      actions={actions}
    />
  )
}
