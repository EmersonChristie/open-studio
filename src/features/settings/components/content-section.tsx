'use client'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

type ContentSectionProps = {
  title: string
  desc?: string
  className?: string
  children: React.ReactNode
}

export default function ContentSection({
  title,
  desc,
  className,
  children,
}: ContentSectionProps) {
  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        {desc && <p className='text-sm text-muted-foreground'>{desc}</p>}
      </div>
      <Separator className='my-4' />
      <ScrollArea>
        <div className='pb-2'>{children}</div>
      </ScrollArea>
    </div>
  )
}
