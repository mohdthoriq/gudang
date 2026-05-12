import { ArrowLeft, Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { OrderListsTable } from './order-list-table'

export function OrderListFallback({
  search,
  navigate,
}: {
  search: Record<string, unknown>
  navigate: NavigateFn
}) {
  return (
    <Card className='relative'>
      <CardHeader className='pointer-events-none opacity-100 blur-[2px]'>
        <div className='flex justify-between'>
          <div className='mb-2 grid'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Pesanan Pembelian
            </h2>
            <p className='text-muted-foreground'>Kelola Pesanan Pembelian.</p>
          </div>
          <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
            <Button variant={'outline'} onClick={() => window.history.back()}>
              <ArrowLeft className='h-4 w-4' />
              Kembali
            </Button>
            <Button>
              <Plus className='h-4 w-4' />
              Tambah Pesanan
            </Button>
          </div>
        </div>
        <hr />
      </CardHeader>
      <CardContent className='pointer-events-none opacity-100 blur-[2px]'>
        <OrderListsTable search={search} navigate={navigate} />
      </CardContent>
      <UpgradePlanCard feature='List Pesanan Pembelian' />
    </Card>
  )
}
