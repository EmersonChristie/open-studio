import { Suspense } from 'react'
import Apps from '@/features/apps'

export const metadata = {
  title: 'Apps',
  description: 'Browse available apps and integrations',
}

// Loading skeleton for apps
function AppsSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <div className='h-8 w-1/4 animate-pulse rounded-md bg-primary/10' />
        <div className='h-4 w-2/3 animate-pulse rounded-md bg-primary/10' />
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='h-64 animate-pulse rounded-md bg-primary/10'
          />
        ))}
      </div>
    </div>
  )
}

export default function AppsPage() {
  return (
    <Suspense fallback={<AppsSkeleton />}>
      <Apps />
    </Suspense>
  )
}
