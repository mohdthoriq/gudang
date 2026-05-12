'use client'

import { useLocation, useNavigate } from '@tanstack/react-router'
import { PERMISSION_KEY } from '@/constants/permissions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PermissionGuard } from '@/components/permission-guard'
import { ProductsFormContent } from './components/products-form-page'
import { ProductFormPageFallback } from './components/products-form-page-fallback'
import { useProductsByIdQuery } from './hooks/use-product-query'

export function ProductsForm() {
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as { currentRowId?: string } | undefined
  const currentRowId = state?.currentRowId

  const response = useProductsByIdQuery(
    currentRowId ? { id: currentRowId } : undefined
  )
  const currentRow = response.data

  return (
    <PermissionGuard
      permission={
        currentRow ? PERMISSION_KEY.PRODUCT_EDIT : PERMISSION_KEY.PRODUCT_ADD
      }
      fallback={<ProductFormPageFallback currentRow={currentRow} />}
    >
      <Card>
        <CardHeader className='flex flex-row justify-between'>
          <div className='flex flex-col gap-3'>
            <CardTitle>
              {currentRow ? 'Edit Produk' : 'Tambah Produk Baru'}
            </CardTitle>
            <CardDescription>
              Isi form dibawah ini untuk menambahkan produk baru
            </CardDescription>
          </div>
          <Button
            variant={'link'}
            onClick={() => navigate({ to: '/products' })}
          >
            Kembali
          </Button>
        </CardHeader>
        <CardContent>
          <ProductsFormContent currentRow={currentRow} />
        </CardContent>
      </Card>
    </PermissionGuard>
  )
}
