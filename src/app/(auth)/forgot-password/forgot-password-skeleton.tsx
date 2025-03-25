// Simple loading skeleton for forgot password form
export default function ForgotPasswordSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-4 w-3/4 animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}
