import { Skeleton } from '@/components/ui/skeleton'

export function BalanceSheetOverviewSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className='bg-card text-card-foreground flex h-[150px] flex-col gap-4 rounded-xl border p-6 shadow-sm'
        >
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[60%]' />
        </div>
      ))}
    </div>
  )
}
