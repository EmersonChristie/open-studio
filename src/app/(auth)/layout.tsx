import AuthLayout from '@/features/auth/auth-layout'

export const metadata = {
  title: 'Authentication',
  description: 'Authentication pages for Open Studio',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
