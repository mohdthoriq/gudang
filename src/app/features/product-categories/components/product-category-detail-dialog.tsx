import { type ProductCategory } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ProductCategoryDetailDialogProps = {
  currentRow: ProductCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: ProductCategoryDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Kategori Produk</DialogTitle>
          <DialogDescription>
            Detail informasi kategori produk yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Kategori Produk
            </h4>
            <p className='text-sm font-medium'>{currentRow.name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Deskripsi
            </h4>
            <p className='text-sm'>{currentRow.description || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
