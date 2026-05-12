import { type AccountCategory } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type AccountCategoriesDetailDialogProps = {
  currentRow: AccountCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountCategoriesDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: AccountCategoriesDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Kategori Akun</DialogTitle>
          <DialogDescription>
            Detail informasi kategori akun yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] space-y-4 overflow-y-auto px-1'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Nama Kategori
              </h4>
              <p className='mt-1 text-sm font-semibold'>{currentRow.name}</p>
            </div>
            <div>
              <h4 className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Sistem
              </h4>
              <div className='mt-1'>
                {currentRow.is_system ? (
                  <span className='inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'>
                    Ya
                  </span>
                ) : (
                  <span className='inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground'>
                    Tidak
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
              Deskripsi
            </h4>
            <p className='mt-1 text-sm'>{currentRow.description || '-'}</p>
          </div>

          <div className='border-t pt-4'>
            <h4 className='text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider'>
              Transaksi Diizinkan
            </h4>
            <div className='flex flex-wrap gap-2'>
              {currentRow.allowed_transactions?.length ? (
                currentRow.allowed_transactions.map((t) => (
                  <span
                    key={t.id}
                    className='inline-flex items-center rounded border bg-secondary px-2 py-1 text-xs font-medium'
                  >
                    {t.name} ({t.code})
                  </span>
                ))
              ) : (
                <p className='text-muted-foreground text-sm italic'>
                  Tidak ada transaksi yang diizinkan.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
