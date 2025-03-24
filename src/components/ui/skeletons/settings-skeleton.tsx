'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function SettingsSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='space-y-2'>
        <Skeleton className='h-8 w-1/4' />
        <Skeleton className='h-4 w-2/3' />
      </div>

      {/* Form Skeleton */}
      <div className='space-y-8'>
        <div className='space-y-4'>
          <Skeleton className='h-4 w-1/6' />
          <Skeleton className='h-10 w-full' />
        </div>

        <div className='space-y-4'>
          <Skeleton className='h-4 w-1/6' />
          <Skeleton className='h-10 w-full' />
        </div>

        <div className='space-y-4'>
          <Skeleton className='h-4 w-1/6' />
          <Skeleton className='h-24 w-full' />
        </div>

        <div className='space-y-4'>
          <Skeleton className='h-4 w-1/6' />
          <div className='flex space-x-2'>
            <Skeleton className='h-10 w-10' />
            <Skeleton className='h-10 w-10' />
          </div>
        </div>

        {/* Submit Button Skeleton */}
        <Skeleton className='h-10 w-20' />
      </div>
    </div>
  )
}
