import { Metadata } from 'next'
import Dashboard from '@/features/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Gallery dashboard overview',
}

interface PageProps {
  params: {
    tenant: string
  }
}

export default function DashboardPage({ params }: PageProps) {
  return <Dashboard />
}
