import { ForbiddenError } from '@/features/errors/forbidden-error'

export const metadata = {
  title: '403 - Forbidden Access',
  description: 'You do not have permission to access this resource',
}

export default function ForbiddenPage() {
  return <ForbiddenError />
}
