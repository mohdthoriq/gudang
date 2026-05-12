import { getRouteApi } from '@tanstack/react-router'
import { Plus, Printer } from 'lucide-react'
// import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WarehousesDialogs } from './components/warehouses-dialogs'
import { WarehousesProvider, useWarehouses } from './components/warehouses-provider'
import { WarehousesTable } from './components/warehouses-table'
import type { WarehouseQueryParams } from './hooks/use-warehouses-query'

const route = getRouteApi('/_authenticated/warehouses/')

function WarehousesContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()
  const { setOpen } = useWarehouses()

  return (
    // <PermissionGuard
    //   permission={PERMISSION_KEY.WAREHOUSE}
    //   fallback={<WarehousesFallback search={search} navigate={navigate} />}
    // >
    <div className='space-y-4'> {/* Mengurangi space-y agar tidak terlalu jauh dengan atas */}
      <Card className='shadow-sm border'> 
        {/* 👇 HEADER SEKARANG BERISI JUDUL DAN TOMBOL */}
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='text-2xl font-bold tracking-tight'>
                Inventori
              </CardTitle>
              <CardDescription>
                Kelola data, lokasi, dan kapasitas semua gudang perusahaan Anda di sini.
              </CardDescription>
            </div>

            {/* Tombol Aksi dipindah ke sini agar sejajar dengan Judul */}
            <div className='flex items-center gap-2'>
              <Button 
                onClick={() => setOpen('add')} 
                size='sm' 
                className='h-8 bg-blue-600 hover:bg-blue-700'
              >
                <Plus className='mr-2 h-4 w-4' /> Tambah Gudang
              </Button>
              <Button variant='outline' size='sm' className='h-8'>
                <Printer className='mr-2 h-4 w-4' /> Cetak
              </Button>
            </div>
          </div>
        </CardHeader>
        <hr />
        <CardContent>
          <WarehousesTable search={search} navigate={navigate} />
          <WarehousesDialogs />
        </CardContent>
      </Card>
    </div>
    // </PermissionGuard>
  )
}

function Warehouses() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: WarehouseQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
  }

  return (
    <WarehousesProvider paginationParams={queryParams}>
      <WarehousesContent />
    </WarehousesProvider>
  )
}

export default Warehouses
