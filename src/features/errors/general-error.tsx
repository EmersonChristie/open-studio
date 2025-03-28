'use client'

import { ErrorPage } from './error-page'

interface GeneralErrorProps {
  error?: Error & { digest?: string }
  reset?: () => void
  className?: string
}

export function GeneralError({ error, reset, className }: GeneralErrorProps) {
  const actions = reset
    ? [{ type: 'refresh' as const }, { type: 'home' as const }]
    : [{ type: 'home' as const, label: 'Return to Home' }]

  return (
    <ErrorPage
      statusCode={500}
      title='Internal Server Error'
      message='We encountered an error while processing your request.'
      className={className}
      error={error}
      reset={reset}
      actions={actions}
    />
  )
}
