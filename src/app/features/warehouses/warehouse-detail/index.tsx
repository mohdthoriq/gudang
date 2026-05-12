import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWarehouseDetail } from './hooks/use-warehouses-query' // Sesuaikan path-nya
import { WarehouseSummary } from './components/warehouses-summary'
import { WarehouseProductsTable } from './components/warehouses-product-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { WarehousesDetailHeader } from './components/warehouses-detail-header'
import { WarehousesProvider } from '../warehouse-list/components/warehouses-provider'

export default function WarehouseDetailView() {
  const search = useSearch({ strict: false }) as { id?: string; page?: string; limit?: string; search?: string }
  const navigate = useNavigate()

  // Ambil data gudang
  const { data: warehouse, isLoading } = useWarehouseDetail(search.id || '')

  // Tampilan saat Loading
  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center font-medium'>
        Memuat data gudang...
      </div>
    )
  }

  // Tampilan jika data tidak ditemukan
  if (!warehouse) {
    return (
      <div className="p-6">
        <Card className='flex h-[60vh] flex-col items-center justify-center gap-4'>
          <CardContent className='flex flex-col items-center gap-4'>
            <p className='text-muted-foreground'>Data gudang tidak ditemukan.</p>
            <Button onClick={() => navigate({ to: '/warehouses' })} variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Kembali ke Daftar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const queryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <WarehousesProvider paginationParams={queryParams}>
      <Card className='mb-4'>
        <WarehousesDetailHeader warehouse={warehouse} />
        
        <CardContent>
          <div className="mb-6 w-full">
            <WarehouseSummary />
          </div>

          <WarehouseProductsTable 
            warehouseId={warehouse.id} 
            search={search} 
            navigate={navigate as unknown as NavigateFn}
          />
        </CardContent>
      </Card>
    </WarehousesProvider>
  )
}
