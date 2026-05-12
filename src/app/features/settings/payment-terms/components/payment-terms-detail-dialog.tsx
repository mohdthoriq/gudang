import type { PaymentTerm } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type PaymentTermsDetailDialogProps = {
  currentRow: PaymentTerm
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentTermsDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: PaymentTermsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Termin Pembayaran</DialogTitle>
          <DialogDescription>
            Detail informasi termin pembayaran yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Termin Pembayaran
            </h4>
            <p className='text-sm font-medium'>{currentRow.name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>Hari</h4>
            <p className='text-sm'>{currentRow.days || 0}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Perusahaan
            </h4>
            <p className='text-sm'>{currentRow.company?.name || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
