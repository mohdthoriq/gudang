import { Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UpgradePlanCard } from '@/components/upgrade-plan-card'
import { ProductCategoryTable } from './product-category-table'

export function ProductCategoryFallback({
  search,
  navigate,
}: {
  search: Record<string, string>
  navigate: NavigateFn
}) {
  return (
    <div className='relative'>
      <Card className='pointer-events-none opacity-100 blur-[2px]'>
        <CardHeader>
          <div className='flex justify-between'>
            <div className='mb-2 grid'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Pengaturan Kategori Produk
              </h2>
              <p className='text-muted-foreground'>
                Kelola Kategori Produk di Perusahaan Anda.
              </p>
            </div>
            <div className='flex flex-col items-end gap-2 md:flex-row md:items-start'>
              <Button variant={'link'} onClick={() => history.go(-1)}>
                Kembali
              </Button>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Tambah Kategori
              </Button>
            </div>
          </div>
          <hr />
        </CardHeader>
        <CardContent>
          <ProductCategoryTable search={search} navigate={navigate} />
        </CardContent>
      </Card>
      <UpgradePlanCard feature='Kategori Produk' />
    </div>
  )
}
