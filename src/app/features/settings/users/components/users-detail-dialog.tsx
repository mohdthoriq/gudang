import { type User } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type UserDetailDialogProps = {
  currentRow: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Pengguna</DialogTitle>
          <DialogDescription>
            Informasi pengguna yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Lengkap
            </h4>
            <p className='text-sm font-medium'>{currentRow.full_name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>Email</h4>
            <p className='text-sm'>{currentRow.email || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>Peran</h4>
            <p className='text-sm'>{currentRow.role?.name || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Perusahaan
            </h4>
            <p className='text-sm'>{currentRow.company?.name || '-'}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Status
            </h4>
            <p className='text-sm'>
              {currentRow.is_active ? 'Aktif' : 'Tidak Aktif'}
            </p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Verifikasi Email
            </h4>
            <p className='text-sm'>
              {currentRow.email_verified ? 'Terverifikasi' : 'Belum'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
