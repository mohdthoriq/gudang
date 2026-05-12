import { Skeleton } from '@/components/ui/skeleton'

export function ReportSectionSkeleton() {
  return (
    <div className='flex animate-pulse flex-col gap-6'>
      {/* Section Header */}
      <div className='flex items-center justify-between rounded-md bg-slate-100/20 p-4'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-6 w-24' />
      </div>

      <div className='space-y-8'>
        {/* Category 1 */}
        <div className='space-y-4'>
          <Skeleton className='mx-4 h-7 w-48 border-b border-slate-200' />
          <div className='space-y-2 px-10'>
            <div className='flex justify-between border-b border-slate-100 py-2'>
              <div className='flex gap-4'>
                <Skeleton className='h-5 w-16' />
                <Skeleton className='h-5 w-40' />
              </div>
              <Skeleton className='h-5 w-24' />
            </div>
            <div className='flex justify-between border-b border-slate-100 py-2'>
              <div className='flex gap-4'>
                <Skeleton className='h-5 w-16' />
                <Skeleton className='h-5 w-32' />
              </div>
              <Skeleton className='h-5 w-24' />
            </div>
          </div>
          <div className='mx-4 flex justify-between border-b border-slate-200 p-4'>
            <Skeleton className='h-6 w-36' />
            <Skeleton className='h-6 w-28' />
          </div>
        </div>

        {/* Category 2 */}
        <div className='space-y-4'>
          <Skeleton className='mx-4 h-7 w-40 border-b border-slate-200' />
          <div className='space-y-2 px-10'>
            <div className='flex justify-between border-b border-slate-100 py-2'>
              <div className='flex gap-4'>
                <Skeleton className='h-5 w-16' />
                <Skeleton className='h-5 w-48' />
              </div>
              <Skeleton className='h-5 w-24' />
            </div>
          </div>
          <div className='mx-4 flex justify-between border-b border-slate-200 p-4'>
            <Skeleton className='h-6 w-36' />
            <Skeleton className='h-6 w-28' />
          </div>
        </div>
      </div>

      {/* Total Section */}
      <div className='mx-4 border-b border-slate-200 p-4'>
        <div className='flex justify-between'>
          <Skeleton className='h-7 w-40' />
          <Skeleton className='h-7 w-32' />
        </div>
      </div>
    </div>
  )
}
