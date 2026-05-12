import { type TransactionType } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type TransactionTypesDetailDialogProps = {
  currentRow: TransactionType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionTypesDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: TransactionTypesDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Tipe Transaksi</DialogTitle>
          <DialogDescription>
            Detail informasi tipe transaksi yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] space-y-4 overflow-y-auto px-1'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Kode
              </h4>
              <p className='mt-1 text-sm font-mono font-semibold'>
                {currentRow.code}
              </p>
            </div>
            <div>
              <h4 className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                Nama
              </h4>
              <p className='mt-1 text-sm font-semibold'>{currentRow.name}</p>
            </div>
          </div>

          <div>
            <h4 className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
              Deskripsi
            </h4>
            <p className='mt-1 text-sm'>{currentRow.description || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
