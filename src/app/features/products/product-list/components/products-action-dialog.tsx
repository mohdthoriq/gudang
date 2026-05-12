'use client'

import { type Product } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProductsFormContent } from '@/features/products/product-form/components/products-form-page'

type ProductActionDialogProps = {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (data: Product) => void
}

export function ProductActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ProductActionDialogProps) {
  const isEdit = !!currentRow

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Update Produk' : 'Tambah Produk'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update produk disini.'
              : 'Tambah produk baru untuk Perusahaan Anda.'}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <ProductsFormContent currentRow={currentRow} onSuccess={onSuccess} isModal />
        </div>
      </DialogContent>
    </Dialog>
  )
}
