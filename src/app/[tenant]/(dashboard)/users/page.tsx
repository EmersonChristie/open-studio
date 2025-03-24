import { Suspense } from 'react'
import Users from '@/features/users'

export const metadata = {
  title: 'Users',
  description: 'Manage your users and team members',
}

// Loading skeleton for users
function UsersSkeleton() {
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

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersSkeleton />}>
      <Users />
    </Suspense>
  )
}
