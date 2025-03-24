import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Dashboard from '@/features/dashboard'

interface PageProps {
  params: {
    tenant: string
  }
}

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Gallery management dashboard',
}

export default async function TenantIndexPage({ params }: PageProps) {
  // Redirect from /[tenant] to /[tenant]/dashboard
  redirect(`/${params.tenant}/dashboard`)
}

function DashboardCard({
  title,
  description,
  count,
}: {
  title: string
  description: string
  count: number
}) {
  return (
    <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <div className='rounded-full bg-primary/10 p-2 text-primary'>
          {count}
        </div>
      </div>
      <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
      <div className='mt-4'>
        <a href='#' className='text-sm text-primary hover:underline'>
          View all
        </a>
      </div>
    </div>
  )
}
