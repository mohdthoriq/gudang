import { type Permission } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type PermissionsDetailDialogProps = {
  currentRow: Permission
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermissionsDetailDialog({
  currentRow,
  open,
  onOpenChange,
}: PermissionsDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Detail Permission</DialogTitle>
          <DialogDescription>
            Detail informasi permission yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Permission
            </h4>
            <p className='text-sm font-medium'>{currentRow.name}</p>
          </div>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Deskripsi
            </h4>
            <p className='text-sm'>{currentRow.description || '-'}</p>
          </div>
          {/* <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Nama Parent
            </h4>
            <p className='text-sm'>{currentRow.parent_id?.name || '-'}</p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
