// import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { WarehousesTable } from './warehouses-table'
import { NavigateFn } from '@/hooks/use-table-url-state'

export function WarehousesFallback({
  search,
  navigate
}: {
  search: Record<string, unknown>
  navigate: NavigateFn
}) {
  return (
    <div className='relative'>
      <div className='pointer-events-none opacity-50 blur-sm'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='h-8 w-48 animate-pulse rounded bg-muted' />
          <div className='flex gap-2'>
            <div className='h-9 w-24 animate-pulse rounded bg-muted' />
            <div className='h-9 w-32 animate-pulse rounded bg-muted' />
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-3 mb-6'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='overflow-hidden shadow-sm border-none'>
              <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='h-10 w-10 rounded-full bg-muted animate-pulse' />
                  <div className='space-y-2'>
                    <div className='h-4 w-20 bg-muted animate-pulse rounded' />
                    <div className='h-6 w-32 bg-muted animate-pulse rounded' />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='shadow-sm border-none'>
          <CardHeader className='pb-0'>
            <div className='h-6 w-32 animate-pulse rounded bg-muted' />
          </CardHeader>
          <CardContent className='pt-6'>
            <WarehousesTable search={search} navigate={navigate} />
          </CardContent>
        </Card>
      </div>
        <UpgradePlanCard feature='Akses Modul Gudang' />
    </div>
  )
}
