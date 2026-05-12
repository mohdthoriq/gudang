import { Skeleton } from '@/components/ui/skeleton'

export function CompanyRolesFormSkeleton() {
  return (
    <div className='flex-1 p-8 space-y-4'>
      <Skeleton className='h-8 w-1/4' />
      <div className='grid gap-4 md:grid-cols-2'>
        <Skeleton className='h-[400px]' />
        <Skeleton className='h-[400px]' />
      </div>
    </div>
  )
}
