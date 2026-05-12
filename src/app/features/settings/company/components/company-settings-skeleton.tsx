import { Building2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function CompanySettingsSkeleton() {
  return (
    <>
      <div className='space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Building2 className='text-muted-foreground h-5 w-5' />
            <h2 className='text-2xl font-bold tracking-tight'>
              Informasi Perusahaan
            </h2>
          </div>

          {/* Name field skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-4 w-48' />
          </div>

          {/* Address field skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-[100px] w-full' />
            <Skeleton className='h-4 w-56' />
          </div>

          {/* NPWP field skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-4 w-40' />
          </div>
        </div>

        <div className='flex justify-end pt-4'>
          <Skeleton className='h-10 w-40' />
        </div>
      </div>
    </>
  )
}
