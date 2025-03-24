import { Suspense } from 'react'
import Chats from '@/features/chats'

export const metadata = {
  title: 'Chats',
  description: 'Chat with your team and clients',
}

// Loading skeleton for chats
function ChatsSkeleton() {
  return (
    <div className='h-screen animate-pulse bg-primary/10'>
      <div className='flex h-full'>
        <div className='w-1/4 border-r border-border' />
        <div className='flex-1' />
      </div>
    </div>
  )
}

export default function ChatsPage() {
  return (
    <Suspense fallback={<ChatsSkeleton />}>
      <Chats />
    </Suspense>
  )
}
