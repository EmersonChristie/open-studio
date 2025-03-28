'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarLogoProps {
  className?: string
}

export function SidebarLogo({ className }: SidebarLogoProps) {
  return (
    <Link
      href='/'
      className={cn(
        'flex items-center font-medium transition-colors',
        className
      )}
    >
      <span className='mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
        OS
      </span>
      <span className='font-semibold'>Open Studio</span>
    </Link>
  )
}
