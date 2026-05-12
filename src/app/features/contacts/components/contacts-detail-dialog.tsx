import { type Contact } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ContactsDetailDialogProps = {
  currentRow: Contact
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactsDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: ContactsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Kontak</DialogTitle>
          <DialogDescription>
            Detail informasi kontak yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Kontak
            </h4>
            <p className='text-sm font-medium'>{currentRow.name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Tipe Kontak
            </h4>
            <p className='text-sm'>{currentRow.type.name || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              No. Telepon
            </h4>
            <p className='text-sm'>{currentRow.phone || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>Email</h4>
            <p className='text-sm'>{currentRow.email || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Perusahaan
            </h4>
            <p className='text-sm'>{currentRow.company?.name || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Alamat
            </h4>
            <p className='text-sm'>{currentRow.address || '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
