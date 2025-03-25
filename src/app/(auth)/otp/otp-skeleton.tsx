// Simple loading skeleton for OTP form
export default function OTPSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-8 w-full animate-pulse rounded-md bg-primary/10' />
      <div className='h-4 w-3/4 animate-pulse rounded-md bg-primary/10' />
      <div className='flex justify-between space-x-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='h-12 w-12 animate-pulse rounded-md bg-primary/10'
          />
        ))}
      </div>
      <div className='h-10 w-full animate-pulse rounded-md bg-primary/10' />
    </div>
  )
}
