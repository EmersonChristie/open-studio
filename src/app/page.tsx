import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-bold'>Open Studio</h1>
        <p className='text-xl text-muted-foreground'>
          A multi-tenant gallery management platform
        </p>
      </div>

      <div className='w-full max-w-xl space-y-6'>
        <div className='rounded-lg border p-6'>
          <h2 className='mb-4 text-2xl font-semibold'>Migration Progress</h2>
          <ul className='space-y-2 text-left'>
            <li className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> Next.js project
              structure
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> Core dependencies
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> Multi-tenant routing
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> Dashboard, Settings,
              Tasks, Users, Chats, Apps pages
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-emerald-500'>✓</span> Authentication pages
            </li>
            <li className='flex items-center gap-2'>
              <span className='text-amber-500'>⟳</span> Routes migration in
              progress
            </li>
          </ul>
        </div>

        <Button asChild size='lg' className='w-full'>
          <Link href='/demo-gallery/dashboard'>
            Go to Demo Gallery Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
