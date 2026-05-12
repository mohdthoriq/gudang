import type { Product } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { ProductsFormContent } from './products-form-page'

interface ProductFormPageFallbackProps {
  currentRow?: Product | null
}
export function ProductFormPageFallback({
  currentRow,
}: ProductFormPageFallbackProps) {
  return (
    <div className='relative'>
      <Card className='pointer-events-none opacity-100 blur-[2px]'>
        <CardHeader className='flex flex-row justify-between'>
          <div className='flex flex-col gap-3'>
            <CardTitle>
              {currentRow ? 'Edit Produk' : 'Tambah Produk Baru'}
            </CardTitle>
            <CardDescription>
              Isi form dibawah ini untuk menambahkan produk baru
            </CardDescription>
          </div>
          <Button variant={'link'} onClick={() => history.back()}>
            Kembali
          </Button>
        </CardHeader>
        <CardContent>
          <ProductsFormContent currentRow={currentRow} />
        </CardContent>
      </Card>
      <UpgradePlanCard feature={currentRow ? 'Edit Produk' : 'Tambah Produk'} />
    </div>
  )
}
