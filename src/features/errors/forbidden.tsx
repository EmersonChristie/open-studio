'use client'

import { ErrorPage } from './error-page'

export default function ForbiddenError() {
  return (
    <ErrorPage
      statusCode={403}
      title='Access Forbidden'
      message="You don't have necessary permission to view this resource."
      actions={[{ type: 'back' as const }, { type: 'home' as const }]}
    />
  )
}
