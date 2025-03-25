// Simple loading skeleton for sign-up form
export default function SignUpSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}
