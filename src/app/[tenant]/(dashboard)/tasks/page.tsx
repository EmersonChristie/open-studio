import { Suspense } from 'react'
import Tasks from '@/features/tasks'

export const metadata = {
  title: 'Tasks',
  description: 'Manage your tasks and to-dos',
}

// Loading skeleton for tasks
function TasksSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <div className='h-8 w-1/4 animate-pulse rounded-md bg-primary/10' />
        <div className='h-4 w-2/3 animate-pulse rounded-md bg-primary/10' />
      </div>
      <div className='h-[60vh] animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <Tasks />
    </Suspense>
  )
}
