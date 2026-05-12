import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { ProductListFallback } from './components/product-list-fallback'
import { ProductsDialogs } from './components/products-dialogs'
import { ProductsProvider } from './components/products-provider'
import { ProductsTable } from './components/products-table'
import type { ProductsQueryParams } from './hooks/use-product-list-query'

const route = getRouteApi('/_authenticated/products/')

function ProductsContent() {
  const search = route.useSearch() as Record<string, string>
  const navigate = route.useNavigate()

  return (
    <PermissionGuard
      permission={PERMISSION_KEY.PRODUCT}
      fallback={<ProductListFallback search={search} navigate={navigate} />}
    >
      <Card>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Produk
              </h2>
              <p className='text-muted-foreground'>
                Kelola Produk di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button onClick={() => navigate({ to: '/products/add' })}>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Produk
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <ProductsTable search={search} navigate={navigate} />
          <ProductsDialogs />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}

function Products() {
  const search = route.useSearch() as Record<string, string>

  const queryParams: ProductsQueryParams = {
    page: search?.page ? parseInt(search.page) : undefined,
    limit: search?.limit ? parseInt(search.limit) : undefined,
    search: search?.search ? search.search : undefined,
    category_id: search?.category_id ? search.category_id : undefined,
  }

  return (
    <ProductsProvider paginationParams={queryParams}>
      <ProductsContent />
    </ProductsProvider>
  )
}

export default Products
