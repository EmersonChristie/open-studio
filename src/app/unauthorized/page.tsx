import { UnauthorizedError } from '@/features/errors/unauthorized-error'

export const metadata = {
  title: '401 - Unauthorized Access',
  description: 'You need to log in to access this resource',
}

export default function UnauthorizedPage() {
  return <UnauthorizedError />
}
