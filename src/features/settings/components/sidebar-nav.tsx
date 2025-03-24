'use client'

import { useState, type JSX } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: JSX.Element
  }[]
  tenantId?: string
}

export default function SidebarNav({
  className,
  items,
  tenantId,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Extract the last part of the path for the default select value
  const [val, setVal] = useState(() => {
    const pathParts = pathname.split('/')
    const lastPart = pathParts[pathParts.length - 1]
    return lastPart === 'settings' ? '' : lastPart
  })

  // Add tenant prefix to hrefs if tenantId is provided (for Next.js App Router)
  const navItems = items.map((item) => {
    if (tenantId) {
      return {
        ...item,
        href: item.href.startsWith('/')
          ? item.href // Already has a leading slash
          : item.href === ''
            ? `/${tenantId}/settings`
            : `/${tenantId}/settings/${item.href}`,
      }
    }
    return item
  })

  const handleSelect = (value: string) => {
    setVal(value)

    // Find the matching item to navigate to
    const selectedItem = navItems.find((item) => {
      const parts = item.href.split('/')
      return (
        parts[parts.length - 1] === value ||
        (value === '' && parts[parts.length - 1] === 'settings')
      )
    })

    if (selectedItem) {
      router.push(selectedItem.href)
    }
  }

  return (
    <>
      <div className='p-1 md:hidden'>
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {navItems.map((item) => (
              <SelectItem
                key={item.href}
                value={item.href.split('/').pop() || ''}
              >
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span className='text-md'>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        orientation='horizontal'
        type='always'
        className='hidden w-full min-w-40 bg-background px-1 py-2 md:block'
      >
        <nav
          className={cn(
            'flex space-x-2 py-1 lg:flex-col lg:space-x-0 lg:space-y-1',
            className
          )}
          {...props}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                pathname === item.href
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start'
              )}
            >
              <span className='mr-2'>{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  )
}
