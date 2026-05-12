import { Card } from '@/components/ui/card'
import { useWarehousesSummary } from '../hooks/use-warehouses-summary-query' // Sesuaikan path ini dengan lokasimu

export interface WarehouseSummaryData {
  total_stock: number
  total_hpp: number
  total_value: number
  stock_per_warehouse: Array<{
    name: string
    total_qty: number
    total_value: number
  }>
}

export function WarehouseSummary() {
  const { data: summary, isLoading } = useWarehousesSummary()

  if (isLoading) {
    return <div className="h-64 animate-pulse bg-muted rounded-xl mb-8" />
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>

      <Card className='flex flex-row items-center p-6 gap-4 shadow-sm'>
        <div className='w-12 h-12 rounded-full bg-green-200/50 flex-shrink-0' />
        <div className='flex flex-col justify-center'>
          <h4 className='text-xl font-bold'>{summary?.total_stock ?? 0}</h4>
          <p className='text-sm text-muted-foreground'>Total Stok</p>
        </div>
      </Card>

      <Card className='flex flex-row items-center p-6 gap-4 shadow-sm'>
        <div className='w-12 h-12 rounded-full bg-orange-200/50 flex-shrink-0' />
        <div className='flex flex-col justify-center'>
          <h4 className='text-xl font-bold'>{summary?.total_value ?? 0}</h4>
          <p className='text-sm text-muted-foreground'>Total Nilai Produk</p>
        </div>
      </Card>

      <Card className='flex flex-row items-center p-6 gap-4 shadow-sm'>
        <div className='w-12 h-12 rounded-full bg-pink-200/50 flex-shrink-0' />
        <div className='flex flex-col justify-center'>
          <h4 className='text-xl font-bold'>{summary?.total_hpp ?? 0}</h4>
          <p className='text-sm text-muted-foreground'>Total HPP</p>
        </div>
      </Card>

    </div>
  )
}