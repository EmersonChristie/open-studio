import { GeneralError } from '@/features/errors/general-error'

export const metadata = {
  title: 'Internal Server Error',
  description: 'Something went wrong on our server',
}

export default function ErrorPage() {
  return <GeneralError />
}
